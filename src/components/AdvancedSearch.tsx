import { useState, useMemo } from "react";
import { Search, X, TrendingUp, User, Bookmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types/project";
import { CATEGORY_DATA } from "@/data/categories";

interface AdvancedSearchProps {
  projects: Project[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSuggestionSelect?: (item: any) => void;
  className?: string;
}

interface SearchSuggestion {
  type: "project" | "category" | "creator" | "tag";
  id: string;
  title: string;
  subtitle?: string;
  icon?: any;
}

export const AdvancedSearch = ({
  projects,
  searchQuery,
  onSearchChange,
  onSuggestionSelect,
  className = ""
}: AdvancedSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Medical emergency",
    "Education support",
    "Disaster relief"
  ]);

  const suggestions = useMemo((): SearchSuggestion[] => {
    if (!searchQuery || searchQuery.length < 2) return [];

    const results: SearchSuggestion[] = [];
    const query = searchQuery.toLowerCase();

    // Project suggestions
    projects
      .filter(project => 
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.creator.displayName.toLowerCase().includes(query)
      )
      .slice(0, 5)
      .forEach(project => {
        results.push({
          type: "project",
          id: project.id,
          title: project.title,
          subtitle: `by ${project.creator.displayName}`,
          icon: Bookmark
        });
      });

    // Category suggestions
    Object.entries(CATEGORY_DATA)
      .filter(([key, category]) => 
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query)
      )
      .slice(0, 3)
      .forEach(([key, category]) => {
        results.push({
          type: "category",
          id: key,
          title: category.name,
          subtitle: category.description,
          icon: TrendingUp
        });
      });

    // Creator suggestions
    const uniqueCreators = Array.from(
      new Set(projects.map(p => p.creator.displayName))
    ).filter(name => name.toLowerCase().includes(query))
      .slice(0, 3);

    uniqueCreators.forEach(creator => {
      results.push({
        type: "creator",
        id: creator,
        title: creator,
        subtitle: "Creator",
        icon: User
      });
    });

    return results;
  }, [searchQuery, projects]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Add to recent searches
      setRecentSearches(prev => [
        searchQuery,
        ...prev.filter(s => s !== searchQuery)
      ].slice(0, 5));
      onSearchChange(searchQuery);
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === "project") {
      onSuggestionSelect?.(suggestion);
    } else {
      onSearchChange(suggestion.title);
    }
    setIsOpen(false);
  };

  const clearSearch = () => {
    onSearchChange("");
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search projects, creators, or categories..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() => setIsOpen(true)}
                  className="pl-10 pr-10 h-12 text-base bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-2 focus:border-primary"
                />
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </div>
        </PopoverTrigger>

        <PopoverContent 
          className="w-[600px] p-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 border-2" 
          align="start"
          side="bottom"
        >
          <Command>
            <CommandList className="max-h-[400px]">
              {suggestions.length > 0 ? (
                <>
                  <CommandGroup heading="Search Results">
                    {suggestions.map((suggestion) => {
                      const Icon = suggestion.icon;
                      return (
                        <CommandItem
                          key={`${suggestion.type}-${suggestion.id}`}
                          onSelect={() => handleSuggestionClick(suggestion)}
                          className="flex items-center gap-3 p-3 cursor-pointer"
                        >
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="font-medium">{suggestion.title}</div>
                            {suggestion.subtitle && (
                              <div className="text-sm text-muted-foreground">
                                {suggestion.subtitle}
                              </div>
                            )}
                          </div>
                          <Badge variant="secondary" className="capitalize">
                            {suggestion.type}
                          </Badge>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </>
              ) : searchQuery ? (
                <CommandEmpty className="py-6 text-center">
                  <div className="text-muted-foreground">
                    No results found for "{searchQuery}"
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Try different keywords or browse by category
                  </div>
                </CommandEmpty>
              ) : (
                <>
                  {recentSearches.length > 0 && (
                    <CommandGroup heading="Recent Searches">
                      {recentSearches.map((search, index) => (
                        <CommandItem
                          key={index}
                          onSelect={() => {
                            onSearchChange(search);
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-3 p-3 cursor-pointer"
                        >
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <span>{search}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                  
                  <CommandGroup heading="Search Tips">
                    <div className="p-3 text-sm text-muted-foreground">
                      <div>• Search by project name or description</div>
                      <div>• Find projects by creator name</div>
                      <div>• Browse by category or tags</div>
                      <div>• Use specific keywords for better results</div>
                    </div>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};