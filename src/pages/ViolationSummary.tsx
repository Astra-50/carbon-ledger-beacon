
import Navbar from "@/components/Navbar";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const mockViolations = [
  {
    sku: "SKU1004",
    supplier: "SupplierPlus",
    category: "High Emissions",
    reason: "Emissions value exceeded 2000 kg CO₂e",
    severity: "High",
  },
  {
    sku: "SKU1003",
    supplier: "",
    category: "Missing Supplier",
    reason: "Supplier name is missing",
    severity: "Moderate",
  },
  {
    sku: "SKU1280",
    supplier: "EcoWorld",
    category: "Zero Emissions",
    reason: "Reported emissions is 0 (likely a data error)",
    severity: "Low",
  },
];

export default function ViolationSummary() {
  const handleExport = () => {
    alert("Exporting violation report...");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center px-4 py-6 md:py-10">
        <div className="w-full max-w-4xl">
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-primary mb-2">
            Violation Summary Report
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mb-4">
            Review details about CSRD rule violations detected in your latest audit. Export this report to share with your compliance or sustainability team.
          </p>
          <Button 
            className="mb-4 flex items-center gap-2 w-full sm:w-auto" 
            onClick={handleExport}
          >
            <Download className="w-4 h-4" /> Export Report (CSV)
          </Button>
          <div className="overflow-x-auto rounded-md bg-white border shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[80px]">SKU</TableHead>
                  <TableHead className="min-w-[100px]">Supplier</TableHead>
                  <TableHead className="min-w-[120px]">Category</TableHead>
                  <TableHead className="min-w-[200px]">Description</TableHead>
                  <TableHead className="min-w-[80px]">Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockViolations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                      No violations found 🎉
                    </TableCell>
                  </TableRow>
                ) : (
                  mockViolations.map((v, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{v.sku}</TableCell>
                      <TableCell>
                        {v.supplier || (
                          <span className="italic text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>{v.category}</TableCell>
                      <TableCell className="text-sm">{v.reason}</TableCell>
                      <TableCell>
                        <span
                          className={
                            v.severity === "High"
                              ? "text-red-600 font-semibold"
                              : v.severity === "Moderate"
                              ? "text-yellow-600 font-semibold"
                              : "text-green-600 font-semibold"
                          }
                        >
                          {v.severity}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
