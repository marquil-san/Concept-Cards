import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import type { Concept } from "@shared/schema";

interface ConceptCardProps {
  concept: Concept;
}

export default function ConceptCard({ concept }: ConceptCardProps) {
  return (
    <Link href={`/concept/${concept.id}`}>
      <Card className="cursor-pointer h-full transition-all hover:shadow-lg hover:scale-105 bg-background/90 backdrop-blur border-2 border-[#306998]">
        <CardContent className="p-6 bg-gradient-to-br from-pink-300/60 via-pink-200/50 to-cyan-200/60 rounded-lg">
          <motion.h2 
            className="text-xl font-comfortaa text-foreground mb-2"
            whileHover={{ scale: 1.02 }}
          >
            {concept.title}
          </motion.h2>
          <p className="text-muted-foreground line-clamp-3">
            {concept.description}
          </p>
          <div className="mt-4">
            <span className="inline-block px-3 py-1 rounded-full text-sm bg-pink-500/20 text-pink-300">
              {concept.category}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
