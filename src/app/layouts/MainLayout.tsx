import { Header } from "@/shared/components/navigation/Header";
import { Sidebar } from "@/shared/components/navigation/Sidebar";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <div className="flex flex-col h-screen ">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
