import { ProjectCategory } from '@/types/project';

export interface CategoryInfo {
  id: ProjectCategory;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  color: string;
  examples: string[];
  popularTags: string[];
}

export const CATEGORY_DATA: Record<ProjectCategory, CategoryInfo> = {
  medical: {
    id: 'medical',
    name: 'Medical & Health',
    description: 'Support medical treatments, healthcare initiatives, and wellness programs',
    icon: 'Heart',
    color: '#ef4444', // red-500
    examples: ['Surgery funding', 'Medical equipment', 'Health awareness campaigns', 'Therapy sessions'],
    popularTags: ['surgery', 'treatment', 'healthcare', 'medical bills', 'therapy', 'wellness']
  },
  education: {
    id: 'education',
    name: 'Education',
    description: 'Fund educational programs, scholarships, and learning resources',
    icon: 'GraduationCap',
    color: '#3b82f6', // blue-500
    examples: ['School fees', 'Educational materials', 'Scholarship programs', 'Online courses'],
    popularTags: ['scholarship', 'school', 'university', 'books', 'tuition', 'learning']
  },
  technology: {
    id: 'technology',
    name: 'Technology',
    description: 'Support tech innovation, digital literacy, and technological solutions',
    icon: 'Laptop',
    color: '#8b5cf6', // violet-500
    examples: ['App development', 'Tech startups', 'Digital tools', 'Computer labs'],
    popularTags: ['startup', 'app', 'software', 'innovation', 'digital', 'tech']
  },
  community: {
    id: 'community',
    name: 'Community',
    description: 'Build stronger communities through local initiatives and social programs',
    icon: 'Users',
    color: '#10b981', // emerald-500
    examples: ['Community centers', 'Local events', 'Neighborhood projects', 'Social programs'],
    popularTags: ['community', 'local', 'neighborhood', 'social', 'volunteer', 'outreach']
  },
  disaster_relief: {
    id: 'disaster_relief',
    name: 'Disaster Relief',
    description: 'Provide emergency aid and support for disaster-affected communities',
    icon: 'Shield',
    color: '#f59e0b', // amber-500
    examples: ['Flood relief', 'Emergency supplies', 'Temporary shelter', 'Recovery programs'],
    popularTags: ['emergency', 'disaster', 'relief', 'flood', 'cyclone', 'earthquake', 'aid']
  },
  animals: {
    id: 'animals',
    name: 'Animals & Wildlife',
    description: 'Protect animals, support wildlife conservation, and animal welfare',
    icon: 'PawPrint',
    color: '#059669', // emerald-600
    examples: ['Animal rescue', 'Wildlife conservation', 'Pet care', 'Habitat protection'],
    popularTags: ['rescue', 'wildlife', 'conservation', 'pets', 'shelter', 'veterinary']
  },
  arts_culture: {
    id: 'arts_culture',
    name: 'Arts & Culture',
    description: 'Promote cultural heritage, arts education, and creative expression',
    icon: 'Palette',
    color: '#ec4899', // pink-500
    examples: ['Art exhibitions', 'Cultural festivals', 'Music programs', 'Heritage preservation'],
    popularTags: ['art', 'culture', 'music', 'dance', 'heritage', 'festival', 'creative']
  },
  sports: {
    id: 'sports',
    name: 'Sports & Recreation',
    description: 'Support athletic programs, sports facilities, and recreational activities',
    icon: 'Trophy',
    color: '#f97316', // orange-500
    examples: ['Sports equipment', 'Training programs', 'Team sponsorship', 'Sports facilities'],
    popularTags: ['sports', 'athletics', 'training', 'equipment', 'team', 'competition']
  }
};

export const CATEGORY_OPTIONS = Object.values(CATEGORY_DATA).map(category => ({
  value: category.id,
  label: category.name,
  description: category.description,
  icon: category.icon,
  color: category.color
}));

export function getCategoryInfo(categoryId: ProjectCategory): CategoryInfo {
  return CATEGORY_DATA[categoryId];
}

export function getCategoryColor(categoryId: ProjectCategory): string {
  return CATEGORY_DATA[categoryId]?.color || '#6b7280';
}

export function getCategoryIcon(categoryId: ProjectCategory): string {
  return CATEGORY_DATA[categoryId]?.icon || 'Folder';
}