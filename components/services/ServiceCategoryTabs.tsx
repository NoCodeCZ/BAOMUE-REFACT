"use client";

import { useState } from "react";
import { Service, ServiceCategory } from "@/lib/types";
import ServiceCard from "./ServiceCard";

interface ServiceCategoryTabsProps {
  services: Service[];
  categories: ServiceCategory[];
}

export default function ServiceCategoryTabs({ services, categories }: ServiceCategoryTabsProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  const filteredServices = activeCategory === "all"
    ? services
    : services.filter(s => {
        if (!s.category) return false;
        if (typeof s.category === 'object') {
          return s.category.slug === activeCategory;
        }
        // If category is a number, find the category object
        const cat = categories.find(c => c.id === s.category);
        return cat?.slug === activeCategory;
      });
  
  return (
    <>
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mt-8 px-4">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === "all"
              ? "bg-cyan-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          All Services
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category.slug
                ? "bg-cyan-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Services Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 px-4">
        {filteredServices.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
      
      {filteredServices.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No services found in this category.
        </div>
      )}
    </>
  );
}

