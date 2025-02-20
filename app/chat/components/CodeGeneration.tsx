'use client';

import { useState } from 'react';
import { Button } from "@/components/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/card";
import { X, Copy, Download } from "lucide-react";
import { generateResponse } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';

export function CodeGeneration() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [language, setLanguage] = useState("JavaScript");
  // const [tone, setTone] = useState("Concise");
  const [codeDescription, setCodeDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const programmingLanguages = ["JavaScript", "Python", "Java", "C++", "C#", "Go", "Rust", "TypeScript", "Swift", "Kotlin", "React", "Other"];
  // const tones = ["Concise", "Descriptive", "Beginner-Friendly", "Professional", "Commented", "Optimized"];

  const formatOutput = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  const handleSubmit = async () => {
    if (!codeDescription.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setLoading(true);
    setOutput(null);
    setIsOpen(false);

    try {
      const response = await generateResponse(codeDescription, 'generate', language);
      setOutput(response);
      setIsOpen(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from('chat_history').insert({
          user_id: session.user.id,
          message: codeDescription,
          response: response,
          type: 'generate',
          language: language
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      toast.success('Generated code copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (output) {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      const maxWidth = pageWidth - 2 * margin;
      let yPosition = 20;

      doc.setFontSize(14);
      doc.text("Generated Code", margin, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      const splitText = doc.splitTextToSize(output, maxWidth);
      
      splitText.forEach((line: string | string[], index: any) => {
        if (yPosition + 10 > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += 7;
      });
      
      doc.save('generated_code.pdf');
      toast.success('Generated code downloaded as PDF!');
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Code Generation</CardTitle>
        <CardDescription>Generate code based on your requirements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Programming Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-2 rounded-md border bg-background"
          >
            {programmingLanguages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        

        <div>
          <label className="block text-sm font-medium mb-1">Description or Requirements</label>
          <textarea
            placeholder="Describe what you want to achieve..."
            value={codeDescription}
            onChange={(e) => setCodeDescription(e.target.value)}
            rows={3}
            className="w-full p-2 rounded-md border bg-background resize-none"
          />
        </div>

        <Button onClick={handleSubmit} disabled={loading || !codeDescription.trim()} className="w-full glow-border">
          {loading ? "Processing..." : "Generate Code"}
        </Button>

        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-card w-[90vw] max-w-[800px] rounded-lg shadow-lg relative animate-in slide-in-from-bottom-4 duration-300">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg text-card-foreground">Generated Code</h3>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted/80 transition-colors" onClick={handleCopy}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted/80 transition-colors" onClick={handleDownload}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted/80 transition-colors" onClick={() => setIsOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                  <div className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md" dangerouslySetInnerHTML={{ __html: output ? formatOutput(output) : '' }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
