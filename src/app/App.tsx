import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { queryClient } from "@/shared/lib/query-client";
import { SocketProvider } from "@/shared/contexts/SocketContext";
import { router } from "./Router";
import "@/styles/globals.css";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors />
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <RouterProvider router={router} />
        </SocketProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
