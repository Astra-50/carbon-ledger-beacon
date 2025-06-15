
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import AuditResults from "@/components/AuditResults";
import { parseCsv, AuditRow } from "@/utils/parseCsv";

const SAMPLE_CSV = `SKU,Supplier,Emissions (kg CO₂e)
SKU1001,SustainableCo,1800
SKU1002,GreenProduction,1200
SKU1003,FutureFoods,950
SKU1004,SupplierPlus,2100
SKU1005,ZeroWaste,340
`;

function mockAuditEngine(rows: AuditRow[]) {
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

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [results, setResults] = useState<ReturnType<typeof mockAuditEngine> | null>(null);
  const [processing, setProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | undefined>(undefined);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSampleDownload = () => {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setProcessing(true);
    setFileName(file.name);
    setResults(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const parsed = parseCsv(text);
      if ("error" in parsed) {
        toast({
          title: "CSV Error",
          description: parsed.error,
          variant: "destructive",
        });
        setProcessing(false);
        return;
      }
      // Run mock "audit"
      const r = mockAuditEngine(parsed.rows);
      setResults(r);
      toast({
        title: "Audit Complete",
        description: "CSRD audit completed successfully.",
      });
      setProcessing(false);
    };
    reader.onerror = () => {
      toast({
        title: "File Error",
        description: "Failed to read the CSV file.",
        variant: "destructive",
      });
      setProcessing(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-start px-4 py-12">
        <div className="max-w-xl w-full text-center mb-10">
          <h1 className="text-3xl font-extrabold text-primary mb-2">
            Upload your data for instant CSRD audit
          </h1>
          <p className="text-base text-muted-foreground mb-4">
            Upload a CSV file with your product SKUs and supplier emissions. Our engine flags violations and estimates your regulatory risk—no signup required.
          </p>
        </div>
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-md p-8 flex flex-col items-center gap-4">
          <Upload className="text-accent mb-2" size={40} />
          <Button
            className="bg-accent text-white font-bold px-6 py-3 text-base transition-colors shadow hover:bg-accent/80"
            onClick={handleButtonClick}
            disabled={processing}
          >
            {processing ? "Processing..." : "Select CSV File"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            data-testid="csv-input"
            disabled={processing}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleSampleDownload}
            type="button"
            className="w-full mt-2"
          >
            Download Sample CSV
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Only <span className="font-mono">.csv</span> files accepted. Example columns:{" "}
            <span className="font-mono text-primary bg-muted px-2 py-0.5 rounded">SKU</span>,{" "}
            <span className="font-mono text-primary bg-muted px-2 py-0.5 rounded">Supplier</span>,{" "}
            <span className="font-mono text-primary bg-muted px-2 py-0.5 rounded">
              Emissions (kg CO₂e)
            </span>
          </p>
        </div>
        <div className="w-full max-w-xl mt-10 min-h-[80px]">
          {processing ? (
            <div className="text-center text-muted-foreground animate-pulse">Auditing your CSV data...</div>
          ) : (
            <AuditResults results={results} fileName={fileName} />
          )}
          {!processing && !results && (
            <div className="text-center text-gray-400 italic">
              After uploading, your audit results will appear here.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
