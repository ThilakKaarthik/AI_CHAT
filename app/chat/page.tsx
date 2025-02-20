'use client';

import { Button } from '@/components/button';
import { History, Code2, Bug, FileSearch, Wand2, RefreshCcw } from 'lucide-react';
import { CodeGeneration } from './components/CodeGeneration';
import { CodeValidation } from './components/CodeValidation';
import { CodeDebugger } from './components/CodeDebugger';
import { CodeExplanation } from './components/CodeExplanation';
import { CodeRefactoring } from './components/CodeRefactoring';
import { useChatLogic } from "@/app/chat/action"

export default function ChatPage() {
  const { activeTab, setActiveTab } = useChatLogic(); // Import actions logic

  // Function to render the correct component based on the active tab
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'code-validation':
        return <CodeValidation />;
      case 'code-debugger':
        return <CodeDebugger />;
      case 'code-explanation':
        return <CodeExplanation />;
      case 'code-generation':
        return <CodeGeneration />;
      case 'code-refactoring':
        return <CodeRefactoring />;
      default:
        return <CodeGeneration />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="chat-decoration chat-decoration-1" />
      <div className="chat-decoration chat-decoration-2" />

      {/* Side Menu */}
      <div className="w-64 border-r bg-muted/80 backdrop-blur-sm p-4 flex flex-col relative z-10">
        <div className="space-y-4 mb-4 slide-in"></div>

        {/* Tab Menu */}
        <div className="flex flex-col space-y-2">
          <Button
            variant={activeTab === 'code-validation' ? 'secondary' : 'ghost'}
            className="w-full justify-start glow-border slide-in"
            onClick={() => setActiveTab('code-validation')}
            style={{ animationDelay: '100ms' }}
          >
            <Code2 className="mr-2 h-4 w-4 glow-icon" />
            Code Validation
          </Button>
          <Button
            variant={activeTab === 'code-debugger' ? 'secondary' : 'ghost'}
            className="w-full justify-start glow-border slide-in"
            onClick={() => setActiveTab('code-debugger')}
            style={{ animationDelay: '200ms' }}
          >
            <Bug className="mr-2 h-4 w-4 glow-icon" />
            Code Debugger
          </Button>
          <Button
            variant={activeTab === 'code-explanation' ? 'secondary' : 'ghost'}
            className="w-full justify-start glow-border slide-in"
            onClick={() => setActiveTab('code-explanation')}
            style={{ animationDelay: '300ms' }}
          >
            <FileSearch className="mr-2 h-4 w-4 glow-icon" />
            Code Explanation
          </Button>
          <Button
            variant={activeTab === 'code-generation' ? 'secondary' : 'ghost'}
            className="w-full justify-start glow-border slide-in"
            onClick={() => setActiveTab('code-generation')}
            style={{ animationDelay: '400ms' }}
          >
            <Wand2 className="mr-2 h-4 w-4 glow-icon" />
            Code Generation
          </Button>
          <Button
            variant={activeTab === 'code-refactoring' ? 'secondary' : 'ghost'}
            className="w-full justify-start glow-border slide-in"
            onClick={() => setActiveTab('code-refactoring')}
            style={{ animationDelay: '500ms' }}
          >
            <RefreshCcw className="mr-2 h-4 w-4 glow-icon" />
            Code Refactoring
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto bg-background/95 backdrop-blur-sm relative z-10">
        <div className="slide-in" style={{ animationDelay: '600ms' }}>
          {renderActiveComponent()} {/* Render the correct component */}
        </div>
      </div>
    </div>
  );
}