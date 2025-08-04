import { CheckCircle, Clock, AlertTriangle, Calendar, ImageIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/currency";
import { cn } from "@/lib/utils";
import type { ProjectMilestone } from "@/types/project";

interface ProjectMilestonesProps {
  milestones: ProjectMilestone[];
  className?: string;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    label: "Pending",
  },
  in_progress: {
    icon: Clock,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    label: "In Progress",
  },
  completed: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
    label: "Completed",
  },
  delayed: {
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-100",
    label: "Delayed",
  },
};

export const ProjectMilestones = ({ milestones, className }: ProjectMilestonesProps) => {
  const sortedMilestones = [...milestones].sort((a, b) => 
    new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
  );

  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const progressPercentage = milestones.length > 0 ? (completedMilestones / milestones.length) * 100 : 0;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Project Milestones
        </CardTitle>
        <CardDescription>
          Track project progress and key deliverables
        </CardDescription>
        
        {/* Overall Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedMilestones} of {milestones.length} completed
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {sortedMilestones.map((milestone, index) => {
            const config = statusConfig[milestone.status];
            const Icon = config.icon;
            const isOverdue = milestone.status !== 'completed' && 
              new Date(milestone.targetDate) < new Date();

            return (
              <div key={milestone.id} className="relative">
                {/* Timeline connector */}
                {index < sortedMilestones.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-border" />
                )}

                <div className="flex gap-4">
                  {/* Status Icon */}
                  <div className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
                    config.bgColor
                  )}>
                    <Icon className={cn("w-6 h-6", config.color)} />
                  </div>

                  {/* Milestone Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">
                          {milestone.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {milestone.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={milestone.status === 'completed' ? 'default' : 'secondary'}>
                          {config.label}
                        </Badge>
                        {isOverdue && milestone.status !== 'completed' && (
                          <Badge variant="destructive" className="text-xs">
                            Overdue
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Dates and Funding */}
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Target: {milestone.targetDate.toLocaleDateString()}
                        </span>
                      </div>
                      
                      {milestone.completedDate && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>
                            Completed: {milestone.completedDate.toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      
                      {milestone.fundingRequired > 0 && (
                        <div className="flex items-center gap-1">
                          <span>Funding: {formatCurrency(milestone.fundingRequired)}</span>
                        </div>
                      )}
                    </div>

                    {/* Updates */}
                    {milestone.updates && milestone.updates.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-2">Latest Updates:</p>
                        <div className="space-y-1">
                          {milestone.updates.slice(0, 2).map((update, idx) => (
                            <p key={idx} className="text-sm text-muted-foreground pl-4 border-l-2 border-primary/20">
                              {update}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Evidence/Photos */}
                    {milestone.evidence && milestone.evidence.length > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <ImageIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">Evidence</span>
                        </div>
                        <div className="flex gap-2">
                          {milestone.evidence.slice(0, 3).map((evidence, idx) => (
                            <img
                              key={idx}
                              src={evidence}
                              alt={`Milestone evidence ${idx + 1}`}
                              className="w-16 h-16 object-cover rounded-lg border border-border"
                            />
                          ))}
                          {milestone.evidence.length > 3 && (
                            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                              +{milestone.evidence.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {index < sortedMilestones.length - 1 && (
                  <Separator className="mt-6" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};