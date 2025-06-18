
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/upload", label: "Upload & Audit" },
  { to: "/violations", label: "Violation Summary" },
  { to: "/leaderboard", label: "Wall of Death" },
  { to: "/badge", label: "Badge Generator" },
];

export default function MobileNavbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="w-full border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="container flex items-center justify-between h-16 px-4">
        <Link 
          to="/" 
          className="text-xl md:text-2xl font-bold tracking-tight text-primary hover:text-accent transition-colors"
        >
          Carbon<span className="text-accent">Ledger</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-2">
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

        {/* Mobile Navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[350px]">
            <div className="flex flex-col space-y-4 mt-8">
              <div className="text-lg font-bold text-primary mb-4">
                Carbon<span className="text-accent">Ledger</span>
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-lg font-medium transition-colors text-base",
                    location.pathname === link.to
                      ? "bg-accent/10 text-accent"
                      : "hover:bg-gray-100 text-primary"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
