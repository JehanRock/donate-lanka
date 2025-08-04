import { useMemo } from "react";
import { Project } from "@/types/project";
import { SortOption, SortDirection } from "@/components/ProjectSorting";

export const useProjectSorting = (
  projects: Project[],
  sortBy: SortOption,
  sortDirection: SortDirection
) => {
  return useMemo(() => {
    const sorted = [...projects].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "newest":
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case "oldest":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "trending":
          // Sort by combination of donor count and recent activity
          const trendingScoreA = a.donorCount + (a.currentAmount / a.fundingGoal) * 100;
          const trendingScoreB = b.donorCount + (b.currentAmount / b.fundingGoal) * 100;
          comparison = trendingScoreB - trendingScoreA;
          break;
        case "funding_goal":
          comparison = b.fundingGoal - a.fundingGoal;
          break;
        case "progress":
          const progressA = (a.currentAmount / a.fundingGoal) * 100;
          const progressB = (b.currentAmount / b.fundingGoal) * 100;
          comparison = progressB - progressA;
          break;
        case "deadline":
          comparison = new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
          break;
        default:
          return 0;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [projects, sortBy, sortDirection]);
};