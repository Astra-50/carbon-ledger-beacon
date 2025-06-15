
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Violation = {
  reason: string;
  affected: string;
};
type Results = {
  carbonDebt: number;
  totalEmissions: number;
  violations: Violation[];
  estimatedFine: number;
  suggestions: string[];
};

interface AuditResultsProps {
  results: Results | null;
  fileName?: string;
}
const getRiskLevel = (score: number) =>
  score < 60 ? "High" : score < 80 ? "Moderate" : "Low";

const riskColor = (score: number) =>
  score < 60
    ? "bg-destructive text-destructive-foreground"
    : score < 80
    ? "bg-muted text-primary"
    : "bg-accent text-white";

export default function AuditResults({ results, fileName }: AuditResultsProps) {
  if (!results) return null;
  return (
    <Card className="w-full max-w-xl mx-auto mt-2">
      <CardHeader>
        <CardTitle>CSRD Audit Results</CardTitle>
        <div className="text-muted-foreground text-xs">{fileName}</div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-2">
          <span className="font-semibold text-lg">CarbonDebt Score:</span>
          <span className={`text-xl font-bold px-3 py-1 rounded ${riskColor(results.carbonDebt)}`}>
            {results.carbonDebt}/100
          </span>
          <Badge variant="secondary">{getRiskLevel(results.carbonDebt)} Risk</Badge>
        </div>
        <div className="mb-1">
          <span className="font-medium">Total Emissions:</span>{" "}
          {results.totalEmissions.toLocaleString()} kg CO₂e
        </div>
        <div className="mb-1">
          <span className="font-medium">Estimated Fine:</span>{" "}
          <span className="text-destructive font-bold">€{results.estimatedFine.toLocaleString()}</span>
        </div>
        <div className="my-3">
          <span className="font-semibold">Violations found:</span>
          {results.violations.length === 0 ? (
            <span className="ml-2 text-green-600">No critical violations found 🎉</span>
          ) : (
            <ul className="mt-1 list-disc list-inside space-y-1">
              {results.violations.map((v, i) => (
                <li key={i}>
                  <span className="font-mono text-primary">{v.affected}</span>{" "}
                  <span className="text-destructive ml-1">{v.reason}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {results.suggestions.length > 0 && (
          <div className="mt-3">
            <div className="font-semibold">Recommendations:</div>
            <ul className="list-disc list-inside pl-3 text-muted-foreground">
              {results.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
