
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useRef } from "react";

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Placeholder for future file upload handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: handle CSV upload and parsing
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
          <Button className="bg-accent text-white font-bold px-6 py-3 text-base transition-colors shadow hover:bg-accent/80" onClick={handleButtonClick}>
            Select CSV File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            data-testid="csv-input"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Only .csv files accepted. Example columns: <span className="font-mono text-primary bg-muted px-2 py-0.5 rounded">SKU</span>, <span className="font-mono text-primary bg-muted px-2 py-0.5 rounded">Supplier</span>, <span className="font-mono text-primary bg-muted px-2 py-0.5 rounded">Emissions (kg CO₂e)</span>
          </p>
        </div>
        {/* Placeholder for Audit results/UI */}
        <div className="w-full max-w-xl mt-10">
          <div className="text-center text-gray-400 italic">
            After uploading, your audit results will appear here.
          </div>
        </div>
      </main>
    </div>
  );
}
