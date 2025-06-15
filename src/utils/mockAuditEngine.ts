
import type { AuditRow } from "@/utils/parseCsv";

export function mockAuditEngine(rows: AuditRow[]) {
  let totalEmissions = 0;
  let missingSuppliers = 0;
  let highEmissions = 0;
  let zeroEmissions = 0;
  let violations: { reason: string; affected: string }[] = [];
  rows.forEach((row) => {
    totalEmissions += row.Emissions;
    if (!row.Supplier) {
      missingSuppliers += 1;
      violations.push({
        reason: "Missing supplier name",
        affected: row.SKU,
      });
    }
    if (row.Emissions === 0) {
      zeroEmissions += 1;
      violations.push({
        reason: "Zero emissions is non-compliant",
        affected: row.SKU,
      });
    }
    if (row.Emissions > 2000) {
      highEmissions += 1;
      violations.push({
        reason: "High emissions (>2000 kg)",
        affected: row.SKU,
      });
    }
  });
  // Compute a simple CarbonDebt Score (out of 100)
  let score = 100 - missingSuppliers * 5 - highEmissions * 5 - zeroEmissions * 3;
  score -= Math.floor(totalEmissions / 5000) * 7;
  score = Math.max(30, Math.min(100, score));

  // Estimate fines: €2000 per violation, plus flat €1500 if > 10k kg total
  let estimatedFine = violations.length * 2000 + (totalEmissions > 10000 ? 1500 : 0);

  return {
    carbonDebt: score,
    totalEmissions: Math.round(totalEmissions),
    violations,
    estimatedFine,
    suggestions: [
      ...(missingSuppliers > 0
        ? ["Add all missing suppliers for better compliance."]
        : []),
      ...(highEmissions > 0
        ? ["Investigate products with high emissions."]
        : []),
      ...(zeroEmissions > 0
        ? ["Review entries reporting zero emissions; ensure data accuracy."]
        : []),
      ...(violations.length === 0
        ? ["Great work! No critical issues. Stay compliant!"]
        : []),
    ],
  };
}
