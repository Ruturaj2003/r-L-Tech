import { Outlet } from "react-router";
import Navbar from "../Navbar";
import { SidebarContextShell } from "./SidebarContextShell";

export function AppLayout() {
  return (
    <SidebarContextShell>
      <div className="h-screen w-screen overflow-hidden flex flex-col">
        <Navbar />

        <main className="flex-1 overflow-hidden bg-muted/10 p-4 md:p-6 md:pt-2 md:pb-2">
          <div className="h-full w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarContextShell>
  );
}
