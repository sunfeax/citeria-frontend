export interface iServiceList {
  id: string;
  specialistId: string;
  specialistName: string;
  name: string;
  description: string;
  priceAmount: number;
  durationMinutes: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
}

export interface ServiceFilters {
  search: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  active: boolean | null;
}
