import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-tomorrow.css";
import { useEffect } from "react";

interface CodeBlockProps {
  code: string;
  language: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <pre className="h-full overflow-auto rounded-b-lg bg-gray-900">
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
}