import Navbar from "@/components/Navbar";
import { OtherMasterPage } from "@/features/otherMaster";
import { BrowserRouter, Routes, Route } from "react-router";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home/Default Page */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <OtherMasterPage />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
