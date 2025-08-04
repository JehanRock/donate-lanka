import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/currency";
import type { FundingBreakdown, ExpenseCategory } from "@/types/project";

interface FundingBreakdownChartProps {
  breakdown: FundingBreakdown;
  totalFunding: number;
  className?: string;
}

const COLORS = [
  '#00A99D', // Primary teal
  '#FF6B6B', // Secondary coral
  '#4ECDC4', // Light teal
  '#FFE66D', // Yellow
  '#95E1D3', // Mint
  '#C7CEEA', // Light purple
];

export const FundingBreakdownChart = ({ 
  breakdown, 
  totalFunding, 
  className 
}: FundingBreakdownChartProps) => {
  const chartData = breakdown.breakdown.map((category, index) => ({
    name: category.name,
    value: category.percentage,
    amount: category.budgetedAmount,
    spent: category.spentAmount,
    color: COLORS[index % COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Budgeted: {formatCurrency(data.amount)}
          </p>
          <p className="text-sm text-muted-foreground">
            Spent: {formatCurrency(data.spent)}
          </p>
          <p className="text-sm font-medium">
            {data.value}% of total budget
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Fund Allocation Transparency
        </CardTitle>
        <CardDescription>
          Detailed breakdown of how your donations are being used
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry: any) => (
                    <span style={{ color: entry.color }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Breakdown */}
          <div className="space-y-4">
            <h4 className="font-medium text-lg">Budget vs. Actual Spending</h4>
            {breakdown.breakdown.map((category, index) => {
              const spentPercentage = category.budgetedAmount > 0 
                ? (category.spentAmount / category.budgetedAmount) * 100 
                : 0;
              
              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium text-sm">{category.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {category.percentage}%
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Budget: {formatCurrency(category.budgetedAmount)}</span>
                      <span>Spent: {formatCurrency(category.spentAmount)}</span>
                    </div>
                    <Progress 
                      value={spentPercentage} 
                      className="h-2"
                      style={{ 
                        background: `${COLORS[index % COLORS.length]}20` 
                      }}
                    />
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Direct Benefits</p>
              <p className="text-lg font-semibold text-primary">
                {breakdown.directBeneficiaries}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Operations</p>
              <p className="text-lg font-semibold">
                {breakdown.operationalCosts}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Admin Fees</p>
              <p className="text-lg font-semibold">
                {breakdown.administrativeFees}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Emergency Fund</p>
              <p className="text-lg font-semibold">
                {breakdown.contingencyFund}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};