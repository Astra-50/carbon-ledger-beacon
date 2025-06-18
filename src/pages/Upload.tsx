
import Navbar from "@/components/Navbar";
import { useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import AuditResults from "@/components/AuditResults";
import { parseCsv } from "@/utils/parseCsv";
import MobileUploadPanel from "@/components/MobileUploadPanel";
import { mockAuditEngine } from "@/utils/mockAuditEngine";

const SAMPLE_CSV = `SKU,Supplier,Emissions (kg CO₂e)
SKU1001,SustainableCo,1800
SKU1002,GreenProduction,1200
SKU1003,FutureFoods,950
SKU1004,SupplierPlus,2100
SKU1005,ZeroWaste,340
`;

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [results, setResults] = useState<ReturnType<typeof mockAuditEngine> | null>(null);
  const [processing, setProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [fileInputKey, setFileInputKey] = useState<number>(0);

  const handleButtonClick = () => {
    document.querySelector<HTMLInputElement>('input[type="file"][data-testid="csv-input"]')?.click();
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
    setFileInputKey(k => k + 1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-start px-4 py-8 md:py-12">
        <div className="max-w-xl w-full text-center mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-2">
            Upload your data for instant CSRD audit
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mb-4 px-2">
            Upload a CSV file with your product SKUs and supplier emissions. Our engine flags violations and estimates your regulatory risk—no signup required.
          </p>
        </div>
        <MobileUploadPanel
          processing={processing}
          onFileChange={handleFileChange}
          onSampleDownload={handleSampleDownload}
          onButtonClick={handleButtonClick}
        />
        <div className="w-full max-w-xl mt-8 md:mt-10 min-h-[80px]">
          {processing ? (
            <div className="text-center text-muted-foreground animate-pulse">Auditing your CSV data...</div>
          ) : (
            <AuditResults results={results} fileName={fileName} />
          )}
          {!processing && !results && (
            <div className="text-center text-gray-400 italic text-sm">
              After uploading, your audit results will appear here.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
