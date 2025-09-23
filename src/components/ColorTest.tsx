import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Moon } from "lucide-react";

export const ColorTest = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 p-4">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm">
            Color Test Panel
            <Button
              size="sm"
              variant="outline"
              onClick={toggleTheme}
              className="w-8 h-8 p-0"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Color Swatches */}
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="text-center">
              <div className="w-full h-8 bg-primary rounded mb-1"></div>
              <span>Primary</span>
            </div>
            <div className="text-center">
              <div className="w-full h-8 bg-secondary rounded mb-1"></div>
              <span>Secondary</span>
            </div>
            <div className="text-center">
              <div className="w-full h-8 bg-success rounded mb-1"></div>
              <span>Success</span>
            </div>
            <div className="text-center">
              <div className="w-full h-8 bg-warning rounded mb-1"></div>
              <span>Warning</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <Button className="w-full text-xs">Primary Button</Button>
            <Button variant="secondary" className="w-full text-xs">Secondary Button</Button>
            <Button variant="outline" className="w-full text-xs">Outline Button</Button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <span className="text-xs">Progress Test:</span>
            <Progress value={65} className="h-2" />
          </div>

          {/* Text Gradient */}
          <div className="text-center">
            <span className="bg-gradient-text text-sm font-semibold">
              Sri Lankan Communities
            </span>
          </div>

          {/* Contrast Test */}
          <div className="space-y-1 text-xs">
            <div className="bg-background text-foreground p-2 rounded border">
              Normal text contrast
            </div>
            <div className="bg-primary text-primary-foreground p-2 rounded">
              Primary contrast
            </div>
            <div className="bg-secondary text-secondary-foreground p-2 rounded">
              Secondary contrast
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};