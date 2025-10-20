export interface Customer {
  id: string;
  businessName: string;
  representativeName: string;
  rnc?: string | null;
  email?: string | null;
  notes?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
