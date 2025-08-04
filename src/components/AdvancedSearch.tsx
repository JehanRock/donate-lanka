import { useState, useMemo, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Project } from "@/types/project";

interface AdvancedSearchProps {
  projects: Project[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSuggestionSelect?: (project: Project) => void;
  className?: string;
}

export const AdvancedSearch = ({
  projects,
  searchQuery,
  onSearchChange,
  onSuggestionSelect,
  className
}: AdvancedSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Generate search suggestions based on input
  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      return [];
    }

    const query = searchQuery.toLowerCase().trim();
    const suggestions: { type: 'project' | 'category' | 'creator'; data: any; label: string }[] = [];

    // Project suggestions
    const projectMatches = projects
      .filter(project => 
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.creator.displayName.toLowerCase().includes(query)
      )
      .slice(0, 5)
      .map(project => ({
        type: 'project' as const,
        data: project,
        label: project.title
      }));

    // Category suggestions
    const categories = Array.from(new Set(projects.map(p => p.category)))
      .filter(category => category.toLowerCase().includes(query))
      .slice(0, 3)
      .map(category => ({
        type: 'category' as const,
        data: category,
        label: `Category: ${category.replace('_', ' ')}`
      }));

    // Creator suggestions
    const creators = Array.from(new Set(projects.map(p => p.creator.displayName)))
      .filter(creator => creator.toLowerCase().includes(query))
      .slice(0, 3)
      .map(creator => ({
        type: 'creator' as const,
        data: creator,
        label: `Creator: ${creator}`
      }));

    return [...projectMatches, ...categories, ...creators];
  }, [searchQuery, projects]);

  const handleSearchSubmit = useCallback((query: string) => {
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches(prev => [query.trim(), ...prev.slice(0, 4)]);
    }
    onSearchChange(query);
    setIsOpen(false);
  }, [onSearchChange, recentSearches]);

  const handleSuggestionClick = useCallback((suggestion: any) => {
    if (suggestion.type === 'project') {
      onSuggestionSelect?.(suggestion.data);
    } else if (suggestion.type === 'category') {
      onSearchChange(`category:${suggestion.data}`);
    } else if (suggestion.type === 'creator') {
      onSearchChange(`creator:${suggestion.data}`);
    }
    setIsOpen(false);
  }, [onSearchChange, onSuggestionSelect]);

  const clearSearch = () => {
    onSearchChange("");
  };

  const removeRecentSearch = (searchTerm: string) => {
    setRecentSearches(prev => prev.filter(term => term !== searchTerm));
  };

  return (
    <div className={cn("relative", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects, categories, or creators..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setIsOpen(e.target.value.length > 0);
              }}
              onFocus={() => setIsOpen(searchQuery.length > 0 || recentSearches.length > 0)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit(searchQuery);
                }
                if (e.key === 'Escape') {
                  setIsOpen(false);
                }
              }}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </PopoverTrigger>
        
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            {/* Search Results */}
            {suggestions.length > 0 && (
              <CommandGroup heading="Suggestions">
                {suggestions.map((suggestion, index) => (
                  <CommandItem
                    key={`${suggestion.type}-${index}`}
                    onSelect={() => handleSuggestionClick(suggestion)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{suggestion.label}</span>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.type}
                      </Badge>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && searchQuery.length === 0 && (
              <CommandGroup heading="Recent Searches">
                {recentSearches.map((search, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => handleSearchSubmit(search)}
                    className="cursor-pointer group"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{search}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecentSearch(search);
                        }}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Empty State */}
            {suggestions.length === 0 && searchQuery.length > 0 && (
              <CommandEmpty>
                No results found for "{searchQuery}"
              </CommandEmpty>
            )}
          </Command>
        </PopoverContent>
      </Popover>

      {/* Search Tips */}
      {searchQuery.length === 0 && (
        <div className="mt-2 text-xs text-muted-foreground">
          Try searching by project name, category, or creator. Use "category:" or "creator:" for specific searches.
        </div>
      )}
    </div>
  );
};