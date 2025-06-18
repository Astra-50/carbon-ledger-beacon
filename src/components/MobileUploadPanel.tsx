
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface MobileUploadPanelProps {
  processing: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSampleDownload: () => void;
  onButtonClick: () => void;
}

export default function MobileUploadPanel({
  processing,
  onFileChange,
  onSampleDownload,
  onButtonClick,
}: MobileUploadPanelProps) {
  return (
    <div className="w-full max-w-xl">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 md:p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className="flex flex-col items-center space-y-4">
          <Upload className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
          <div className="space-y-2">
            <h3 className="text-lg md:text-xl font-semibold text-primary">
              Upload CSV File
            </h3>
            <p className="text-sm md:text-base text-muted-foreground px-2">
              Choose a CSV file with your product SKUs and supplier emissions data
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
            <Button
              onClick={onButtonClick}
              disabled={processing}
              className="flex-1 bg-accent hover:bg-accent/80 text-white font-semibold py-3 px-6 text-base"
            >
              {processing ? "Processing..." : "Choose File"}
            </Button>
            <Button
              variant="outline"
              onClick={onSampleDownload}
              className="flex-1 py-3 px-6 text-base font-medium"
            >
              Download Sample
            </Button>
          </div>
        </div>
      </div>
      <input
        type="file"
        accept=".csv"
        onChange={onFileChange}
        className="hidden"
        data-testid="csv-input"
      />
    </div>
  );
}
