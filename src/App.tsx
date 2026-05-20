import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileHeart, FileText, Search, UserPlus, Info, CheckCircle2 } from "lucide-react";
import { MedicalReport } from "./types";
import { initialReport } from "./presets";
import { ReportSelector } from "./components/ReportSelector";
import { ReportEditor } from "./components/ReportEditor";
import { ReportPreview } from "./components/ReportPreview";
import { downloadReportAsPdf } from "./utils/pdfGenerator";

const LOCAL_STORAGE_KEY = "aljabbarmen_medical_reports";

export default function App() {
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [currentId, setCurrentId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showSaveNotification, setShowSaveNotification] = useState<boolean>(false);

  // Load database from LocalStorage or initialize with defaults
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as MedicalReport[];
        if (parsed.length > 0) {
          setReports(parsed);
          setCurrentId(parsed[0].id);
          return;
        }
      } catch (e) {
        console.error("Local records parse failed, resetting template.");
      }
    }
    // Setup initial report template matching user's image request
    setReports([initialReport]);
    setCurrentId(initialReport.id);
  }, []);

  // Save database on record modification
  const saveToLocalStorage = (latestReports: MedicalReport[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(latestReports));
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 900);
  };

  // Select profile
  const handleSelectReport = (id: string) => {
    setCurrentId(id);
  };

  // Update report
  const handleUpdateReport = (updated: MedicalReport) => {
    const updatedList = reports.map((r) => (r.id === updated.id ? updated : r));
    setReports(updatedList);
    saveToLocalStorage(updatedList);
  };

  // Create a brand new blank medical report
  const handleAddReport = () => {
    const nextIndex = reports.length + 1;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newRegId = `AJ-26-${randomSuffix}`;
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, "0")}.${(today.getMonth() + 1).toString().padStart(2, "0")}.${today.getFullYear()}`;

    const newReport: MedicalReport = {
      ...JSON.parse(JSON.stringify(initialReport)),
      id: newRegId,
      createdAt: today.toISOString().split("T")[0],
      personal: {
        ...initialReport.personal,
        regNo: newRegId,
        dateOfExam: formattedDate,
        fullName: `NEW CANDIDATE #${nextIndex}`,
        fatherName: "",
        motherName: "",
        passportNo: "",
        candidatePhoto: "" // Triggers photo fallback frame
      },
      config: {
        ...initialReport.config,
        medicalStatus: "FIT",
        medicalStatusText: "For the above mentioned tests"
      }
    };

    const expandedList = [newReport, ...reports];
    setReports(expandedList);
    setCurrentId(newRegId);
    saveToLocalStorage(expandedList);
  };

  // Remove report
  const handleDeleteReport = (id: string) => {
    if (reports.length <= 1) return;
    const filtered = reports.filter((r) => r.id !== id);
    setReports(filtered);
    setCurrentId(filtered[0].id);
    saveToLocalStorage(filtered);
  };

  // Restore back to original template (Obydullah Haque image template)
  const handleRestoreDefault = () => {
    if (confirm("This will replace the current active report profile and restore it back to the original database info matching the user's latest image. Continue?")) {
      const resetList = reports.map((r) => r.id === currentId ? { ...initialReport, id: currentId, personal: { ...initialReport.personal, regNo: currentId } } : r);
      setReports(resetList);
      saveToLocalStorage(resetList);
    }
  };

  // Import Backup logic
  const handleImportBackup = (rawJson: string): boolean => {
    try {
      const parsed = JSON.parse(rawJson);
      // Basic heuristic verification
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].personal && parsed[0].physical) {
        setReports(parsed);
        setCurrentId(parsed[0].id);
        saveToLocalStorage(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Download raw JSON backup
  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reports, null, 2));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `Al_Jabbar_Medical_Database_Backup_${new Date().toISOString().split("T")[0]}.json`);
    dlAnchorElem.click();
  };

  // High fidelity PDF export triggered
  const handleDownloadPdf = async () => {
    const currentReport = reports.find((r) => r.id === currentId);
    if (!currentReport) return;
    
    // Create clean file name based on candidate's name
    const sanitizedName = (currentReport.personal.fullName || "Candidate")
      .trim()
      .replace(/[^a-zA-Z0-9]/g, "_");
    
    await downloadReportAsPdf(
      "medical-report-a4-paper",
      `Medical_Report_${sanitizedName}.pdf`,
      (loading) => setIsExporting(loading)
    );
  };

  const activeReport = reports.find((r) => r.id === currentId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="medical-flow-app">
      
      {/* Dynamic Saving Notification */}
      <AnimatePresence>
        {showSaveNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            id="autosave-popup"
            className="fixed top-4 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white backdrop-blur-xs px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 shadow-lg z-50 select-none"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Saved & Synced Successfully
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Top Header Navbar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 px-5 py-3.5 flex items-center justify-between" id="applet-nav-header">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-600/10">
            <FileHeart className="w-5 h-5" id="nav-brand-logo-icon" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-800 tracking-tight leading-none">AL-JABBAR</h1>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 block">Medical Report Workspace</span>
          </div>
        </div>

        {/* Tip text */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-slate-100/50 px-3 py-1.5 rounded-lg border border-slate-200/40">
          <Info className="w-3.5 h-3.5 text-indigo-500" />
          <span>Double click on any field in the paper preview to edit text inline!</span>
        </div>
      </header>

      {/* Application core content sheets */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full flex flex-col" id="app-workspace-body">
        
        {/* Report Explorer bar (Search & database listings) */}
        <ReportSelector
          reports={reports}
          currentReportId={currentId}
          onSelectReport={handleSelectReport}
          onAddReport={handleAddReport}
          onDeleteReport={handleDeleteReport}
          onRestoreDefault={handleRestoreDefault}
          onImportBackup={handleImportBackup}
          onExportBackup={handleExportBackup}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Workspace Dual splits */}
        {activeReport ? (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch flex-1" id="dual-workspace-panes">
            
            {/* Form Builder controls Column */}
            <div className="xl:col-span-5 h-full">
              <ReportEditor
                report={activeReport}
                onUpdateReport={handleUpdateReport}
              />
            </div>

            {/* A4 Paper printable view Column */}
            <div className="xl:col-span-7 flex flex-col h-full bg-slate-800 rounded-xl" style={{ minWidth: "820px" }}>
              <ReportPreview
                report={activeReport}
                onUpdateReport={handleUpdateReport}
                isExporting={isExporting}
                onDownloadPdf={handleDownloadPdf}
              />
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 text-center text-slate-500">
            <UserPlus className="w-12 h-12 text-slate-300 animate-pulse mb-3" />
            <h3 className="font-semibold text-slate-700">No profile files loaded</h3>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              Select or generate a medical file above to start working.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
