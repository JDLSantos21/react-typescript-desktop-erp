import { Header } from "@/shared/components/navigation/Header";
import { Sidebar } from "@/shared/components/navigation/Sidebar";
import { NavigationLoader } from "@/shared/components";
import { HeaderProvider } from "@/shared/contexts/HeaderContext";
import { Outlet } from "react-router-dom";
import { GlobalSocketListeners } from "../GlobalSocketListeners";

export function MainLayout() {
  return (
    <HeaderProvider>
      <GlobalSocketListeners />
      <div className="flex h-screen ">
        <NavigationLoader />

        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="overflow-y-auto h-[calc(100vh-81px)]">
            <Outlet />
          </main>
        </div>
      </div>
    </HeaderProvider>
  );
}
