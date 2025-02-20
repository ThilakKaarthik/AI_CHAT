'use client';

import { useState } from 'react';
import { Button } from "@/components/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/card";
import { X, Copy, Download } from "lucide-react";
import { generateResponse } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';

export function CodeDebugger() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const formatOutput = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please enter code to debug');
      return;
    }

    setLoading(true);
    setOutput(null);
    setIsOpen(false);

    try {
      const response = await generateResponse(code, 'debug', 'any');
      setOutput(response);
      setIsOpen(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from("finalhistory").insert({
          user_id: session.user.id,
          message: code,
          response: response,
          action_type: "debug",
          created_at: new Date().toISOString(),
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
      toast.success('Debug results copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (output) {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 10;
      const maxWidth = pageWidth - 2 * margin;
      let yPosition = 20;

      doc.setFontSize(14);
      doc.text("Debug Results", margin, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      const splitText = doc.splitTextToSize(output, maxWidth);
      doc.text(splitText, margin, yPosition);

      doc.save('debug_results.pdf');
      toast.success('Debug results downloaded as PDF!');
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Code Debugger</CardTitle>
        <CardDescription>Debug your code and find solutions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Code</label>
          <textarea
            placeholder="Enter your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={8}
            className="w-full p-2 rounded-md border bg-background font-mono resize-none"
          />
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={loading || !code.trim()} 
          className="w-full glow-border"
        >
          {loading ? "Processing..." : "Debug Code"}
        </Button>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div 
              className="bg-card w-[90vw] max-w-[800px] rounded-lg shadow-lg relative animate-in slide-in-from-bottom-4 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg text-card-foreground">Debug Results</h3>
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
                  <div 
                    className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md"
                    dangerouslySetInnerHTML={{ __html: output ? formatOutput(output) : '' }}
                  />
                </div>
              </div>
            </div>
            <div className="absolute inset-0 -z-10" onClick={() => setIsOpen(false)} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
