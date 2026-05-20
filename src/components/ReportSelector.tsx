import React from "react";
import { Plus, Search, RefreshCw, FileDown, FileUp, Clipboard, Trash2, CheckCircle } from "lucide-react";
import { MedicalReport } from "../types";

interface ReportSelectorProps {
  reports: MedicalReport[];
  currentReportId: string;
  onSelectReport: (id: string) => void;
  onAddReport: () => void;
  onDeleteReport: (id: string) => void;
  onRestoreDefault: () => void;
  onImportBackup: (data: string) => boolean;
  onExportBackup: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const ReportSelector: React.FC<ReportSelectorProps> = ({
  reports,
  currentReportId,
  onSelectReport,
  onAddReport,
  onDeleteReport,
  onRestoreDefault,
  onImportBackup,
  onExportBackup,
  searchTerm,
  onSearchChange,
}) => {
  const [importError, setImportError] = React.useState<string | null>(null);
  const [importSuccess, setImportSuccess] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const filteredReports = reports.filter((report) => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return true;
    return (
      report.personal.fullName.toLowerCase().includes(query) ||
      report.personal.passportNo.toLowerCase().includes(query) ||
      report.personal.regNo.toLowerCase().includes(query)
    );
  });

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        
        const success = onImportBackup(text);
        if (success) {
          setImportSuccess(true);
          setImportError(null);
          setTimeout(() => setImportSuccess(false), 3000);
        } else {
          setImportError("Format mismatch. Make sure it is a valid report JSON.");
        }
      } catch (err) {
        setImportError("Invalid JSON file selected.");
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // clear input
  };

  return (
    <div id="report-selector-container" className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Clipboard className="w-5 h-5 text-indigo-600" id="report-selector-title-icon" />
            Medical Records Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Search, edit, backup, or create custom candidate medical profiles.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* New Report */}
          <button
            onClick={onAddReport}
            id="btn-add-report"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium cursor-pointer transition-all duration-150 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            New Report
          </button>

          {/* Backup Buttons */}
          <button
            onClick={onExportBackup}
            id="btn-export-backup"
            title="Download JSON Backup"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer transition"
          >
            <FileDown className="w-3.5 h-3.5" />
            Backup
          </button>

          <button
            onClick={handleImportClick}
            id="btn-import-backup"
            title="Restore from JSON Backup"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer transition"
          >
            <FileUp className="w-3.5 h-3.5" />
            Restore
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
            id="backup-file-input"
          />

          {/* Restore Template */}
          <button
            onClick={onRestoreDefault}
            id="btn-restore-template"
            title="Reset to Original Vhabesh Sarker Image Data"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/50 rounded-lg text-xs font-medium cursor-pointer transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Original
          </button>
        </div>
      </div>

      {/* Search and status labels */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by full name, passport ID, or registration number..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            id="report-search-input"
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition"
          />
        </div>

        {/* Feedback notices */}
        {importError && (
          <div className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium flex items-center gap-1">
            <span>{importError}</span>
          </div>
        )}
        {importSuccess && (
          <div className="px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-medium flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Restore completed successfully!</span>
          </div>
        )}
      </div>

      {/* Directory Cards list */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredReports.map((report) => {
          const isSelected = report.id === currentReportId;
          return (
            <div
              key={report.id}
              onClick={() => onSelectReport(report.id)}
              id={`report-card-${report.id}`}
              className={`group flex items-start justify-between p-3 rounded-lg border cursor-pointer transition relative ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50/40 ring-1 ring-indigo-500/10"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-semibold text-slate-800 text-xs truncate max-w-[120px]">
                    {report.personal.fullName || "Unnamed Candidate"}
                  </h4>
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      report.config.medicalStatus === "FIT"
                        ? "bg-emerald-100/70 text-emerald-700"
                        : report.config.medicalStatus === "UNFIT"
                        ? "bg-rose-100/70 text-rose-700"
                        : "bg-amber-100/70 text-amber-700"
                    }`}
                  >
                    {report.config.medicalStatus}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 flex flex-col font-mono">
                  <span>Reg: {report.personal.regNo || "N/A"}</span>
                  <span>Pass: {report.personal.passportNo || "N/A"}</span>
                </p>
              </div>

              {/* Delete record */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Are you sure you want to delete this candidate profile? This cannot be undone.")) {
                    onDeleteReport(report.id);
                  }
                }}
                id={`btn-delete-${report.id}`}
                disabled={reports.length === 1}
                title="Delete this record"
                className={`p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer self-start ${
                  reports.length === 1 ? "opacity-30 cursor-not-allowed" : "opacity-0 group-hover:opacity-100 focus:opacity-100"
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}

        {filteredReports.length === 0 && (
          <div className="col-span-full py-6 text-center text-slate-400 text-xs font-medium bg-slate-50 rounded-lg border border-dashed border-slate-200">
            No report files match your current search terms.
          </div>
        )}
      </div>
    </div>
  );
};
