
import Navbar from "@/components/Navbar";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Share2, Search } from "lucide-react";
import React, { useState, useMemo } from "react";

const MOCK_LEADERBOARD = [
  {
    company: "Futura Apparel",
    industry: "Fashion",
    carbonDebt: 51,
    fines: 81000,
    violations: 6,
    worstIncident: "Supplier emissions not reported",
  },
  {
    company: "Bright Electronics",
    industry: "Electronics",
    carbonDebt: 43,
    fines: 134000,
    violations: 10,
    worstIncident: "Missing traceability on 7 SKUs",
  },
  {
    company: "GlowBeauty",
    industry: "Beauty",
    carbonDebt: 66,
    fines: 36000,
    violations: 4,
    worstIncident: "Zero emissions in multiple SKUs",
  },
  {
    company: "SnaxWorld",
    industry: "Food",
    carbonDebt: 74,
    fines: 15000,
    violations: 2,
    worstIncident: "High emission outlier products",
  },
  {
    company: "Quick Gadgets",
    industry: "Electronics",
    carbonDebt: 37,
    fines: 171000,
    violations: 12,
    worstIncident: "Supplier unknown for 10+ SKUs",
  },
  {
    company: "Eco Textiles",
    industry: "Fashion",
    carbonDebt: 81,
    fines: 11000,
    violations: 1,
    worstIncident: "Non-conformant emissions data",
  },
  {
    company: "Freshify Ltd.",
    industry: "Food",
    carbonDebt: 56,
    fines: 85000,
    violations: 5,
    worstIncident: "Supplier gaps in 3 locations",
  },
  {
    company: "Sunny Living",
    industry: "Home",
    carbonDebt: 89,
    fines: 0,
    violations: 0,
    worstIncident: "—",
  },
];

const INDUSTRIES = [
  "All",
  ...Array.from(new Set(MOCK_LEADERBOARD.map(x => x.industry))),
];

type SortKey = "fines" | "violations" | "carbonDebt" | "company";
type SortDir = "asc" | "desc";

function formatEuro(n: number) {
  return n === 0 ? "—" : "€" + n.toLocaleString();
}

export default function LeaderboardPage() {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("All");
  const [sortBy, setSortBy] = useState<SortKey>("fines");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Filter + sort
  const filtered = useMemo(() => {
    let rows = MOCK_LEADERBOARD;
    if (industry !== "All") rows = rows.filter(r => r.industry === industry);
    if (search) {
      const s = search.toLowerCase();
      rows = rows.filter(
        r =>
          r.company.toLowerCase().includes(s) ||
          r.industry.toLowerCase().includes(s) ||
          ("" + r.carbonDebt).includes(s)
      );
    }
    rows = [...rows].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "company") {
        cmp = a.company.localeCompare(b.company);
      } else {
        cmp = (a[sortBy] as number) - (b[sortBy] as number);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [search, industry, sortBy, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDir(d => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("desc");
    }
  };

  // Handlers for share & export (functions are placeholders)
  const handleExport = () => {
    alert("Exporting leaderboard as CSV (not implemented in MVP).");
  };
  const handleShare = () => {
    // Try Web Share API, fallback to clipboard
    const url = window.location.href;
    if ((navigator as any).share) {
      (navigator as any).share({
        title: "Wall of Death Leaderboard",
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Leaderboard URL copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <section className="w-full max-w-4xl">
          <h1 className="text-2xl font-extrabold tracking-tight text-primary mb-2">
            Wall of Death Leaderboard
          </h1>
          <p className="text-muted-foreground mb-4">
            Public ranking of brands and suppliers with the most CSRD violations, fines, and regulatory risk. For transparency, accountability—and a little bit of dread.
          </p>
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <div className="flex gap-2 flex-1">
              <label className="sr-only" htmlFor="search-leaderboard">Search</label>
              <span className="relative flex-1">
                <input
                  type="text"
                  id="search-leaderboard"
                  placeholder="Search company or industry"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 pl-9 text-base focus-visible:ring-2 outline-none focus-visible:ring-accent bg-white"
                />
                <Search className="absolute left-2 top-2.5 text-muted-foreground w-4 h-4" />
              </span>
              <select
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                className="rounded-md border px-3 py-2 bg-white text-base focus-visible:ring-2 outline-none focus-visible:ring-accent"
              >
                {INDUSTRIES.map(i => (
                  <option value={i} key={i}>{i}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleExport}><Download className="w-4 h-4" /> Export CSV</Button>
              <Button size="sm" variant="outline" onClick={handleShare}><Share2 className="w-4 h-4" /> Share</Button>
            </div>
          </div>
          {/* Table */}
          <div className="overflow-x-auto rounded-md bg-white border shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    onClick={() => handleSort("company")}
                    className="cursor-pointer select-none"
                  >
                    Company {sortBy === "company" && (sortDir === "asc" ? "▲" : "▼")}
                  </TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead
                    onClick={() => handleSort("violations")}
                    className="cursor-pointer select-none text-center"
                  >
                    Violations {sortBy === "violations" && (sortDir === "asc" ? "▲" : "▼")}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("fines")}
                    className="cursor-pointer select-none text-center"
                  >
                    Fines {sortBy === "fines" && (sortDir === "asc" ? "▲" : "▼")}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("carbonDebt")}
                    className="cursor-pointer select-none text-center"
                  >
                    Risk Score {sortBy === "carbonDebt" && (sortDir === "asc" ? "▲" : "▼")}
                  </TableHead>
                  <TableHead>Worst Incident</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-400">
                      No companies match your search or filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((row, i) => (
                    <TableRow key={row.company}>
                      <TableCell className="font-semibold text-primary">{row.company}</TableCell>
                      <TableCell>{row.industry}</TableCell>
                      <TableCell className="text-center font-mono">{row.violations}</TableCell>
                      <TableCell className={"text-center font-mono " + (row.fines > 100000 ? "text-destructive font-bold" : "")}>
                        {formatEuro(row.fines)}
                      </TableCell>
                      <TableCell className={"text-center font-mono " + (row.carbonDebt < 50 ? "text-red-600 font-bold" : row.carbonDebt < 70 ? "text-yellow-700 font-bold" : "text-green-600 font-bold")}>
                        {row.carbonDebt}
                      </TableCell>
                      <TableCell>{row.worstIncident}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="text-sm text-muted-foreground mt-4 flex flex-wrap gap-4 items-center justify-between">
            <div>
              {filtered.length} companies shown
            </div>
            <div>
              Want to see your score?{" "}
              <a href="/upload" className="underline text-accent font-semibold">Audit your data</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
