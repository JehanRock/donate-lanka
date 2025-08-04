import { ProjectCategory } from './project';

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  projectCount: number;
  createdAt: Date;
  tags: string[];
  type: ProjectCategory;
  icon?: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
  color: string;
  tags: string[];
  type: ProjectCategory;
}

export interface CategoryFilters {
  search: string;
  sortBy: 'name' | 'projectCount' | 'createdAt';
  sortOrder: 'asc' | 'desc';
  type?: ProjectCategory[];
}

export interface CategoryStats {
  totalProjects: number;
  totalFunding: number;
  averageFunding: number;
  successRate: number;
}
