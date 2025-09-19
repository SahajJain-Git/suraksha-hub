import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import VirtualDrills from "./pages/VirtualDrills";
import FirstAid from "./pages/FirstAid";
import Quiz from "./pages/Quiz";
import ComprehensiveModules from "./pages/ComprehensiveModules";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/student-auth" element={<Auth />} />
            <Route path="/teacher-auth" element={<Auth />} />
            <Route path="/virtual-drills" element={<VirtualDrills />} />
            <Route path="/first-aid" element={<FirstAid />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/comprehensive-modules" element={<ComprehensiveModules />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
