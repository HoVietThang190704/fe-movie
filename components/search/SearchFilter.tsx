"use client";

import { Filter } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Category } from "@/lib/interface/category.interface";

type SearchFilterProps = {
  searchName: string;
  searchParams?: string;
  categories: Category[];
};

export function SearchFilter({ searchParams, categories }: SearchFilterProps) {
  return (
    <div className="bg-secondary p-4 rounded-lg w-1/2 mt-8 flex items-center gap-4">
      <Input
        type="text"
        name="name"
        defaultValue={searchParams}
        placeholder="Search for movies..."
        className="w-full"
      />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            className="w-4 flex justify-center items-center hover:cursor-pointer text-primary hover:bg-secondary/80"
          >
            <Filter className="" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <div className="grid grid-cols-4 gap-2">
            {categories.map((category) => (
              <div key={category.id}>{category.name}</div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <Button variant="secondary" className="border border-primary text-primary hover:bg-secondary/80">Search</Button>
    </div>
  );
}
