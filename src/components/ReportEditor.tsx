import React from "react";
import {
  User,
  HeartPulse,
  Activity,
  CheckSquare,
  FileText,
  Upload,
  UserCheck,
  RotateCcw,
  RefreshCw,
  Building2,
  Trash2,
  Lock,
  Brush
} from "lucide-react";
import { MedicalReport } from "../types";
import { PRESETS as defaultPresets, DEFAULT_AVATAR, DEFAULT_CHECKED_SIGNATURE, DEFAULT_DOCTOR_SIGNATURE } from "../presets";

// Custom premium illustrative avatar SVG datasets for easy clicking
const PREBUILT_AVATARS = [
  {
    name: "Modern Male 1",
    data: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="%23e0f2fe"/><circle cx="50" cy="40" r="22" fill="%23a5f3fc"/><path d="M50,18 C45,18 42,22 41,25 C40,28 42,32 45,33 C42,35 40,38 40,42 C30,42 20,55 20,70 L80,70 C80,55 70,42 60,42 C60,38 58,35 55,33 C58,32 60,28 59,25 C58,22 55,18 50,18 Z" fill="%230284c7"/><path d="M50,18 C42,18 35,28 35,38 L65,38 C65,28 58,18 50,18 Z" fill="%230f172a" opacity="0.35"/><circle cx="43" cy="36" r="2.5" fill="%230f172a"/><circle cx="57" cy="36" r="2.5" fill="%230f172a"/><path d="M46,46 Q50,50 54,46" fill="none" stroke="%230f172a" stroke-width="2" stroke-linecap="round"/><rect x="25" y="70" width="50" height="30" rx="4" fill="%23ea580c"/></svg>`
  },
  {
    name: "Modern Female 1",
    data: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="%23fce7f3"/><circle cx="50" cy="40" r="22" fill="%23fbcfe8"/><path d="M50,18 C40,18 32,24 32,38 L68,38 C68,24 60,18 50,18 Z" fill="%23db2777"/><path d="M32,38 C28,45 28,55 28,70 L72,70 C72,55 72,45 68,38 Z" fill="%23be185d"/><circle cx="43" cy="36" r="2" fill="%231e293b"/><circle cx="57" cy="36" r="2" fill="%231e293b"/><path d="M47,45 Q50,48 53,45" fill="none" stroke="%231e293b" stroke-width="2" stroke-linecap="round"/><rect x="25" y="70" width="50" height="30" rx="4" fill="%230284c7"/></svg>`
  },
  {
    name: "Professional Male 2",
    data: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="%23f1f5f9"/><circle cx="50" cy="38" r="21" fill="%23fed7aa"/><path d="M50,17 C42,17 38,20 37,25 C36,30 38,36 44,38 L56,38 C62,36 64,30 63,25 C62,20 58,17 50,17 Z" fill="%23b45309"/><path d="M22,72 C22,60 30,50 45,46 C45,42 42,40 40,38 C32,38 20,53 20,72 Z" fill="%231e293b"/><path d="M78,72 C78,60 70,50 55,46 C55,42 58,40 60,38 C68,38 80,53 80,72 Z" fill="%231e293b"/><circle cx="43" cy="36" r="2" fill="%231e293b"/><circle cx="57" cy="36" r="2" fill="%231e293b"/><path d="M47,45 Q50,48 53,45" fill="none" stroke="%231e293b" stroke-width="2" stroke-linecap="round"/><rect x="35" y="46" width="30" height="26" fill="%23ffffff"/><path d="M35,46 L50,60 L65,46" fill="none" stroke="%230284c7" stroke-width="3"/></svg>`
  },
  {
    name: "Candidate Photo 4",
    data: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="%23fef3c7"/><circle cx="50" cy="38" r="22" fill="%23ffedd5"/><path d="M50,16 C42,16 34,22 34,35 C34,48 42,48 50,48 C58,48 66,48 66,35 C66,22 58,16 50,16 Z" fill="%23065f46" opacity="0.9"/><circle cx="44" cy="35" r="2" fill="%23111827"/><circle cx="56" cy="35" r="2" fill="%23111827"/><path d="M47,43 Q50,46 53,43" fill="none" stroke="%23111827" stroke-width="1.5" stroke-linecap="round"/><path d="M20,70 C20,52 35,48 50,48 C65,48 80,52 80,70 L80,100 L20,100 Z" fill="%23be123c"/></svg>`
  }
];

interface ReportEditorProps {
  report: MedicalReport;
  onUpdateReport: (report: MedicalReport) => void;
}

export const ReportEditor: React.FC<ReportEditorProps> = ({ report, onUpdateReport }) => {
  const [activeTab, setActiveTab] = React.useState<"brand" | "candidate" | "examination" | "laboratory" | "outcome" | "stamps">("candidate");
  const [dragging, setDragging] = React.useState(false);
  
  // Custom pointer drawing signature state
  const [showSignaturePad, setShowSignaturePad] = React.useState<"checkedBy" | "medicalOfficer" | null>(null);
  const signatureCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);

  // Deep update wrapper to avoid bugs
  const updateReportField = (path: string[], value: any) => {
    const updated = JSON.parse(JSON.stringify(report)) as any;
    let current = updated;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    onUpdateReport(updated);
  };

  // Draggable File Drop triggers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      loadImage(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadImage(file);
    }
  };

  const loadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        updateReportField(["personal", "candidatePhoto"], event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const selectPrebuiltAvatar = (avatarData: string) => {
    updateReportField(["personal", "candidatePhoto"], avatarData);
  };

  // Set all physical values to Normal helper
  const handleSetPhysicalNormal = () => {
    const updated = JSON.parse(JSON.stringify(report)) as MedicalReport;
    updated.physical = {
      ...updated.physical,
      ...defaultPresets.normalPhysical
    };
    onUpdateReport(updated);
  };

  // Set all lab values to Normal helper
  const handleSetLabsNormal = () => {
    const updated = JSON.parse(JSON.stringify(report)) as MedicalReport;
    updated.laboratory.serology = {
      ...updated.laboratory.serology,
      hbsag: defaultPresets.normalLabs.hbsag,
      vdrl: defaultPresets.normalLabs.vdrl,
      tpha: defaultPresets.normalLabs.tpha
    };
    updated.laboratory.biochemical = {
      sBilirubin: defaultPresets.normalLabs.sBilirubin,
      sugarRandom: defaultPresets.normalLabs.sugarRandom
    };
    updated.laboratory.hematology = {
      hemoglobin: defaultPresets.normalLabs.hemoglobin
    };
    updated.laboratory.urine = {
      pregnancyTest: defaultPresets.normalLabs.pregnancyTest
    };
    onUpdateReport(updated);
  };

  // Signature Pad drawing logic
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = "#1e3a8a"; // Nice ink blue signature
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignaturePad = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignaturePad = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");

    if (showSignaturePad === "checkedBy") {
      updateReportField(["footer", "checkedBy", "signature"], dataUrl);
    } else if (showSignaturePad === "medicalOfficer") {
      updateReportField(["footer", "medicalOfficer", "signature"], dataUrl);
    }
    
    setShowSignaturePad(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full" id="report-editor-card">
      {/* Editor Headers */}
      <div className="border-b border-slate-100 bg-slate-50/50 p-4">
        <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-indigo-600" id="editor-title-icon" />
          Interactive Report Builder
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Modify the records on the fly and watch the printable view update immediately.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-none" id="editor-tabs-bar">
        {[
          { id: "candidate", label: "Candidate Info", icon: User },
          { id: "examination", label: "Physical", icon: HeartPulse },
          { id: "laboratory", label: "Laboratory", icon: Activity },
          { id: "outcome", label: "Decision", icon: CheckSquare },
          { id: "stamps", label: "Signatures & Brand", icon: UserCheck },
          { id: "brand", label: "Hospital Contact", icon: Building2 }
        ].map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              id={`tab-btn-${tab.id}`}
              className={`flex items-center gap-1.5 px-4 py-3 border-b-2 font-medium text-xs whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600 bg-slate-50/20"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/40"
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Accordion Panels Container */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[640px]" id="editor-active-panel">
        
        {/* TAB 1: BRAND HOSPITAL CONFIGURATION */}
        {activeTab === "brand" && (
          <div className="space-y-4 animate-fade-in" id="panel-brand">
            <h4 className="text-xs font-bold text-slate-700 tracking-wider uppercase mb-1">Center Brand Settings</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Center Title English</label>
                <input
                  type="text"
                  value={report.config.centerNameEn}
                  onChange={(e) => updateReportField(["config", "centerNameEn"], e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded bg-slate-50/50 text-xs focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Center Title Bengali</label>
                <input
                  type="text"
                  value={report.config.centerNameBn}
                  onChange={(e) => updateReportField(["config", "centerNameBn"], e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded bg-slate-50/50 text-xs focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Address Details</label>
              <textarea
                rows={2}
                value={report.config.addressEn}
                onChange={(e) => updateReportField(["config", "addressEn"], e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded bg-slate-50/50 text-xs focus:ring-1 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Official Hotlines</label>
                <input
                  type="text"
                  value={report.config.phone}
                  onChange={(e) => updateReportField(["config", "phone"], e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded bg-slate-50/50 text-xs focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Official Email Desk</label>
                <input
                  type="text"
                  value={report.config.email}
                  onChange={(e) => updateReportField(["config", "email"], e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded bg-slate-50/50 text-xs focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CANDIDATE BIOGRAPHY */}
        {activeTab === "candidate" && (
          <div className="space-y-4 animate-fade-in" id="panel-candidate">
            <h4 className="text-xs font-bold text-slate-700 tracking-wider uppercase mb-1">Candidate Profile Sheet</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Candidate Name</label>
                <input
                  type="text"
                  placeholder="e.g. VHABESH SARKER"
                  value={report.personal.fullName}
                  onChange={(e) => updateReportField(["personal", "fullName"], e.target.value.toUpperCase())}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded bg-slate-50/50 text-xs focus:ring-1 focus:ring-indigo-500 focus:bg-white font-medium"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Reg Number</label>
                  <input
                    type="text"
                    value={report.personal.regNo}
                    onChange={(e) => updateReportField(["personal", "regNo"], e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded bg-slate-50/50 text-xs focus:ring-1 focus:ring-indigo-500 focus:bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Date of Exam</label>
                  <input
                    type="text"
                    placeholder="DD.MM.YYYY"
                    value={report.personal.dateOfExam}
                    onChange={(e) => updateReportField(["personal", "dateOfExam"], e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded bg-slate-50/50 text-xs focus:ring-1 focus:ring-indigo-500 focus:bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Passport Number</label>
                <input
                  type="text"
                  value={report.personal.passportNo}
                  onChange={(e) => updateReportField(["personal", "passportNo"], e.target.value.toUpperCase())}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded bg-slate-50/50 text-xs focus:ring-1 focus:ring-indigo-500 focus:bg-white font-semibold font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Date of Birth</label>
                <input
                  type="text"
                  placeholder="DD.MM.YYYY"
                  value={report.personal.dob}
                  onChange={(e) => updateReportField(["personal", "dob"], e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded bg-slate-50/50 text-xs focus:ring-1 focus:ring-indigo-500 focus:bg-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Sex</label>
                <select
                  value={report.personal.sex}
                  onChange={(e) => updateReportField(["personal", "sex"], e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded bg-slate-50/50 text-xs focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                >
                  {defaultPresets.sexes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Father's Full Name</label>
                <input
                  type="text"
                  value={report.personal.fatherName}
                  onChange={(e) => updateReportField(["personal", "fatherName"], e.target.value.toUpperCase())}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded bg-slate-50/50 text-xs focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Mother's Full Name</label>
                <input
                  type="text"
                  value={report.personal.motherName}
                  onChange={(e) => updateReportField(["personal", "motherName"], e.target.value.toUpperCase())}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded bg-slate-50/50 text-xs focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Agency Agent Code</label>
                <input
                  type="text"
                  placeholder="e.g. SHAN/AF-1"
                  value={report.personal.agency}
                  onChange={(e) => updateReportField(["personal", "agency"], e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded bg-slate-50/50 text-xs focus:ring-1 focus:ring-indigo-500 focus:bg-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Destination Country</label>
                <input
                  type="text"
                  placeholder="e.g. QATAR"
                  value={report.config.destinationCountry}
                  onChange={(e) => updateReportField(["config", "destinationCountry"], e.target.value.toUpperCase())}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded bg-slate-50/50 text-xs focus:ring-1 focus:ring-indigo-500 focus:bg-white uppercase font-bold"
                />
              </div>
            </div>

            {/* CANDIDATE PHOTO MANAGEMENT */}
            <div className="border border-slate-150 rounded-lg p-3 bg-slate-50/30">
              <span className="block text-xs font-semibold text-slate-700 mb-2">Candidate Photo Selection</span>
              
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Drag-n-drop file selector */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex-1 w-full border-2 border-dashed rounded-lg p-4 transition-all text-center cursor-pointer ${
                    dragging
                      ? "border-indigo-500 bg-indigo-50/50 text-indigo-700"
                      : "border-slate-300 hover:border-slate-400 text-slate-500"
                  }`}
                  onClick={() => document.getElementById("candidate-photo-file-picker")?.click()}
                  id="candidate-photo-dropzone"
                >
                  <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1.5" />
                  <span className="block text-xs font-medium text-slate-700">Drag & Drop Image</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">Or click to select a file from your device</span>
                  <input
                    type="file"
                    id="candidate-photo-file-picker"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Vertical Divider */}
                <span className="text-[10px] uppercase font-bold text-slate-400">or use presets</span>

                {/* Prebuilt Avatars selection */}
                <div className="flex gap-2 bg-white p-2 rounded border border-slate-100 shadow-inner">
                  {PREBUILT_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectPrebuiltAvatar(av.data)}
                      title={`Select ${av.name}`}
                      className="p-1 hover:bg-slate-100 rounded border border-transparent hover:border-slate-200 transition active:scale-95 cursor-pointer"
                    >
                      <img src={av.data} alt={av.name} className="w-9 h-9 object-contain rounded" />
                    </button>
                  ))}
                  <button
                    onClick={() => updateReportField(["personal", "candidatePhoto"], "")}
                    title="Remove Photo"
                    className="p-2 hover:bg-rose-50 text-rose-500 rounded border border-transparent hover:border-rose-200 transition text-[10px] font-bold cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: PHYSICAL EXAMINATION */}
        {activeTab === "examination" && (
          <div className="space-y-4 animate-fade-in" id="panel-examination">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h4 className="text-xs font-bold text-slate-700 tracking-wider uppercase">Physical Findings</h4>
              <button
                type="button"
                onClick={handleSetPhysicalNormal}
                id="btn-set-physical-normal"
                className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Initialize Normal Values
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Height (e.g. 165 cm)</label>
                <input
                  type="text"
                  value={report.physical.height}
                  onChange={(e) => updateReportField(["physical", "height"], e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Weight (e.g. 57 kg)</label>
                <input
                  type="text"
                  value={report.physical.weight}
                  onChange={(e) => updateReportField(["physical", "weight"], e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Pulse (e.g. 87 bpm)</label>
                <input
                  type="text"
                  value={report.physical.pulse}
                  onChange={(e) => updateReportField(["physical", "pulse"], e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Blood Pressure (BP)</label>
                <input
                  type="text"
                  value={report.physical.bloodPressure}
                  onChange={(e) => updateReportField(["physical", "bloodPressure"], e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Heart Rhythm</label>
                <input
                  type="text"
                  value={report.physical.heart}
                  onChange={(e) => updateReportField(["physical", "heart"], e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Liver Condition</label>
                <input
                  type="text"
                  value={report.physical.liver}
                  onChange={(e) => updateReportField(["physical", "liver"], e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Spleen</label>
                <input
                  type="text"
                  value={report.physical.spleen}
                  onChange={(e) => updateReportField(["physical", "spleen"], e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Eye (LT) Vision</label>
                <input
                  type="text"
                  value={report.physical.eyeLt}
                  onChange={(e) => updateReportField(["physical", "eyeLt"], e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Eye (RT) Vision</label>
                <input
                  type="text"
                  value={report.physical.eyeRt}
                  onChange={(e) => updateReportField(["physical", "eyeRt"], e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">ENT Status</label>
                <input
                  type="text"
                  value={report.physical.ent}
                  onChange={(e) => updateReportField(["physical", "ent"], e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Skin Condition</label>
                <input
                  type="text"
                  value={report.physical.skin}
                  onChange={(e) => updateReportField(["physical", "skin"], e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Overall Condition</label>
                <input
                  type="text"
                  value={report.physical.physicalCondition}
                  onChange={(e) => updateReportField(["physical", "physicalCondition"], e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">ECG Verdict</label>
                <input
                  type="text"
                  value={report.physical.ecg}
                  onChange={(e) => updateReportField(["physical", "ecg"], e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Chest P/A View Findings</label>
              <textarea
                rows={2}
                value={report.physical.chestView}
                onChange={(e) => updateReportField(["physical", "chestView"], e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>
        )}

        {/* TAB 4: LABORATORY INVESTIGATIONS */}
        {activeTab === "laboratory" && (
          <div className="space-y-4 animate-fade-in" id="panel-laboratory">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h4 className="text-xs font-bold text-slate-700 tracking-wider uppercase">Laboratory Screen</h4>
              <button
                type="button"
                onClick={handleSetLabsNormal}
                id="btn-set-labs-normal"
                className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Initialize Normal Values
              </button>
            </div>

            {/* SECTIONS */}
            <div className="border border-slate-100 rounded-lg p-3 space-y-3 bg-slate-50/20">
              <span className="block text-xs font-bold text-indigo-700 uppercase tracking-widest text-[10px]">Serology Screen</span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 mb-1">HBsAg</label>
                  <input
                    type="text"
                    value={report.laboratory.serology.hbsag}
                    onChange={(e) => updateReportField(["laboratory", "serology", "hbsag"], e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 mb-1">VDRL</label>
                  <input
                    type="text"
                    value={report.laboratory.serology.vdrl}
                    onChange={(e) => updateReportField(["laboratory", "serology", "vdrl"], e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 mb-1">TPHA</label>
                  <input
                    type="text"
                    value={report.laboratory.serology.tpha}
                    onChange={(e) => updateReportField(["laboratory", "serology", "tpha"], e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 mb-1">Blood Group</label>
                  <input
                    type="text"
                    list="blood-group-presets"
                    value={report.laboratory.serology.bloodGroup}
                    onChange={(e) => updateReportField(["laboratory", "serology", "bloodGroup"], e.target.value.toUpperCase())}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs text-slate-700 uppercase font-bold"
                  />
                  <datalist id="blood-group-presets">
                    {defaultPresets.bloodGroups.map((g) => (
                      <option key={g} value={g} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-100 rounded-lg p-3 space-y-3 bg-slate-50/20">
                <span className="block text-xs font-bold text-indigo-700 uppercase tracking-widest text-[10px]">Biochemical Screen</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-medium text-slate-500 mb-1">S. Bilirubin (mg/dl)</label>
                    <input
                      type="text"
                      value={report.laboratory.biochemical.sBilirubin}
                      onChange={(e) => updateReportField(["laboratory", "biochemical", "sBilirubin"], e.target.value)}
                      className="w-full px-2.5 py-1 hover:border-slate-300 border border-slate-200 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-500 mb-1">Sugar Random (mmol/L)</label>
                    <input
                      type="text"
                      value={report.laboratory.biochemical.sugarRandom}
                      onChange={(e) => updateReportField(["laboratory", "biochemical", "sugarRandom"], e.target.value)}
                      className="w-full px-2.5 py-1 hover:border-slate-300 border border-slate-200 rounded text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-slate-100 rounded-lg p-3 space-y-3 bg-slate-50/20">
                <span className="block text-xs font-bold text-indigo-700 uppercase tracking-widest text-[10px]">Hematology & Urine</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-medium text-slate-500 mb-1">Hemoglobin (mg/dl)</label>
                    <input
                      type="text"
                      value={report.laboratory.hematology.hemoglobin}
                      onChange={(e) => updateReportField(["laboratory", "hematology", "hemoglobin"], e.target.value)}
                      className="w-full px-2.5 py-1 hover:border-slate-300 border border-slate-200 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-500 mb-1">Pregnancy Test</label>
                    <input
                      type="text"
                      value={report.laboratory.urine.pregnancyTest}
                      onChange={(e) => updateReportField(["laboratory", "urine", "pregnancyTest"], e.target.value)}
                      className="w-full px-2.5 py-1 hover:border-slate-300 border border-slate-200 rounded text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MEDICAL DECISION OUTCOME */}
        {activeTab === "outcome" && (
          <div className="space-y-4 animate-fade-in" id="panel-outcome">
            <h4 className="text-xs font-bold text-slate-700 tracking-wider uppercase mb-1">Medical Assessment Result</h4>
            
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Decision Stamp Code</label>
                <div className="flex gap-2">
                  {[
                    { key: "FIT", label: "FIT (Medically Normal)", bg: "hover:bg-emerald-50 text-emerald-800 border-emerald-200 bg-emerald-50/30", activeBg: "bg-emerald-600 text-white border-emerald-600" },
                    { key: "UNFIT", label: "UNFIT (Requires Treatment)", bg: "hover:bg-rose-50 text-rose-800 border-rose-200 bg-rose-50/30", activeBg: "bg-rose-600 text-white border-rose-600" },
                    { key: "HELD UP", label: "HELD UP (Incomplete Check)", bg: "hover:bg-amber-50 text-amber-800 border-amber-200 bg-amber-50/30", activeBg: "bg-amber-500 text-white border-amber-500" }
                  ].map((btn) => {
                    const isSelected = report.config.medicalStatus === btn.key;
                    return (
                      <button
                        key={btn.key}
                        onClick={() => updateReportField(["config", "medicalStatus"], btn.key)}
                        id={`btn-status-select-${btn.key}`}
                        className={`flex-1 py-2 px-3 border text-xs font-bold rounded-lg cursor-pointer transition shadow-sm ${
                          isSelected ? btn.activeBg : btn.bg
                        }`}
                      >
                        {btn.key}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Remarks / Under-text Description</label>
                <input
                  type="text"
                  value={report.config.medicalStatusText}
                  placeholder="e.g. For the above mentioned tests"
                  onChange={(e) => updateReportField(["config", "medicalStatusText"], e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SIGNATURES & CUSTOM STAMPS */}
        {activeTab === "stamps" && (
          <div className="space-y-4 animate-fade-in" id="panel-stamps">
            <h4 className="text-xs font-bold text-slate-700 tracking-wider uppercase mb-1">Administrative Signatures</h4>

            {/* CHECKED BY BOX */}
            <div className="border border-slate-150 rounded-lg p-3 space-y-3 bg-slate-50/20">
              <div className="flex items-center justify-between">
                <span className="block text-xs font-bold text-slate-700">Checked By Officer</span>
                <button
                  onClick={() => setShowSignaturePad("checkedBy")}
                  id="btn-draw-checkedby"
                  className="flex items-center gap-1 text-[10px] text-indigo-600 hover:text-indigo-800 font-bold bg-white border border-slate-200 py-1 px-2.5 rounded hover:border-indigo-200 transition cursor-pointer"
                >
                  <Brush className="w-3 h-3" /> Draw Signature
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 mb-1">Officer Name</label>
                  <input
                    type="text"
                    value={report.footer.checkedBy.name}
                    onChange={(e) => updateReportField(["footer", "checkedBy", "name"], e.target.value)}
                    className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 mb-1">Designation & Med School Credentials</label>
                  <input
                    type="text"
                    value={report.footer.checkedBy.credentials}
                    onChange={(e) => updateReportField(["footer", "checkedBy", "credentials"], e.target.value)}
                    className="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* DOCTOR OFFICIAL BOX */}
            <div className="border border-slate-150 rounded-lg p-3 space-y-3 bg-slate-50/20">
              <div className="flex items-center justify-between">
                <span className="block text-xs font-bold text-slate-700">Medical Officer Details</span>
                <button
                  onClick={() => setShowSignaturePad("medicalOfficer")}
                  id="btn-draw-officer"
                  className="flex items-center gap-1 text-[10px] text-indigo-600 hover:text-indigo-800 font-bold bg-white border border-slate-200 py-1 px-2.5 rounded hover:border-indigo-200 transition cursor-pointer"
                >
                  <Brush className="w-3 h-3" /> Draw Signature
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 mb-1">Doctor Name</label>
                  <input
                    type="text"
                    value={report.footer.medicalOfficer.name}
                    onChange={(e) => updateReportField(["footer", "medicalOfficer", "name"], e.target.value)}
                    className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 mb-1">Credentials (supports line breaks with \n)</label>
                  <textarea
                    rows={1}
                    value={report.footer.medicalOfficer.credentials}
                    onChange={(e) => updateReportField(["footer", "medicalOfficer", "credentials"], e.target.value)}
                    className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                  />
                </div>
              </div>
            </div>

            {/* SEALS & SECURITY VISBILITIES */}
            <div className="border border-slate-150 rounded-lg p-3 space-y-3 bg-slate-50/20">
              <span className="block text-xs font-bold text-slate-700">Official Blue ink double-circle stamp Settings</span>
              
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={report.footer.showStamp}
                    onChange={(e) => updateReportField(["footer", "showStamp"], e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Display Center Seal
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={report.footer.showSignatures}
                    onChange={(e) => updateReportField(["footer", "showSignatures"], e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Display Signature Assets
                </label>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Reset signatures to crisp defaults</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      updateReportField(["footer", "checkedBy", "signature"], DEFAULT_CHECKED_SIGNATURE);
                      updateReportField(["footer", "medicalOfficer", "signature"], DEFAULT_DOCTOR_SIGNATURE);
                    }}
                    id="btn-reset-signatures"
                    className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[10.5px] font-semibold transition active:scale-95 cursor-pointer"
                  >
                    Reset Vector Scripts
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* DRAWING BOARD SIGNATURE POPUP MODAL */}
      {showSignaturePad && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="signature-modal">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden max-w-sm w-full">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h5 className="font-semibold text-slate-800 text-xs flex items-center gap-1">
                <Brush className="w-4 h-4 text-indigo-600" />
                Add Official Custom Signature
              </h5>
              <button
                type="button"
                onClick={() => setShowSignaturePad(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-[11px] text-slate-500">
                Draw inside the canvas below with your mouse pointer or finger on touch screens.
              </p>

              {/* Draw Box Frame */}
              <div className="border border-slate-300 bg-slate-100 rounded-lg overflow-hidden relative" style={{ height: "160px" }}>
                <canvas
                  id="drawing-pad-canvas"
                  ref={signatureCanvasRef}
                  width={350}
                  height={160}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-full cursor-crosshair touch-none"
                />
              </div>
            </div>

            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={clearSignaturePad}
                className="px-3 py-1.5 hover:bg-slate-200 text-slate-600 rounded text-xs font-medium cursor-pointer"
              >
                Clear Pad
              </button>
              <button
                type="button"
                onClick={saveSignaturePad}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium cursor-pointer"
              >
                Assign Signature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
