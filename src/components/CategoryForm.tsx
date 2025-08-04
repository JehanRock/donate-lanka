import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { X, Plus } from "lucide-react";
import { Category, CategoryFormData } from "@/types/category";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Name must be less than 50 characters"),
  description: z.string().min(1, "Description is required").max(200, "Description must be less than 200 characters"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Please enter a valid hex color"),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed"),
});

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
  category?: Category | null;
  isLoading?: boolean;
}

export const CategoryForm = ({ isOpen, onClose, onSubmit, category, isLoading = false }: CategoryFormProps) => {
  const [tagInput, setTagInput] = useState("");
  
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      color: category?.color || "#3b82f6",
      tags: category?.tags || [],
    },
  });

  const { watch, setValue } = form;
  const tags = watch("tags");

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 10) {
      setValue("tags", [...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue("tags", tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (data: CategoryFormData) => {
    onSubmit(data);
    form.reset();
    setTagInput("");
  };

  const handleClose = () => {
    form.reset();
    setTagInput("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]" aria-describedby="category-form-description">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Create New Category"}
          </DialogTitle>
          <DialogDescription id="category-form-description">
            {category 
              ? "Update the category information below." 
              : "Fill in the details to create a new project category."
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter category name" 
                      {...field}
                      aria-describedby="name-error"
                    />
                  </FormControl>
                  <FormMessage id="name-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe this category"
                      className="resize-none"
                      rows={3}
                      {...field}
                      aria-describedby="description-error"
                    />
                  </FormControl>
                  <FormMessage id="description-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <Input 
                        type="color" 
                        className="w-16 h-10 p-1 border rounded cursor-pointer"
                        {...field}
                        aria-describedby="color-error"
                      />
                      <Input 
                        type="text" 
                        placeholder="#3b82f6"
                        className="flex-1"
                        {...field}
                        aria-describedby="color-error"
                      />
                    </div>
                  </FormControl>
                  <FormMessage id="color-error" />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  aria-label="Tag input"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || tags.includes(tagInput.trim()) || tags.length >= 10}
                  aria-label="Add tag"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-md">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1 hover:bg-transparent"
                        onClick={() => handleRemoveTag(tag)}
                        aria-label={`Remove tag ${tag}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                {tags.length}/10 tags added
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : category ? "Update Category" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
