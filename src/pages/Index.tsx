
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const STATS = [
  {
    label: "Avg. CSRD Penalty",
    stat: "€120,000",
    note: "per non-compliance"
  },
  {
    label: "Amazon Violation Rate",
    stat: "72%",
    note: "of flagged listings"
  },
  {
    label: "Brands Fined in 2024",
    stat: "134+",
    note: "record global cases"
  },
];

const CASE_STUDIES = [
  {
    name: "Fashion Brand X",
    fine: "€400,000",
    summary: "Under-reported Scope 3. Amazon de-listed SKUs in 48h.",
  },
  {
    name: "Beauty Co.",
    fine: "€110,000",
    summary: "Missed supplier emissions—CSRD fine and EU import ban.",
  },
  {
    name: "Electrinics Z",
    fine: "€92,000",
    summary: "Failed supplier traceability led to audit loss.",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-6 md:py-8">
        <div className="w-full max-w-2xl text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 leading-tight">
            Stay Ahead of CSRD Enforcement.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-6 px-2">
            Upload your product and supplier data to get your <span className="text-accent font-semibold underline">CarbonDebt Score</span>.
            Don't let regulatory risk catch your brand off guard.
          </p>
          <Link to="/upload">
            <Button size="lg" className="text-base px-6 md:px-8 py-3 bg-accent text-white font-bold shadow-lg hover:bg-accent/80 transition-colors w-full sm:w-auto">
              Upload Data & Run Audit
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {STATS.map(({ label, stat, note }) => (
            <div
              key={label}
              className="bg-gray-100 border border-gray-200 rounded-lg p-4 md:p-6 flex flex-col items-center shadow-sm"
            >
              <div className="text-xl md:text-2xl font-bold text-primary mb-2">{stat}</div>
              <div className="text-sm md:text-base font-medium text-muted-foreground text-center">{label}</div>
              <div className="text-xs text-gray-400 mt-1">{note}</div>
            </div>
          ))}
        </div>

        {/* Case Studies */}
        <section className="w-full max-w-3xl mb-8 md:mb-16">
          <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span className="font-semibold text-lg text-primary">Recent Case Studies</span>
            <Link
              to="/leaderboard"
              className="text-accent font-medium hover:underline text-sm"
            >
              See Wall of Death Leaderboard →
            </Link>
          </div>
          <div className="space-y-3">
            {CASE_STUDIES.map((study) => (
              <div
                key={study.name}
                className="rounded-lg border bg-card/50 p-4 flex flex-col gap-2 hover:bg-gray-50 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span className="font-medium text-primary">
                    {study.name}
                  </span>
                  <span className="text-destructive text-base font-bold">
                    {study.fine}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">{study.summary}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Links to Features */}
        <div className="flex flex-col gap-3 w-full max-w-2xl">
          <Link to="/violations" className="w-full">
            <Button variant="outline" className="w-full font-semibold py-3">
              View Example Audit Report
            </Button>
          </Link>
          <Link to="/leaderboard" className="w-full">
            <Button variant="outline" className="w-full font-semibold py-3">
              See Violations Leaderboard
            </Button>
          </Link>
          <Link to="/badge" className="w-full">
            <Button variant="outline" className="w-full font-semibold py-3">
              Generate Compliance Badge
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
