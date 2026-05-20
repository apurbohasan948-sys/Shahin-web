export interface PersonalDetails {
  regNo: string;
  dateOfExam: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  passportNo: string;
  dob: string;
  sex: string;
  agency: string;
  candidatePhoto: string; // base64 or URL
}

export interface PhysicalExamination {
  height: string;
  weight: string;
  pulse: string;
  bloodPressure: string;
  heart: string;
  liver: string;
  spleen: string;
  eyeLt: string;
  eyeRt: string;
  ent: string;
  skin: string;
  physicalCondition: string;
  ecg: string;
  chestView: string;
}

export interface Serology {
  hbsag: string;
  vdrl: string;
  tpha: string;
  bloodGroup: string;
}

export interface Biochemical {
  sBilirubin: string;
  sugarRandom: string;
}

export interface Hematology {
  hemoglobin: string;
}

export interface Urine {
  pregnancyTest: string;
}

export interface LaboratoryInvestigations {
  serology: Serology;
  biochemical: Biochemical;
  hematology: Hematology;
  urine: Urine;
}

export interface ReportConfig {
  centerNameEn: string;
  centerNameBn: string;
  addressEn: string;
  phone: string;
  email: string;
  destinationCountry: string; // e.g. QATAR, OMAN, etc.
  medicalStatus: "FIT" | "UNFIT" | "HELD UP";
  medicalStatusText: string; // e.g., "This Person is Found Medically, Fit / Unfit / Held Up for the above mentioned tests"
}

export interface FooterConfig {
  checkedBy: {
    name: string;
    credentials: string;
    center: string;
    signature: string; // base64 or path
  };
  medicalOfficer: {
    name: string;
    credentials: string;
    center: string;
    signature: string; // base64 or path
  };
  centerStamp: string; // base64 or path
  showSignatures: boolean;
  showStamp: boolean;
}

export interface MedicalReport {
  id: string;
  createdAt: string;
  personal: PersonalDetails;
  physical: PhysicalExamination;
  laboratory: LaboratoryInvestigations;
  config: ReportConfig;
  footer: FooterConfig;
}
