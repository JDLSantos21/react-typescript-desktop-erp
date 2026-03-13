import { Header } from "@/shared/components/navigation/Header";
import { Sidebar } from "@/shared/components/navigation/Sidebar";
import { NavigationLoader } from "@/shared/components/NavigationLoader";
import { HeaderProvider } from "@/shared/contexts/HeaderContext";
import { Outlet } from "react-router-dom";
import { GlobalSocketListeners } from "../GlobalSocketListeners";
import { Toaster } from "sileo";

export function MainLayout() {
  return (
    <HeaderProvider>
      <GlobalSocketListeners />
      <Toaster
        position="bottom-center"
        options={{
          fill: "#FFFFFF", // Modo Claro (Blanco)
          roundness: 12, // Bordes un poco más definidos
          styles: {
            title: "text-gray-900! font-semibold! text-sm!",
            description: "text-gray-500! text-sm!",
            badge: "bg-gray-100! text-gray-900!",
          },
        }}
      />
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
