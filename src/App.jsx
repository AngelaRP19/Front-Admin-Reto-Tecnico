import { Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import RequireAdminAuth from "./components/common/RequireAdminAuth";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import CommunityPage from "./features/community/pages/CommunityPage";
import NotifyExpansionPage from "./features/notify/pages/NotifyExpansionPage";
import LoginPage from "./features/auth/pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route
        element={
          <RequireAdminAuth>
            <MainLayout />
          </RequireAdminAuth>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/comunidad" element={<CommunityPage />} />
        <Route path="/notificar-expansion" element={<NotifyExpansionPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
