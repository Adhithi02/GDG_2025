export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'citizen' | 'government';
  department?: string;
}

export interface Complaint {
  id: string;
  userId: string;
  title: string;
  description: string;
  image: string;
  location: string;
  status: 'pending' | 'in-progress' | 'resolved';
  department: string;
  createdAt: string;
  resolvedImage?: string;
  resolvedAt?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'citizen' | 'government', department?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ComplaintContextType {
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'status'>) => void;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
  deleteComplaint: (id: string) => void;
  getComplaintsByDepartment: (department: string) => Complaint[];
  getComplaintsByUser: (userId: string) => Complaint[];
}

export const DEPARTMENTS = [
  { id: 'BWSSB', name: 'BWSSB (Water Supply)' },
  { id: 'BESCOM', name: 'BESCOM (Electricity)' },
  { id: 'PWD', name: 'PWD (Public Works)' },
  { id: 'BBMP', name: 'BBMP (Municipal Corporation)' },
  { id: 'ANIMAL_WELFARE', name: 'Animal Welfare' },
  { id: 'TRAFFIC_POLICE', name: 'Traffic Police' },
  { id: 'HEALTH', name: 'Health Department' }
] as const;