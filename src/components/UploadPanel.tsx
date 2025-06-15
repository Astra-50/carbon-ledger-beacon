
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import React, { useRef } from "react";

interface UploadPanelProps {
  processing: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSampleDownload: () => void;
  onButtonClick: () => void;
}

const UploadPanel: React.FC<UploadPanelProps> = ({
  processing,
  onFileChange,
  onSampleDownload,
  onButtonClick,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (processing) {
      // Optionally blur input while processing
      inputRef.current?.blur();
    }
  }, [processing]);

  return (
    <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-md p-8 flex flex-col items-center gap-4">
      <Upload className="text-accent mb-2" size={40} />
      <Button
        className="bg-accent text-white font-bold px-6 py-3 text-base transition-colors shadow hover:bg-accent/80"
        onClick={onButtonClick}
        disabled={processing}
        type="button"
      >
        {processing ? "Processing..." : "Select CSV File"}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={onFileChange}
        className="hidden"
        data-testid="csv-input"
        disabled={processing}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={onSampleDownload}
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
  );
};

export default UploadPanel;
