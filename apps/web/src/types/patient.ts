export type PatientStatus = "Active" | "Discharged" | "In Treatment" | "Pending";

export interface Patient {
  id: string;
  name: string;
  status: PatientStatus;
  age: number;
  dateOfAdmission: string;
  doctorAssigned: string;
  department: string;
  lastVisitDate: string;
}
