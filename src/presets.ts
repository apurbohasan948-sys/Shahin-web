import { MedicalReport } from "./types";

// Default placeholder candidate photo (A stylish outline avatar)
export const DEFAULT_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f3f4f6"/><circle cx="50" cy="40" r="18" fill="%239ca3af"/><path d="M15,90 C15,65 30,55 50,55 C70,55 85,65 85,90 Z" fill="%239ca3af"/></svg>`;

// Programmatic Checked By signature SVG
export const DEFAULT_CHECKED_SIGNATURE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="50" viewBox="0 0 120 50"><path d="M 10 32 C 30 10, 40 45, 55 20 C 70 5, 80 42, 95 15 C 105 2, 110 30, 115 25" fill="none" stroke="%231e3a8a" stroke-width="2" stroke-linecap="round"/><path d="M 15 28 L 110 32" fill="none" stroke="%231e3a8a" stroke-width="1.5" stroke-linecap="round"/></svg>`;

// Programmatic Doctor signature SVG
export const DEFAULT_DOCTOR_SIGNATURE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="50" viewBox="0 0 120 50"><path d="M 15 15 C 20 5, 25 35, 30 20 C 42 5, 50 45, 60 15 C 75 -5, 85 45, 95 25 C 102 15, 105 5, 110 20" fill="none" stroke="%231e3a8a" stroke-width="2" stroke-linecap="round"/><path d="M 25 35 C 45 42, 85 40, 105 25" fill="none" stroke="%231e3a8a" stroke-width="1.5"/></svg>`;

export const initialReport: MedicalReport = {
  id: "AJ-26-3457",
  createdAt: "2026-05-10",
  personal: {
    regNo: "AJ-26-3457",
    dateOfExam: "10.05.2026",
    fullName: "VHABESH SARKER",
    fatherName: "SUDEB SARKAR",
    motherName: "SHEFALI RANI SARKAR",
    passportNo: "EK0741468",
    dob: "29.12.1987",
    sex: "MALE",
    agency: "SHAN/AF-1",
    candidatePhoto: "" // Set to empty to trigger fallback, but we'll include a real default image block in the component
  },
  physical: {
    height: "163 cm",
    weight: "57 kg",
    pulse: "87 bpm",
    bloodPressure: "120/75 mm of Hg",
    heart: "NAD",
    liver: "NORMAL",
    spleen: "NORMAL",
    eyeLt: "6/6",
    eyeRt: "6/6",
    ent: "NAD",
    skin: "NORMAL",
    physicalCondition: "NORMAL",
    ecg: "Not Seen",
    chestView: "X-Ray Fine Hilar Calcification"
  },
  laboratory: {
    serology: {
      hbsag: "NEGATIVE",
      vdrl: "NON-REACTIVE",
      tpha: "NEGATIVE",
      bloodGroup: "A POSITIVE"
    },
    biochemical: {
      sBilirubin: "0.9 mg/dl",
      sugarRandom: "6.5 mmol/L"
    },
    hematology: {
      hemoglobin: "13.6 mg/dl"
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
    destinationCountry: "QATAR",
    medicalStatus: "HELD UP",
    medicalStatusText: "For the above mentioned tests"
  },
  footer: {
    checkedBy: {
      name: "Md. Shohel Rana",
      credentials: "DMT. in Laborotory Medicine",
      center: "Al-Jabbar Medical Center",
      signature: DEFAULT_CHECKED_SIGNATURE
    },
    medicalOfficer: {
      name: "DR. ALI AHSAN",
      credentials: "MBBS,DMU (SUB),MPH (C.M),BSMMU\nMedical Officer",
      center: "Al-Jabbar Medical Center",
      signature: DEFAULT_DOCTOR_SIGNATURE
    },
    centerStamp: "", // Stamp will render beautifully in SVG based on App configuration
    showSignatures: true,
    showStamp: true
  }
};

// Preset lists of options to assist user quick-typing or building a normal report
export const PRESETS = {
  bloodGroups: ["A POSITIVE", "A NEGATIVE", "B POSITIVE", "B NEGATIVE", "O POSITIVE", "O NEGATIVE", "AB POSITIVE", "AB NEGATIVE"],
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
    ecg: "Normal",
    chestView: "Normal"
  },
  normalLabs: {
    hbsag: "NEGATIVE",
    vdrl: "NON-REACTIVE",
    tpha: "NEGATIVE",
    sBilirubin: "0.8 mg/dl",
    sugarRandom: "5.5 mmol/L",
    hemoglobin: "14.2 mg/dl",
    pregnancyTest: "NOT APPLICABLE"
  }
};
