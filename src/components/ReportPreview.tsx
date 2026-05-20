import React from "react";
import { Circle, Printer, Download, Eye, FileSpreadsheet, Lock, HelpCircle } from "lucide-react";
import { MedicalReport } from "../types";

interface ReportPreviewProps {
  report: MedicalReport;
  onUpdateReport: (report: MedicalReport) => void;
  isExporting: boolean;
  onDownloadPdf: () => void;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({
  report,
  onUpdateReport,
  isExporting,
  onDownloadPdf
}) => {
  const [stampRotation, setStampRotation] = React.useState<number>(-12); // Real-life stamp tilt

  const updateDirectField = (path: string[], value: string) => {
    const updated = JSON.parse(JSON.stringify(report)) as any;
    let current = updated;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    onUpdateReport(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  // Inline inputs helper styling to make them merge flawlessly with printed output
  const inlineInputStyle = "bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all px-1 py-0.5 rounded-sm font-mono text-slate-800 w-full";

  return (
    <div className="flex flex-col h-full" id="report-preview-controller">
      
      {/* Action Header bar above paper */}
      <div className="bg-slate-800 text-slate-100 rounded-t-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-md border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">Official Document Preview</span>
        </div>
        
        {/* Actions Row */}
        <div className="flex items-center gap-2">
          {/* Rotational Stamp Tilt Slider */}
          {report.footer.showStamp && (
            <div className="hidden lg:flex items-center gap-1.5 mr-3 px-2 py-1 bg-slate-700/50 rounded-lg text-slate-300">
              <span className="text-[10px] font-bold uppercase">Stamp Tilt</span>
              <input
                type="range"
                min="-45"
                max="45"
                value={stampRotation}
                onChange={(e) => setStampRotation(Number(e.target.value))}
                className="w-16 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-400 focus:outline-none"
                title="Slightly rotate the blue ink stamp"
              />
              <span className="text-[10px] font-mono min-w-[20px]">{stampRotation}°</span>
            </div>
          )}

          {/* Download button */}
          <button
            onClick={onDownloadPdf}
            disabled={isExporting}
            id="print-action-download-pdf"
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded transition shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {isExporting ? "Rendering..." : "Download PDF"}
          </button>

          {/* System Print button */}
          <button
            onClick={handlePrint}
            id="print-action-system-print"
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded transition shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
        </div>
      </div>

      {/* Outer wrapper to handle scrolling on small monitors while matching A4 layout */}
      <div className="flex-1 bg-slate-100 p-4 overflow-auto flex justify-center scrollbar-thin" id="report-preview-scroll-wrapper">
        <div className="shadow-2xl bg-white border border-slate-300 relative select-text" id="medical-report-a4-paper" style={{ width: "794px", minWidth: "794px", height: "1123px", minHeight: "1123px", padding: "40px" }}>
          
          {/* MEDICAL LOGO & BRAND HEADER */}
          <div className="flex items-start justify-between">
            {/* Logo vector AMC style */}
            <div className="flex items-center gap-3" id="logo-block">
              <div className="relative w-16 h-16 flex items-center justify-center">
                {/* AMC Stethoscope SVG */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#1d4ed8" strokeWidth="6" />
                  <circle cx="50" cy="50" r="37" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,2" />
                  {/* Outer wings */}
                  <path d="M 22 50 C 22 25, 78 25, 78 50" fill="none" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
                  {/* Caduceus element */}
                  <g transform="translate(50, 48) scale(0.65)">
                    {/* Wings */}
                    <path d="M-30,-20 C-10,-40 0,-15 0,0 C0,-15 10,-40 30,-20" fill="none" stroke="#1d4ed8" strokeWidth="4" />
                    {/* Snake */}
                    <path d="M-10,12 Q0,25 10,12 T-10,-12 Q0,-25 10,-12" fill="none" stroke="#22c55e" strokeWidth="3" />
                    {/* Rod */}
                    <line x1="0" y1="-35" x2="0" y2="35" stroke="#1c1917" strokeWidth="6" strokeLinecap="round" />
                    <circle cx="0" cy="-38" r="7" fill="#dc2626" />
                  </g>
                </svg>
                {/* Initials badge overlay */}
                <span className="absolute bottom-0 right-0 bg-[#dc2626] text-white font-bold text-[9px] px-1 rounded border border-white">AMC</span>
              </div>
            </div>

            {/* Middle Title Details block */}
            <div className="flex-1 text-center px-4">
              <h1 className="text-[#1d4ed8] font-bold text-[28px] tracking-wide leading-tight uppercase font-sans">
                {report.config.centerNameEn}
              </h1>
              
              <h2 className="text-[#dc2626] text-[24px] font-bold mt-1 font-sans">
                {report.config.centerNameBn}
              </h2>
              
              <p className="text-[#15803d] text-[11px] font-medium leading-relaxed mt-1">
                {report.config.addressEn}
              </p>
              
              <p className="text-slate-600 text-[11px] font-semibold mt-0.5">
                Phone : {report.config.phone} , E-mail : {report.config.email}
              </p>
            </div>
            
            {/* Dummy right spacer to balance logo */}
            <div className="w-16 h-16"></div>
          </div>

          {/* DECORATIVE LINE */}
          <div className="mt-3 flex items-center justify-between gap-1 w-full" id="brand-rhythm-line">
            <span className="h-0.5 bg-[#1d4ed8] flex-1"></span>
            <span className="w-3 h-1.5 bg-[#dc2626] rounded-xs"></span>
            <span className="w-10 h-0.5 bg-[#22c55e]"></span>
            <span className="w-3 h-1.5 bg-[#dc2626] rounded-xs"></span>
            <span className="h-0.5 bg-[#1d4ed8] flex-1"></span>
          </div>

          {/* REPORT TITLE HEADLINE */}
          <div className="mt-4 text-center">
            <h3 className="text-black font-extrabold text-[15px] tracking-wider uppercase border-b border-black pb-1 inline-block">
              MEDICAL EXAMINATION REPORT
            </h3>
          </div>

          {/* DESTINATION COUNTRY STAMP BOX (QATAR, ETC) */}
          <div className="mt-3 flex justify-center">
            <div className="border border-black px-12 py-1 font-bold text-[15px] text-center uppercase tracking-widest bg-slate-50 min-w-[200px]" style={{ borderWidth: "1.5px" }}>
              <input
                type="text"
                value={report.config.destinationCountry}
                onChange={(e) => updateDirectField(["config", "destinationCountry"], e.target.value.toUpperCase())}
                className="bg-transparent border-none text-center font-bold tracking-widest focus:outline-none w-full"
                title="Double click to edit destination country"
              />
            </div>
          </div>

          {/* CANDIDATE PHOTO & DETAILS SECTION */}
          <div className="mt-4 flex gap-6 items-start">
            
            {/* PHOTO Frame (Left side) */}
            <div className="border border-black bg-[#fafafa] flex flex-col justify-between overflow-hidden relative group" style={{ width: "115px", height: "135px", borderWidth: "1px" }}>
              {report.personal.candidatePhoto ? (
                <img
                  src={report.personal.candidatePhoto}
                  alt="Candidate Passport"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-2 text-center select-none">
                  <svg className="w-8 h-8 opacity-60 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <span className="text-[9px] font-bold uppercase leading-tight">No Candidate Photo</span>
                </div>
              )}
              {/* Overlay edit tip */}
              <div className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-150 text-[10px] select-none text-center p-1">
                Use Avatar Editor on the Left to Change Photo
              </div>
            </div>

            {/* DETAILS (Right side) */}
            <div className="flex-1 text-[11.5px]" id="candidate-details-grid">
              {/* Row 1 in its own header row to match perfect screenshot format */}
              <div className="flex items-center justify-between w-full mb-1">
                <div className="flex items-center gap-1 w-[200px]">
                  <span className="font-sans font-semibold text-slate-800 shrink-0 select-none">Reg No. :</span>
                  <input
                    type="text"
                    value={report.personal.regNo}
                    onChange={(e) => updateDirectField(["personal", "regNo"], e.target.value)}
                    className="bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all px-1 py-0.5 rounded-sm font-semibold text-slate-900 w-full"
                  />
                </div>
                <div className="flex items-center gap-1 w-[220px] justify-end">
                  <span className="font-sans font-semibold text-slate-800 shrink-0 select-none">Date of Exam :</span>
                  <input
                    type="text"
                    value={report.personal.dateOfExam}
                    onChange={(e) => updateDirectField(["personal", "dateOfExam"], e.target.value)}
                    className="bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all px-1 py-0.5 rounded-sm font-semibold text-slate-900 w-[90px] text-right"
                  />
                </div>
              </div>

              {/* Perfectly Aligned Main Details Table */}
              <table className="w-full border-collapse">
                <tbody>
                  {/* Row 2: Full Name */}
                  <tr>
                    <td className="py-1 font-sans font-semibold text-slate-800 w-[116px] select-none text-left">Full Name</td>
                    <td className="py-1 text-center font-bold text-slate-800 w-[20px] select-none">:</td>
                    <td className="py-1 font-bold text-slate-950">
                      <input
                        type="text"
                        value={report.personal.fullName}
                        onChange={(e) => updateDirectField(["personal", "fullName"], e.target.value.toUpperCase())}
                        className={`${inlineInputStyle} font-bold text-slate-950`}
                      />
                    </td>
                  </tr>

                  {/* Row 3: Father's Name */}
                  <tr>
                    <td className="py-1 font-sans font-semibold text-slate-800 select-none text-left">Father's Name</td>
                    <td className="py-1 text-center font-bold text-slate-800 select-none">:</td>
                    <td className="py-1 text-slate-900">
                      <input
                        type="text"
                        value={report.personal.fatherName}
                        onChange={(e) => updateDirectField(["personal", "fatherName"], e.target.value.toUpperCase())}
                        className={inlineInputStyle}
                      />
                    </td>
                  </tr>

                  {/* Row 4: Mother's Name */}
                  <tr>
                    <td className="py-1 font-sans font-semibold text-slate-800 select-none text-left">Mother's Name</td>
                    <td className="py-1 text-center font-bold text-slate-800 select-none">:</td>
                    <td className="py-1 text-slate-900">
                      <input
                        type="text"
                        value={report.personal.motherName}
                        onChange={(e) => updateDirectField(["personal", "motherName"], e.target.value.toUpperCase())}
                        className={inlineInputStyle}
                      />
                    </td>
                  </tr>

                  {/* Row 5: Passport No */}
                  <tr>
                    <td className="py-1 font-sans font-semibold text-slate-800 select-none text-left">Passport No</td>
                    <td className="py-1 text-center font-bold text-slate-800 select-none">:</td>
                    <td className="py-1 font-bold text-slate-950">
                      <input
                        type="text"
                        value={report.personal.passportNo}
                        onChange={(e) => updateDirectField(["personal", "passportNo"], e.target.value.toUpperCase())}
                        className={`${inlineInputStyle} font-bold`}
                      />
                    </td>
                  </tr>

                  {/* Row 6: DOB and Sex */}
                  <tr>
                    <td className="py-1 font-sans font-semibold text-slate-800 select-none text-left">Date of Birth</td>
                    <td className="py-1 text-center font-bold text-slate-800 select-none">:</td>
                    <td className="py-1">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={report.personal.dob}
                            onChange={(e) => updateDirectField(["personal", "dob"], e.target.value)}
                            className={inlineInputStyle}
                          />
                        </div>
                        <div className="flex items-center gap-1 w-[120px] justify-end shrink-0 pl-2">
                          <span className="font-sans font-semibold text-slate-800 select-none">Sex :</span>
                          <input
                            type="text"
                            value={report.personal.sex}
                            onChange={(e) => updateDirectField(["personal", "sex"], e.target.value.toUpperCase())}
                            className="bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all px-1 py-0.5 rounded-sm font-semibold text-slate-900 w-[55px] text-right"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Row 7: Agency */}
                  <tr>
                    <td className="py-1 font-sans font-semibold text-slate-800 select-none text-left">Agency</td>
                    <td className="py-1 text-center font-bold text-slate-800 select-none">:</td>
                    <td className="py-1">
                      <input
                        type="text"
                        value={report.personal.agency}
                        onChange={(e) => updateDirectField(["personal", "agency"], e.target.value)}
                        className={inlineInputStyle}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* DUAL TABLES CONTAINER */}
          <div className="mt-5 flex gap-4 items-start" id="report-grids-container">
            
            {/* LEFT TABLE: PHYSICAL EXAMINATION */}
            <div className="w-[53%] border border-black overflow-hidden" id="grid-physical">
              <table className="w-full text-[10px] border-collapse">
                <thead>
                  <tr className="bg-[#f0f4f8] text-black">
                    <th colSpan={2} className="py-1.5 px-2 border-b border-black font-extrabold uppercase tracking-wide text-center">
                      PHYSICAL EXAMINATION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Height", path: ["physical", "height"] },
                    { label: "Weight", path: ["physical", "weight"] },
                    { label: "Pulse", path: ["physical", "pulse"] },
                    { label: "Blood Pressure (BP)", path: ["physical", "bloodPressure"] },
                    { label: "Heart", path: ["physical", "heart"] },
                    { label: "Liver", path: ["physical", "liver"] },
                    { label: "Spleen", path: ["physical", "spleen"] },
                    { label: "Eye (LT)", path: ["physical", "eyeLt"] },
                    { label: "Eye (RT)", path: ["physical", "eyeRt"] },
                    { label: "ENT", path: ["physical", "ent"] },
                    { label: "Skin", path: ["physical", "skin"] },
                    { label: "Physical Condition", path: ["physical", "physicalCondition"] },
                    { label: "ECG", path: ["physical", "ecg"] },
                    { label: "Chest P/A View", path: ["physical", "chestView"], isLarge: true }
                  ].map((field, idx) => {
                    const rowValue = field.path.reduce((acc, part) => acc?.[part], report as any);
                    return (
                      <tr key={idx} className="border-b border-slate-300 last:border-b-0">
                        <td className="py-1.5 px-2 border-r border-slate-300 font-bold text-slate-700 w-[140px] select-none uppercase">
                          {field.label}
                        </td>
                        <td className="py-1 px-2 text-slate-800">
                          {field.isLarge ? (
                            <textarea
                              rows={2}
                              value={rowValue}
                              onChange={(e) => updateDirectField(field.path, e.target.value)}
                              className="bg-transparent border-none focus:outline-none focus:bg-white w-full text-[10px]"
                            />
                          ) : (
                            <input
                              type="text"
                              value={rowValue}
                              onChange={(e) => updateDirectField(field.path, e.target.value)}
                              className="bg-transparent border-none focus:outline-none focus:bg-white w-full text-[10px] font-medium"
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* RIGHT TABLE: LABORATORY INVESTIGATIONS */}
            <div className="w-[45%] border border-black overflow-hidden" id="grid-laboratory">
              <table className="w-full text-[10px] border-collapse">
                <thead>
                  <tr className="bg-[#f0f4f8] text-black">
                    <th colSpan={3} className="py-1.5 px-2 border-b border-black font-extrabold uppercase tracking-wide text-center">
                      LABORATORY INVESTIGATIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  
                  {/* GROUP 1: SEROLOGY */}
                  <tr className="border-b border-black">
                    {/* Vertical Side Category cell */}
                    <td rowSpan={4} className="border-r border-black font-extrabold text-black text-center w-[100px] select-none bg-slate-50 uppercase tracking-widest leading-loose">
                      <div className="rotate-270 whitespace-nowrap py-4">SEROLOGY</div>
                    </td>
                    <td className="py-1.5 px-2 border-r border-slate-300 font-bold text-slate-700 w-[110px] select-none">HBsAg</td>
                    <td className="py-1 px-2">
                      <input
                        type="text"
                        value={report.laboratory.serology.hbsag}
                        onChange={(e) => updateDirectField(["laboratory", "serology", "hbsag"], e.target.value)}
                        className="bg-transparent border-none focus:outline-none focus:bg-white w-full font-semibold"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-[#cbd5e1]">
                    <td className="py-1.5 px-2 border-r border-slate-300 font-bold text-slate-700 select-none">VDRL</td>
                    <td className="py-1 px-2">
                      <input
                        type="text"
                        value={report.laboratory.serology.vdrl}
                        onChange={(e) => updateDirectField(["laboratory", "serology", "vdrl"], e.target.value)}
                        className="bg-transparent border-none focus:outline-none focus:bg-white w-full font-semibold"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-[#cbd5e1]">
                    <td className="py-1.5 px-2 border-r border-slate-300 font-bold text-slate-700 select-none">TPHA</td>
                    <td className="py-1 px-2">
                      <input
                        type="text"
                        value={report.laboratory.serology.tpha}
                        onChange={(e) => updateDirectField(["laboratory", "serology", "tpha"], e.target.value)}
                        className="bg-transparent border-none focus:outline-none focus:bg-white w-full font-semibold"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="py-1.5 px-2 border-r border-slate-[#cbd5e1] font-bold text-slate-700 select-none">Blood Group</td>
                    <td className="py-1 px-2">
                      <input
                        type="text"
                        value={report.laboratory.serology.bloodGroup}
                        onChange={(e) => updateDirectField(["laboratory", "serology", "bloodGroup"], e.target.value.toUpperCase())}
                        className="bg-transparent border-none focus:outline-none focus:bg-white w-full font-bold text-slate-800 uppercase"
                      />
                    </td>
                  </tr>

                  {/* GROUP 2: BIOCHEMICAL */}
                  <tr className="border-b border-black">
                    {/* Vertical Side Category cell */}
                    <td rowSpan={2} className="border-r border-black font-extrabold text-black text-center select-none bg-slate-50 uppercase tracking-widest leading-loose">
                      <div className="rotate-270 py-2">BIOCHEMICAL</div>
                    </td>
                    <td className="py-1.5 px-2 border-r border-slate-300 font-bold text-slate-700 select-none">S. Billirubin</td>
                    <td className="py-1 px-2">
                      <input
                        type="text"
                        value={report.laboratory.biochemical.sBilirubin}
                        onChange={(e) => updateDirectField(["laboratory", "biochemical", "sBilirubin"], e.target.value)}
                        className="bg-transparent border-none focus:outline-none focus:bg-white w-full"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="py-1.5 px-2 border-r border-slate-[#cbd5e1] font-bold text-slate-700 select-none">Sugar Random</td>
                    <td className="py-1 px-2">
                      <input
                        type="text"
                        value={report.laboratory.biochemical.sugarRandom}
                        onChange={(e) => updateDirectField(["laboratory", "biochemical", "sugarRandom"], e.target.value)}
                        className="bg-transparent border-none focus:outline-none focus:bg-white w-full"
                      />
                    </td>
                  </tr>

                  {/* GROUP 3: HEMATOLOGY */}
                  <tr className="border-b border-black">
                    {/* Vertical Side Category cell */}
                    <td className="border-r border-black font-extrabold text-black text-center py-2 select-none bg-slate-50 uppercase tracking-widest leading-loose text-[9px]">
                      HEMATOLOGY
                    </td>
                    <td className="py-1.5 px-2 border-r border-slate-300 font-bold text-slate-700 select-none">Hemoglobin</td>
                    <td className="py-1 px-2">
                      <input
                        type="text"
                        value={report.laboratory.hematology.hemoglobin}
                        onChange={(e) => updateDirectField(["laboratory", "hematology", "hemoglobin"], e.target.value)}
                        className="bg-transparent border-none focus:outline-none focus:bg-white w-full font-semibold"
                      />
                    </td>
                  </tr>

                  {/* GROUP 4: URINE */}
                  <tr>
                    {/* Vertical Side Category cell */}
                    <td className="border-r border-black font-extrabold text-black text-center py-2 select-none bg-slate-50 uppercase tracking-widest leading-loose">
                      URINE
                    </td>
                    <td className="py-1.5 px-2 border-r border-slate-300 font-bold text-slate-700 select-none font-sans">Pregnancy Test</td>
                    <td className="py-1 px-2">
                      <input
                        type="text"
                        value={report.laboratory.urine.pregnancyTest}
                        onChange={(e) => updateDirectField(["laboratory", "urine", "pregnancyTest"], e.target.value)}
                        className="bg-transparent border-none focus:outline-none focus:bg-white w-full"
                      />
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>

          </div>

          {/* MEDICAL OUTCOME DECISION BLOCK */}
          <div className="mt-8 flex flex-col items-center justify-center text-center">
            
            <p className="text-[12px] font-bold text-black tracking-normal select-none">
              This Person is Found Medically,
            </p>
            
            {/* Visual Double-Line Stamp look */}
            <div className={`mt-2.5 px-16 py-2 border-4 font-black text-xl tracking-widest rounded-lg flex items-center justify-center min-w-[240px] uppercase shadow-sm select-none ${
              report.config.medicalStatus === "FIT"
                ? "border-emerald-600 text-emerald-600 bg-emerald-50/20"
                : report.config.medicalStatus === "UNFIT"
                ? "border-rose-600 text-rose-600 bg-rose-50/20"
                : "border-amber-600 text-amber-600 bg-amber-50/20"
            }`} style={{ borderWidth: "3px" }}>
              {report.config.medicalStatus}
            </div>

            <div className="mt-2 text-slate-600 text-[11px] font-semibold w-full max-w-[350px]">
              <input
                type="text"
                value={report.config.medicalStatusText}
                onChange={(e) => updateDirectField(["config", "medicalStatusText"], e.target.value)}
                className="bg-transparent border-none text-center focus:outline-none w-full"
                title="Double click to edit status details"
              />
            </div>
          </div>

          {/* FOOTER SIGNATURES & DOUBLE-CIRCLE ROUND STAMP */}
          <div className="mt-14 relative flex items-end justify-between text-[11px]" id="printable-signs-row" style={{ minHeight: "100px" }}>
            
            {/* Round Ink Stamp (Absolute Floating layer) */}
            {report.footer.showStamp && (
              <div
                className="absolute left-[38%] bottom-1 pointer-events-auto transition cursor-grab active:cursor-grabbing hover:scale-105 z-10 select-none"
                style={{ transform: `rotate(${stampRotation}deg)` }}
                title="Slide 'Stamp Tilt' above to rotate this stamp!"
                id="floating-official-stamp"
              >
                {/* Authentic Double-Circle Ink Stamp SVG */}
                <svg width="105" height="105" viewBox="0 0 100 100" className="opacity-90 select-none">
                  {/* Outer circle */}
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="none" />
                  {/* Inner circle */}
                  <circle cx="50" cy="50" r="34" fill="none" stroke="#2563eb" strokeWidth="1.2" />
                  
                  {/* Curved Center Top Text */}
                  <path id="stamp-top-text-path" d="M 12 50 A 38 38 0 0 1 88 50" fill="none" stroke="none" />
                  <text className="font-bold text-[8.2px] fill-[#2563eb] tracking-wide" style={{ letterSpacing: "0.2px" }}>
                    <textPath href="#stamp-top-text-path" startOffset="50%" textAnchor="middle">
                      {report.config.centerNameEn}
                    </textPath>
                  </text>

                  {/* Curved Center Bottom Text */}
                  <path id="stamp-bottom-text-path" d="M 86 50 A 36 36 0 0 1 14 50" fill="none" stroke="none" />
                  <text className="font-bold text-[8.5px] fill-[#2563eb] tracking-wide" style={{ letterSpacing: "0.5px" }}>
                    <textPath href="#stamp-bottom-text-path" startOffset="50%" textAnchor="middle">
                      * DHAKA *
                    </textPath>
                  </text>

                  {/* Center Star & Inner Emblem details */}
                  <circle cx="50" cy="50" r="23" fill="none" stroke="#2563eb" strokeWidth="0.8" strokeDasharray="3,2" />
                  <g transform="translate(50, 50)">
                    {/* Five pointed star */}
                    <path d="M 0,-15 L 4,-4 L 15,-4 L 7,3 L 10,13 L 0,7 L -10,13 L -7,3 L -15,-4 L -4,-4 Z" fill="none" stroke="#2563eb" strokeWidth="1.2" />
                    <circle cx="0" cy="0" r="2" fill="#2563eb" />
                  </g>
                </svg>
              </div>
            )}

            {/* CHECKED BY info on left */}
            <div className="w-[200px] text-center" id="footer-checked-by-block">
              {report.footer.showSignatures && report.footer.checkedBy.signature && (
                <div className="h-11 flex items-center justify-center mb-1 overflow-hidden" id="prev-checkedby-sig">
                  <img src={report.footer.checkedBy.signature} alt="Signature Checked By" className="max-h-full max-w-full object-contain" />
                </div>
              )}
              <div className="border-t border-slate-900 pt-1 font-bold text-slate-800 flex flex-col items-center">
                <span className="text-[11px] font-bold text-slate-700 leading-tight select-none">Checked By</span>
                <input
                  type="text"
                  value={report.footer.checkedBy.name}
                  onChange={(e) => updateDirectField(["footer", "checkedBy", "name"], e.target.value)}
                  className="bg-transparent border-none text-center font-bold focus:outline-none w-full text-[11.5px] mt-0.5"
                />
              </div>
              <div className="text-slate-500 text-[9.5px] whitespace-pre-wrap leading-tight font-sans mt-0.5">
                {report.footer.checkedBy.credentials}
              </div>
            </div>

            {/* DOCTOR OFFICIAL INFO on right */}
            <div className="w-[220px] text-center" id="footer-doctor-block">
              {report.footer.showSignatures && report.footer.medicalOfficer.signature && (
                <div className="h-11 flex items-center justify-center mb-1 overflow-hidden" id="prev-doctor-sig">
                  <img src={report.footer.medicalOfficer.signature} alt="Signature Doctor" className="max-h-full max-w-full object-contain" />
                </div>
              )}
              <div className="border-t border-slate-900 pt-1 font-bold text-slate-900 flex flex-col items-center">
                <input
                  type="text"
                  value={report.footer.medicalOfficer.name}
                  onChange={(e) => updateDirectField(["footer", "medicalOfficer", "name"], e.target.value)}
                  className="bg-transparent border-none text-center font-bold focus:outline-none w-full text-[11.5px]"
                />
              </div>
              <div className="text-slate-500 text-[9.5px] whitespace-pre-wrap leading-tight font-sans mt-0.5">
                {report.footer.medicalOfficer.credentials}
              </div>
            </div>

          </div>

          {/* BOTTOM BLUE ABSOLUTE BAR URL */}
          <div className="absolute bottom-0 left-0 right-0 h-9 bg-[#1d4ed8] flex items-center justify-center font-sans tracking-wide" id="printable-blue-footer">
            <span className="text-white text-xs font-bold leading-none select-none">
              www.aljabbarmedical.com
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
