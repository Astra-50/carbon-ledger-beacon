import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/upload", label: "Upload & Audit" },
  { to: "/violations", label: "Violation Summary" },
  { to: "/leaderboard", label: "Wall of Death" },
  { to: "/badge", label: "Badge Generator" },
];

export default function Navbar() {
  const location = useLocation();
  return (
    <nav className="w-full border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="text-2xl font-bold tracking-tight text-primary hover:text-accent transition-colors">
          Carbon<span className="text-accent">Ledger</span>
        </Link>
        <div className="flex gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "px-3 py-2 rounded-md font-semibold transition-colors text-sm",
                location.pathname === link.to
                  ? "bg-accent/10 text-accent"
                  : "hover:bg-gray-100 text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
