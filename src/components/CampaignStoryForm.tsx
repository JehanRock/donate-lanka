import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link, 
  Quote,
  Undo,
  Redo,
  Type,
  AlignLeft,
  AlignCenter,
  Youtube
} from "lucide-react";
import { CampaignData } from "./CampaignCreationWizard";

interface CampaignStoryFormProps {
  data: CampaignData;
  onUpdate: (updates: Partial<CampaignData>) => void;
}

export const CampaignStoryForm = ({ data, onUpdate }: CampaignStoryFormProps) => {
  const [isUrlValid, setIsUrlValid] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (editorRef.current && data.description) {
      editorRef.current.innerHTML = data.description;
    }
  }, []);

  const validateVideoUrl = (url: string) => {
    if (!url) {
      setIsUrlValid(true);
      return;
    }
    
    // Simple validation for YouTube, Vimeo, or direct video links
    const videoUrlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com|.*\.(mp4|webm|ogg)).*$/i;
    setIsUrlValid(videoUrlPattern.test(url));
  };

  const handleVideoUrlChange = (url: string) => {
    validateVideoUrl(url);
    onUpdate({ videoUrl: url });
  };

  const executeCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onUpdate({ description: content });
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
    { icon: Link, action: insertLink, title: 'Insert Link' },
    { icon: Quote, command: 'formatBlock', value: 'blockquote', title: 'Quote' },
    { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
  ];

  const getPlainTextLength = () => {
    if (editorRef.current) {
      return editorRef.current.textContent?.length || 0;
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* Rich Text Editor */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Project Description *
        </Label>
        
        {/* Toolbar */}
        <Card className="p-2">
          <div className="flex items-center gap-1 flex-wrap">
            {toolbarButtons.map((button, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (button.action) {
                    button.action();
                  } else {
                    executeCommand(button.command, button.value);
                  }
                }}
                className="h-8 w-8 p-0"
                title={button.title}
              >
                <button.icon className="w-4 h-4" />
              </Button>
            ))}
            
            <Separator orientation="vertical" className="h-6 mx-1" />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => executeCommand('undo')}
              className="h-8 w-8 p-0"
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => executeCommand('redo')}
              className="h-8 w-8 p-0"
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Editor */}
        <div className="border rounded-lg">
          <div
            ref={editorRef}
            contentEditable
            onInput={updateContent}
            onBlur={updateContent}
            className="min-h-[300px] p-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
            style={{ 
              fontSize: '14px',
              lineHeight: '1.6'
            }}
            data-placeholder="Tell your story... What inspired this project? What problem are you solving? How will the funds be used?"
          />
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {getPlainTextLength() < 100 
              ? `Need at least ${100 - getPlainTextLength()} more characters`
              : `${getPlainTextLength()} characters`
            }
          </span>
          <span>Minimum 100 characters required</span>
        </div>
      </div>

      {/* Video URL */}
      <div className="space-y-2">
        <Label htmlFor="videoUrl" className="text-sm font-medium">
          Project Video (Optional)
        </Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              id="videoUrl"
              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
              value={data.videoUrl || ''}
              onChange={(e) => handleVideoUrlChange(e.target.value)}
              className={!isUrlValid ? 'border-destructive' : ''}
            />
            {!isUrlValid && (
              <p className="text-sm text-destructive mt-1">
                Please enter a valid video URL (YouTube, Vimeo, or direct video link)
              </p>
            )}
          </div>
          <Button variant="outline" size="icon" disabled>
            <Youtube className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Add a video to increase engagement. Campaigns with videos are 3x more likely to succeed.
        </p>
      </div>

      {/* Story Guidelines */}
      <Card className="p-4 bg-muted/50">
        <h3 className="text-sm font-medium mb-3">📝 Writing Tips</h3>
        <div className="grid md:grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div>
            <h4 className="font-medium text-foreground mb-2">What to Include:</h4>
            <ul className="space-y-1">
              <li>• The problem you're solving</li>
              <li>• Your personal connection to the project</li>
              <li>• How funds will be used</li>
              <li>• Timeline and milestones</li>
              <li>• What supporters will get</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">Best Practices:</h4>
            <ul className="space-y-1">
              <li>• Be authentic and personal</li>
              <li>• Use clear, simple language</li>
              <li>• Include specific details and numbers</li>
              <li>• Break up text with formatting</li>
              <li>• Tell a compelling story</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Preview */}
      {data.description && getPlainTextLength() > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-3">Preview</h3>
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
        </Card>
      )}
    </div>
  );
};