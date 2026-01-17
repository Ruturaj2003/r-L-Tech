import { OtherMasterPage } from "@/features/otherMaster";
import { BrowserRouter, Routes, Route } from "react-router";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home/Default Page */}
        <Route path="/" element={<OtherMasterPage />} />
      </Routes>
    </BrowserRouter>
  );
}
