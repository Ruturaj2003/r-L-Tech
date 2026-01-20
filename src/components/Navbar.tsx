import { User } from "lucide-react";
import { DarkModeToggle } from "./DarkModeToggle";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex w-full items-center justify-between px-4">
        {/* Left Side: Trigger & Brand */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-foreground">
              Leo<span className="text-primary">Tech</span>
            </span>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3">
          <DarkModeToggle />

          <div className="hidden sm:flex items-center gap-3">
            <button className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
              Sign In
            </button>
          </div>

          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
            <User size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
