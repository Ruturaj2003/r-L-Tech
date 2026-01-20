import { BrowserRouter, Routes, Route } from "react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { OtherMasterPage } from "@/features/inventory/otherMaster";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<OtherMasterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
