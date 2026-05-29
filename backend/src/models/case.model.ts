export enum CaseStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Failed = 'Failed',
  OnHold = 'OnHold',
}

export enum RiskLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical',
}

export enum VerificationType {
  Employment = 'Employment',
  Education = 'Education',
  Criminal = 'Criminal',
  Credit = 'Credit',
  Reference = 'Reference',
  Identity = 'Identity',
  Address = 'Address',
}

export interface VerificationCase {
  id: string;
  caseNumber: string;
  candidateName: string;
  candidateEmail: string;
  company: string;
  position: string;
  verificationType: VerificationType;
  status: CaseStatus;
  riskLevel: RiskLevel;
  assignedTo: string;
  findings: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}
