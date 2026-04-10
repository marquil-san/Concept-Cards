import { useQuery } from "@tanstack/react-query";
import ConceptCard from "@/components/concept-card";
import { type Concept } from "@shared/schema";
import { useState } from "react";
import { Search, Shuffle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import PythonLogo from "@/components/python-logo";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const { data: concepts, isLoading, error } = useQuery<Concept[]>({
    queryKey: ["/api/concepts"],
  });

  const goToRandomConcept = () => {
    if (concepts?.length) {
      const randomConcept = concepts[Math.floor(Math.random() * concepts.length)];
      setLocation(`/concept/${randomConcept.id}`);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-red-500">Failed to load concepts. Please try again later.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-4xl mb-8 text-center text-gray-900/80">Python Concepts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-white/20 backdrop-blur-lg animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!concepts?.length) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p>No concepts available.</p>
      </div>
    );
  }

  const filteredConcepts = concepts.filter(concept =>
    concept.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    concept.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    concept.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Python Logo Background */}
      <div className="absolute inset-0 flex justify-center items-center opacity-20 pointer-events-none">
        <PythonLogo />
      </div>

      <div className="relative z-10 container mx-auto p-8">
        <h1 className="text-4xl mb-8 text-center text-gray-800">Python Concepts</h1>

        <div className="mb-8 max-w-md mx-auto">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/20 backdrop-blur-lg text-gray-900 placeholder-gray-700"
            />
            <Button variant="outline" size="icon" className="bg-white/30 hover:bg-white/50">
              <Search className="h-4 w-4 text-gray-900" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={goToRandomConcept}
              className="bg-white/30 hover:bg-white/50 text-gray-900"
            >
              <Shuffle className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConcepts.map((concept) => (
            <Link key={concept.id} href={`/concept/${concept.id}`} className="block">
              <ConceptCard concept={concept} className="bg-white/20 backdrop-blur-lg cursor-pointer hover:bg-white/30 transition" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
