import { Outlet } from "react-router";
// shadcn-based
import Navbar from "../Navbar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <h1>Sidebar</h1>

        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
