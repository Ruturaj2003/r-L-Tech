import { Outlet } from "react-router";
import Navbar from "../Navbar";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export function AppLayout() {
  return (
    <SidebarProvider>
      {/* Sidebar stays fixed to the left */}
      <AppSidebar />

      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        {/* Navbar is sticky inside the inset */}
        <Navbar />

        {/* Main content area scrolls independently */}
        <main className="flex-1 overflow-y-clip overflow-x-hidden p-4 md:p-6 md:pt-2 md:pb-2 bg-muted/10">
          <div className="mx-auto w-full max-w-full ">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
