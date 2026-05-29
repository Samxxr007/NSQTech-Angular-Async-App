export interface VerificationCase {
  id: string;
  caseNumber: string;
  candidateName: string;
  candidateEmail: string;
  company: string;
  position: string;
  verificationType: string;
  status: 'Pending' | 'InProgress' | 'Completed' | 'Failed' | 'OnHold';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedTo: string;
  findings: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}
