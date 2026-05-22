import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProfileProvider } from "@/contexts/ProfileContext";
import CloudPaste from "./pages/CloudPaste";
import BusinessCardGallery from "./pages/BusinessCardGallery";
import CardDesigner from "./pages/CardDesigner";
import TemplateSelection from "./pages/TemplateSelection";
import LockedDesigner from "./pages/LockedDesigner";
import CorporateSetup from "./pages/CorporateSetup";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const routerBasename = import.meta.env.BASE_URL === "/" ? undefined : import.meta.env.BASE_URL;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ProfileProvider>
        <BrowserRouter basename={routerBasename}>
          <Routes>
            <Route path="/" element={<BusinessCardGallery />} />
            <Route path="/share" element={<CloudPaste />} />
            <Route path="/designer/new" element={<TemplateSelection />} />
            <Route path="/designer" element={<CardDesigner />} />
            <Route path="/designer/locked" element={<LockedDesigner />} />
            <Route path="/corporate/setup" element={<CorporateSetup />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ProfileProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;