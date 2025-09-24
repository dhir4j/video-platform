"use client"

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { getCountries, getTags } from "@/lib/data";

interface FilterSheetContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterSheetContext = React.createContext<FilterSheetContextType | undefined>(undefined);

export function FilterSheetProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <FilterSheetContext.Provider value={{ open, setOpen }}>
      {children}
    </FilterSheetContext.Provider>
  );
}

export function useFilterSheet() {
  const context = React.useContext(FilterSheetContext);
  if (context === undefined) {
    throw new Error("useFilterSheet must be used within a FilterSheetProvider");
  }
  return context;
}

export function FilterSheet() {
  const { open, setOpen } = useFilterSheet();
  const tags = getTags();
  const countries = getCountries();
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = React.useState<string[]>([]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }

  const handleCountryToggle = (country: string) => {
    setSelectedCountries(prev => 
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  }

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedCountries([]);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="max-h-[80vh]">
        <SheetHeader>
          <SheetTitle>Filter Videos</SheetTitle>
          <SheetDescription>
            Select categories and countries to refine your search.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(80vh-180px)] mt-4">
          <div className="p-4 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Button
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Countries</h3>
              <div className="flex flex-wrap gap-2">
                {countries.map(country => (
                   <Button
                    key={country}
                    variant={selectedCountries.includes(country) ? "default" : "outline"}
                    onClick={() => handleCountryToggle(country)}
                  >
                    {country}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
          <div className="flex gap-4">
             <Button variant="outline" className="w-full" onClick={clearFilters}>Clear</Button>
             <Button className="w-full" onClick={() => setOpen(false)}>Apply</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
