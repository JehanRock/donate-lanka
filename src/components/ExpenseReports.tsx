import { FileText, Download, Eye, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/currency";
import { cn } from "@/lib/utils";
import type { ExpenseReport, ExpenseCategory } from "@/types/project";

interface ExpenseReportsProps {
  reports: ExpenseReport[];
  currentPeriodSpending?: ExpenseCategory[];
  className?: string;
}

export const ExpenseReports = ({ 
  reports, 
  currentPeriodSpending = [], 
  className 
}: ExpenseReportsProps) => {
  const sortedReports = [...reports].sort((a, b) => 
    new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime()
  );

  const latestReport = sortedReports[0];
  const totalAudited = reports.filter(r => r.auditedBy).length;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Financial Transparency Reports
        </CardTitle>
        <CardDescription>
          Detailed expense reports and financial auditing
        </CardDescription>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Reports</p>
            <p className="text-lg font-semibold">{reports.length}</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Audited Reports</p>
            <p className="text-lg font-semibold text-green-600">
              {totalAudited}
            </p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Latest Period</p>
            <p className="text-lg font-semibold">
              {latestReport ? formatCurrency(latestReport.totalSpent) : "N/A"}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Current Period Spending */}
        {currentPeriodSpending.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Current Period Spending</h4>
            <div className="space-y-3">
              {currentPeriodSpending.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(category.spentAmount)}</p>
                    <p className="text-sm text-muted-foreground">
                      of {formatCurrency(category.budgetedAmount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="mt-6" />
          </div>
        )}

        {/* Historical Reports */}
        <div className="space-y-4">
          <h4 className="font-semibold">Historical Reports</h4>
          
          {sortedReports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No expense reports available yet</p>
              <p className="text-sm">Reports will be published monthly</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedReports.map((report) => (
                <div key={report.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-medium">
                          Financial Report - {report.reportDate.toLocaleDateString()}
                        </h5>
                        {report.auditedBy && (
                          <Badge variant="default" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Audited
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Period: {report.periodStart.toLocaleDateString()} - {report.periodEnd.toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          Total Spent: <span className="font-medium text-foreground">{formatCurrency(report.totalSpent)}</span>
                        </div>
                        {report.auditedBy && (
                          <div>
                            Audited by: <span className="font-medium text-foreground">{report.auditedBy}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {report.summary}
                      </p>

                      {/* Category Breakdown */}
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-2">Expense Categories:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {report.categories.slice(0, 4).map((category) => (
                            <div key={category.id} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{category.name}:</span>
                              <span className="font-medium">{formatCurrency(category.spentAmount)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                      {report.reportUrl && (
                        <Button variant="outline" size="sm" className="text-xs">
                          <Download className="w-3 h-3 mr-1" />
                          Download PDF
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trust Note */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-800">Financial Transparency Commitment</p>
              <p className="text-blue-700 mt-1">
                All expense reports are independently audited and published monthly. 
                We maintain complete transparency about how donations are used to maximize impact.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};