
import React, { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function getColor(score: number) {
  if (score >= 80) return "#22c55e";
  if (score >= 50) return "#eab308";
  return "#ef4444";
}

function getLabel(score: number) {
  if (score >= 80) return "Excellent";
  if (score >= 50) return "Fair";
  return "High Risk";
}

const BADGE_STYLES = [
  { key: "default", label: "Rounded", borderRadius: "999px" },
  { key: "square", label: "Square", borderRadius: "8px" },
];

export default function BadgePage() {
  const [company, setCompany] = useState("");
  const [score, setScore] = useState(75);
  const [style, setStyle] = useState(BADGE_STYLES[0].key);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const color = getColor(score);
  const label = getLabel(score);
  const borderRadius =
    BADGE_STYLES.find((s) => s.key === style)?.borderRadius || "999px";

  const badgeSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="260" height="64">
    <g>
    <rect width="260" height="64" fill="#fff" rx="${borderRadius}" />
    <rect x="3" y="3" width="254" height="58" fill="${color}" rx="${borderRadius}" />
    <text x="130" y="32" alignment-baseline="central" text-anchor="middle" font-family="Inter, sans-serif" font-size="22" font-weight="700" fill="#fff" dy=".35em">${company || "Your Company"}</text>
    <rect x="165" y="12" width="80" height="40" rx="20" fill="#fff" />
    <text x="205" y="34" alignment-baseline="central" text-anchor="middle" font-family="Inter, sans-serif" font-size="18" font-weight="bold" fill="${color}" dy=".35em">${score}</text>
    </g>
  </svg>
  `.trim();

  const embedCode = `<img src="data:image/svg+xml;utf8,${encodeURIComponent(
    badgeSvg
  )}" alt="${company} CSRD Score Badge" />`;

  function copyEmbed() {
    navigator.clipboard.writeText(embedCode);
  }
  function downloadSVG() {
    const blob = new Blob([badgeSvg], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${company || "badge"}.svg`;
    a.click();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center px-4 py-6 md:py-10">
        <section className="w-full max-w-xl">
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-primary mb-2">
            Compliance Badge Generator
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mb-4">
            Instantly generate a compliance badge for your company based on your latest CarbonLedger score.
          </p>
          <form
            className="space-y-4 bg-white rounded-md border shadow p-4 md:p-6"
            onSubmit={e => e.preventDefault()}
          >
            <div>
              <Label htmlFor="company" className="text-sm font-medium">Company name</Label>
              <Input
                id="company"
                value={company}
                placeholder="Enter name"
                onChange={e => setCompany(e.target.value)}
                className="mt-1 h-12"
              />
            </div>
            <div>
              <Label htmlFor="score" className="text-sm font-medium">CarbonDebt Score</Label>
              <input
                id="score"
                type="number"
                min={0}
                max={100}
                value={score}
                onChange={e =>
                  setScore(Math.max(0, Math.min(100, Number(e.target.value))))
                }
                step={1}
                className="mt-1 w-full rounded-md border px-3 py-3 text-base bg-white h-12"
              />
              <div className="flex items-center gap-2 mt-2">
                <div
                  className="h-2 w-28 rounded"
                  style={{ background: color }}
                ></div>
                <span className="text-xs text-muted-foreground">
                  {label}
                </span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Badge style</Label>
              <div className="flex gap-2 mt-1">
                {BADGE_STYLES.map((s) => (
                  <Button
                    type="button"
                    key={s.key}
                    size="sm"
                    variant={style === s.key ? "default" : "outline"}
                    onClick={() => setStyle(s.key)}
                    className="flex-1 py-2"
                  >
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Badge preview</Label>
              <div className="bg-gray-50 p-4 rounded-md flex flex-col items-center border mt-2">
                <div
                  dangerouslySetInnerHTML={{ __html: badgeSvg }}
                  aria-label="Badge preview"
                  className="w-full max-w-[260px] h-16"
                  ref={svgRef as any}
                />
                <div className="text-xs text-muted-foreground mt-2">
                  Style: {label} ({score}/100)
                </div>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Export & Embed</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                <Button size="sm" onClick={downloadSVG} type="button" className="py-3">
                  Download SVG
                </Button>
                <Button
                  size="sm"
                  type="button"
                  onClick={() => {
                    alert("PNG download is coming soon!");
                  }}
                  variant="outline"
                  className="py-3"
                >
                  Download PNG
                </Button>
                <Button
                  size="sm"
                  type="button"
                  onClick={copyEmbed}
                  variant="secondary"
                  className="py-3"
                >
                  Copy embed code
                </Button>
              </div>
              <Textarea
                className="mt-2 text-xs bg-gray-100"
                rows={3}
                readOnly
                value={embedCode}
                onFocus={e => e.currentTarget.select()}
              />
            </div>
          </form>
          <div className="text-sm text-muted-foreground mt-6">
            Want a badge with your real audit result? <a href="/upload" className="underline text-accent font-semibold">Audit your data first</a>.
          </div>
        </section>
      </main>
    </div>
  );
}
