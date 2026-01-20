import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { OtherMasterPage } from "@/features/inventory/otherMaster";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* TEMP root redirect (will change later) */}
          <Route
            path="/"
            element={<Navigate to="/inventory/utility/other-master" replace />}
          />

          {/* Inventory - Utility */}
          <Route
            path="/inventory/utility/other-master"
            element={<OtherMasterPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
