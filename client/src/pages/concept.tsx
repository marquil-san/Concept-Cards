import { useQuery } from "@tanstack/react-query";
import { type Concept } from "@shared/schema";
import { useParams } from "wouter";
import CodeBlock from "@/components/ui/code-block";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function ConceptPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const { data: concept, isLoading } = useQuery<Concept>({
    queryKey: [`/api/concepts/${id}`],
  });

  const copyToClipboard = async (code: string, index: number) => {
    await navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    toast({
      title: "Copied!",
      description: "Code snippet copied to clipboard",
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/4 bg-card rounded" />
          <div className="h-32 bg-card rounded" />
          <div className="h-64 bg-card rounded" />
        </div>
      </div>
    );
  }

  if (!concept) {
    return (
      <div className="container mx-auto p-8">
        <p>Concept not found</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-8 bg-cyan-950/40 rounded-lg"
    >
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Concepts
          </Button>
        </Link>
      </div>

      <div className="bg-cyan-900/40 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl mb-4 text-gray-800">{concept.title}</h1>
        <span className="inline-block px-3 py-1 rounded-full text-sm bg-pink-500/30 text-pink-800 font-medium mb-4">
          {concept.category}
        </span>

        <div className="prose max-w-none mb-8 text-gray-200">
          <p className="whitespace-pre-wrap">{concept.description}</p>
        </div>

        <div className="space-y-6">
          {concept.snippets.map((snippet, index) => (
            <div key={index} className="relative bg-gray-900 rounded-lg overflow-hidden">
              <div className="bg-gray-800 p-3 pl-4 text-sm text-gray-300 border-b border-gray-700">
                {concept.methodNames[index]}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-2.5"
                onClick={() => copyToClipboard(snippet, index)}
              >
                {copiedIndex === index ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-400" />
                )}
              </Button>
              <CodeBlock code={snippet} language="python" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
