import { Header } from "@/shared/components/navigation/Header";
import { Sidebar } from "@/shared/components/navigation/Sidebar";
import { NavigationLoader } from "@/shared/components";
import { HeaderProvider } from "@/shared/contexts/HeaderContext";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <HeaderProvider>
      <div className="flex h-screen ">
        <NavigationLoader />

        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="overflow-y-auto m-3 h-[calc(100vh-96px)]">
            <Outlet />
          </main>
        </div>
      </div>
    </HeaderProvider>
  );
}
