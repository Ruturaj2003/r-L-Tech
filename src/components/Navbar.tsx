import { User } from "lucide-react";
import { DarkModeToggle } from "./DarkModeToggle";

const Navbar = () => {
  return (
    <header className="w-full border-b border-border bg-background">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Leo<span className="text-primary">Tech</span>
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <DarkModeToggle />

          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
            Sign In
          </button>

          <button className="rounded-full border border-border p-2 text-muted-foreground hover:text-foreground transition">
            <User size={18} />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
