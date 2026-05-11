"use client";

import { Filter } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Category } from "@/lib/interface/category.interface";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "../ui/checkbox";

interface SearchFilterProps {
  searchParams?: string;
  categories: Category[];
}

export function SearchFilter({ searchParams, categories }: SearchFilterProps) {
  const router = useRouter();
  const [name, setName] = useState(searchParams || "");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (name.trim()) {
      params.append("name", name.trim());
    }
    if (selectedCategory) {
      params.append("category", selectedCategory);
    }
    
    const query = params.toString();
    router.push(`/movie/search${query ? `?${query}` : ""}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? "" : categoryId);
  };

  return (
    <div className="bg-secondary p-4 rounded-lg w-1/2 mt-8 flex items-center gap-4">
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search for movies..."
        className="w-full"
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            className="flex justify-center items-center hover:cursor-pointer text-primary hover:bg-secondary/80"
            title="Filter by category"
          >
            <Filter size={20} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <h2 className="text-lg font-semibold mb-4">Select Category</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories
              .filter((category): category is Category & { id: string } => Boolean(category.id))
              .map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={selectedCategory === category.id}
                    onCheckedChange={() => handleCategorySelect(category.id)}
                  />
                <label
                  htmlFor={category.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
          <Button
            onClick={() => setIsDialogOpen(false)}
            className="mt-4 w-full"
          >
            Done
          </Button>
        </DialogContent>
      </Dialog>
      <Button
        onClick={handleSearch}
        variant="secondary"
        className="border border-primary text-primary hover:bg-secondary/80"
      >
        Search
      </Button>
    </div>
  );
}
