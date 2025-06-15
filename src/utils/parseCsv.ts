
/**
 * Parses a CSV string into objects, validating required columns.
 * Returns { error: string } on failure, or { rows } on success.
 *
 * Expected headers: SKU, Supplier, Emissions (kg CO₂e)
 */
export type AuditRow = {
  SKU: string;
  Supplier: string;
  Emissions: number;
};
export type ParseCsvResult =
  | { error: string }
  | { rows: AuditRow[] };

export function parseCsv(csvString: string): ParseCsvResult {
  const lines = csvString.trim().split("\n");
  if (lines.length < 2) {
    return { error: "CSV must have a header and at least one data row." };
  }
  const headerLine = lines[0];
  const headers = headerLine.split(",").map(h => h.trim().replace(/['"]+/g, ''));
  // Allow various case/space variants of spec headers
  const skuIdx = headers.findIndex(
    h => h.toLowerCase() === "sku"
  );
  const supIdx = headers.findIndex(
    h => h.toLowerCase() === "supplier"
  );
  const emIdx = headers.findIndex(
    h => h.toLowerCase().startsWith("emissions")
  );
  if (skuIdx < 0 || supIdx < 0 || emIdx < 0) {
    return {
      error: "Missing required columns: SKU, Supplier, Emissions (kg CO₂e)"
    };
  }
  const rows: AuditRow[] = [];
  for (let i = 1; i < lines.length; ++i) {
    if (!lines[i].trim()) continue; // skip empty lines
    const cols = lines[i].split(",").map(c => c.trim());
    if (cols.length < Math.max(skuIdx, supIdx, emIdx) + 1) continue;
    const emissions = parseFloat(cols[emIdx]);
    if (isNaN(emissions)) {
      return { error: `Row ${i+1}: Invalid emission value: '${cols[emIdx]}'` };
    }
    rows.push({
      SKU: cols[skuIdx],
      Supplier: cols[supIdx],
      Emissions: emissions,
    });
  }
  if (rows.length === 0) return { error: "CSV contains no valid data rows." };
  return { rows };
}
