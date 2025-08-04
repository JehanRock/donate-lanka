import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Grid3X3, List } from "lucide-react";
import { CategoryCard } from "./CategoryCard";
import { CategoryForm } from "./CategoryForm";
import { CategoryFilter } from "./CategoryFilter";
import { Category, CategoryFormData, CategoryFilters } from "@/types/category";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Mock data for demonstration
const mockCategories: Category[] = [
  {
    id: "1",
    name: "Web Development",
    description: "Frontend and backend web applications using modern frameworks",
    color: "#3b82f6",
    projectCount: 12,
    createdAt: new Date("2024-01-15"),
    tags: ["React", "TypeScript", "Node.js"]
  },
  {
    id: "2",
    name: "Mobile Apps",
    description: "iOS and Android mobile applications",
    color: "#10b981",
    projectCount: 8,
    createdAt: new Date("2024-02-01"),
    tags: ["React Native", "Flutter", "iOS"]
  },
  {
    id: "3",
    name: "Data Science",
    description: "Machine learning and data analysis projects",
    color: "#f59e0b",
    projectCount: 5,
    createdAt: new Date("2024-01-20"),
    tags: ["Python", "ML", "Analytics"]
  },
  {
    id: "4",
    name: "DevOps",
    description: "Infrastructure, deployment, and automation tools",
    color: "#ef4444",
    projectCount: 15,
    createdAt: new Date("2024-01-10"),
    tags: ["Docker", "Kubernetes", "CI/CD"]
  },
  {
    id: "5",
    name: "Design Systems",
    description: "UI/UX design components and style guides",
    color: "#8b5cf6",
    projectCount: 7,
    createdAt: new Date("2024-02-10"),
    tags: ["Figma", "Design", "Components"]
  },
  {
    id: "6",
    name: "API Development",
    description: "RESTful and GraphQL API services",
    color: "#06b6d4",
    projectCount: 10,
    createdAt: new Date("2024-01-25"),
    tags: ["REST", "GraphQL", "API"]
  }
];

export const ProjectCategories = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<CategoryFilters>({
    search: "",
    sortBy: "name",
    sortOrder: "asc"
  });
  
  const { toast } = useToast();

  const filteredAndSortedCategories = useMemo(() => {
    let filtered = categories.filter(category =>
      category.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      category.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      category.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
    );

    filtered.sort((a, b) => {
      let aValue: any = a[filters.sortBy];
      let bValue: any = b[filters.sortBy];

      if (filters.sortBy === 'createdAt') {
        aValue = aValue.getTime();
        bValue = bValue.getTime();
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (filters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [categories, filters]);

  const handleCreateCategory = (data: CategoryFormData) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      ...data,
      projectCount: 0,
      createdAt: new Date(),
    };
    
    setCategories(prev => [...prev, newCategory]);
    setIsFormOpen(false);
    
    toast({
      title: "Category created",
      description: `"${data.name}" has been successfully created.`,
    });
  };

  const handleEditCategory = (data: CategoryFormData) => {
    if (!editingCategory) return;
    
    setCategories(prev => prev.map(cat => 
      cat.id === editingCategory.id 
        ? { ...cat, ...data }
        : cat
    ));
    
    setEditingCategory(null);
    
    toast({
      title: "Category updated",
      description: `"${data.name}" has been successfully updated.`,
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;

    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    setDeletingCategoryId(null);
    
    toast({
      title: "Category deleted",
      description: `"${category.name}" has been successfully deleted.`,
      variant: "destructive",
    });
  };

  const handleViewProjects = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    toast({
      title: "View Projects",
      description: `Viewing projects for "${category?.name}". This would navigate to the projects page.`,
    });
  };

  const openEditForm = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Categories</h1>
          <p className="text-muted-foreground mt-1">
            Organize and manage your project categories
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </header>

      <section aria-label="Category filters">
        <CategoryFilter
          filters={filters}
          onFiltersChange={setFilters}
          totalCount={categories.length}
          filteredCount={filteredAndSortedCategories.length}
        />
      </section>

      <section aria-label="Categories list">
        {filteredAndSortedCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Grid3X3 className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No categories found</h3>
            <p className="text-muted-foreground mb-4">
              {filters.search ? "Try adjusting your search criteria" : "Get started by creating your first category"}
            </p>
            {!filters.search && (
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Category
              </Button>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredAndSortedCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={openEditForm}
                onDelete={setDeletingCategoryId}
                onViewProjects={handleViewProjects}
              />
            ))}
          </div>
        )}
      </section>

      <CategoryForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingCategory ? handleEditCategory : handleCreateCategory}
        category={editingCategory}
      />

      <AlertDialog 
        open={!!deletingCategoryId} 
        onOpenChange={() => setDeletingCategoryId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
              All projects in this category will need to be reassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingCategoryId && handleDeleteCategory(deletingCategoryId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};
