import { ProjectCategory, ProjectStatus } from "./project";

export interface ProjectFilters {
  categories: ProjectCategory[];
  fundingRange: [number, number];
  location: string;
  status: ProjectStatus[];
  searchQuery: string;
}