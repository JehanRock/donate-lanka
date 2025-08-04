export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  projectCount: number;
  createdAt: Date;
  tags: string[];
}

export interface CategoryFormData {
  name: string;
  description: string;
  color: string;
  tags: string[];
}

export interface CategoryFilters {
  search: string;
  sortBy: 'name' | 'projectCount' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}
