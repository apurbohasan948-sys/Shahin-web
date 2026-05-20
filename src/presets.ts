import { MedicalReport } from "./types";

// Default placeholder candidate photo - custom crafted high-fidelity SVG illustration 
// representing the candidate with a beard and plaid/checked shirt from the screenshot
export const DEFAULT_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="115" height="135"><defs><pattern id="plaid" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="%23d27d2d" /><rect width="16" height="4" fill="%231e293b" opacity="0.75" /><rect width="4" height="16" fill="%231e293b" opacity="0.75" /><rect width="16" height="1" fill="%23ffffff" opacity="0.3" y="2" /><rect width="1" height="16" fill="%23ffffff" opacity="0.3" x="2" /></pattern></defs><rect width="100" height="120" fill="%23f1f5f9" /><circle cx="50" cy="50" r="45" fill="%23ffffff" opacity="0.15" /><path d="M 12 120 C 12 85, 25 72, 50 72 C 75 72, 88 85, 88 120 Z" fill="url(%23plaid)" /><path d="M 40 73 C 40 85, 60 85, 60 73 Z" fill="%23111827" /><path d="M 32 72 L 42 86 L 48 72 Z" fill="%231e293b" /><path d="M 68 72 L 58 86 L 52 72 Z" fill="%231e293b" /><rect x="42" y="58" width="16" height="18" fill="%23d19164" /><ellipse cx="50" cy="46" rx="19" ry="22" fill="%23d19164" /><path d="M 31 40 Q 30 22 50 21 Q 70 22 69 40 C 67 30, 33 30, 31 40" fill="%23111827" /><path d="M 31 40 C 29 40, 29 33, 32 30" fill="%23111827" /><path d="M 69 40 C 71 40, 71 33, 68 30" fill="%23111827" /><path d="M 31 44 C 31 63, 40 70, 50 70 C 60 70, 69 63, 69 44 C 69 51, 66 56, 59 56 C 54 56, 53 50, 50 50 C 47 50, 46 56, 41 56 C 34 56, 31 51, 31 44" fill="%23111827" /><path d="M 42 58 Q 50 58 58 58 Q 50 67 42 58 Z" fill="%23111827" /><path d="M 41 52 Q 50 49 59 52 Q 50 54 41 52 Z" fill="%23111827" /><ellipse cx="44" cy="41" rx="2.5" ry="1.5" fill="%23ffffff" /><circle cx="44" cy="41" r="1.2" fill="%231e293b" /><ellipse cx="56" cy="41" rx="2.5" ry="1.5" fill="%23ffffff" /><circle cx="56" cy="41" r="1.2" fill="%231e293b" /><path d="M 38 37 Q 44 35 48 38" fill="none" stroke="%23111827" stroke-width="1.8" stroke-linecap="round" /><path d="M 62 37 Q 56 35 52 38" fill="none" stroke="%23111827" stroke-width="1.8" stroke-linecap="round" /><path d="M 48 40 L 50 49 L 47 50" fill="none" stroke="%239c5935" stroke-width="1.5" stroke-linecap="round" /><circle cx="30" cy="46" r="3.5" fill="%23d19164" /><circle cx="70" cy="46" r="3.5" fill="%23d19164" /></svg>`;

// Programmatic Checked By signature SVG
export const DEFAULT_CHECKED_SIGNATURE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="50" viewBox="0 0 120 50"><path d="M 10 32 C 30 10, 40 45, 55 20 C 70 5, 80 42, 95 15 C 105 2, 110 30, 115 25" fill="none" stroke="%231e3a8a" stroke-width="2" stroke-linecap="round"/><path d="M 15 28 L 110 32" fill="none" stroke="%231e3a8a" stroke-width="1.5" stroke-linecap="round"/></svg>`;

// Programmatic Doctor signature SVG
export const DEFAULT_DOCTOR_SIGNATURE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="50" viewBox="0 0 120 50"><path d="M 15 15 C 20 5, 25 35, 30 20 C 42 5, 50 45, 60 15 C 75 -5, 85 45, 95 25 C 102 15, 105 5, 110 20" fill="none" stroke="%231e3a8a" stroke-width="2" stroke-linecap="round"/><path d="M 25 35 C 45 42, 85 40, 105 25" fill="none" stroke="%231e3a8a" stroke-width="1.5"/></svg>`;

export const initialReport: MedicalReport = {
  id: "AJ-26-3379",
  createdAt: "2026-05-07",
  personal: {
    regNo: "AJ-26-3379",
    dateOfExam: "07.05.2026",
    fullName: "OBYDULLAH HAQUE",
    fatherName: "AFJAL HOSAN",
    motherName: "MOMOTAJ MOHAL",
    passportNo: "A19154708",
    dob: "26.12.1981",
    sex: "MALE",
    agency: "JHRL/AF-1",
    candidatePhoto: DEFAULT_AVATAR
  },
  physical: {
    height: "166 cm",
    weight: "65 kg",
    pulse: "82 bpm",
    bloodPressure: "120/80 mm of Hg",
    heart: "NAD",
    liver: "NORMAL",
    spleen: "NORMAL",
    eyeLt: "6/6",
    eyeRt: "6/6",
    ent: "NAD",
    skin: "NORMAL",
    physicalCondition: "NORMAL",
    ecg: "Not Seen",
    chestView: "NORMAL"
  },
  laboratory: {
    serology: {
      hbsag: "NEGATIVE",
      vdrl: "NON-REACTIVE",
      tpha: "NEGATIVE",
      bloodGroup: '"O" (+ve)'
    },
    biochemical: {
      sBilirubin: "0.9 mg/dl",
      sugarRandom: "5.7 mmol/L"
    },
    hematology: {
      hemoglobin: "13.3 mg/dl"
    },
    urine: {
      pregnancyTest: "NOT APPLICABLE"
    }
  },
  config: {
    centerNameEn: "AL-JABBAR MEDICAL CENTER",
    centerNameBn: "আল-জাব্বার মেডিকেল সেন্টার",
    addressEn: "H-93/4 (1st Floor), Airport Road, Kakoli, Banani, Dhaka-1213, Bangladesh",
    phone: "01332-119140",
    email: "aljabbarmedicalcenterbd25@gmail.com",
    destinationCountry: "U.A.E",
    medicalStatus: "FIT",
    medicalStatusText: "For the above mentioned tests"
  },
  footer: {
    checkedBy: {
      name: "Md. Shohel Rana",
      credentials: "DMT. in Laborotory Medicin\nAl- Jabbar Medical Center",
      center: "Al-Jabbar Medical Center",
      signature: DEFAULT_CHECKED_SIGNATURE
    },
    medicalOfficer: {
      name: "DR. ALI AHSAN",
      credentials: "MBBS,DMU (SUB),MPH (C.M),BSMMU\nMedical Officer\nAl- Jabbar Medical Center",
      center: "Al-Jabbar Medical Center",
      signature: DEFAULT_DOCTOR_SIGNATURE
    },
    centerStamp: "",
    showSignatures: true,
    showStamp: true
  }
};

// Preset lists of options to assist user quick-typing or building a normal report
export const PRESETS = {
  bloodGroups: ['"O" (+ve)', "A POSITIVE", "A NEGATIVE", "B POSITIVE", "B NEGATIVE", "O POSITIVE", "O NEGATIVE", "AB POSITIVE", "AB NEGATIVE"],
  sexes: ["MALE", "FEMALE", "OTHER"],
  fitStatus: ["FIT", "UNFIT", "HELD UP"] as const,
  normalPhysical: {
    heart: "NAD",
    liver: "NORMAL",
    spleen: "NORMAL",
    eyeLt: "6/6",
    eyeRt: "6/6",
    ent: "NAD",
    skin: "NORMAL",
    physicalCondition: "NORMAL",
    ecg: "Not Seen",
    chestView: "NORMAL"
  },
  normalLabs: {
    hbsag: "NEGATIVE",
    vdrl: "NON-REACTIVE",
    tpha: "NEGATIVE",
    sBilirubin: "0.9 mg/dl",
    sugarRandom: "5.7 mmol/L",
    hemoglobin: "13.3 mg/dl",
    pregnancyTest: "NOT APPLICABLE"
  }
};
