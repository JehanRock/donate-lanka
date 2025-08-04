import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import ProjectsDiscovery from "./pages/ProjectsDiscovery";
import ProjectDetails from "./pages/ProjectDetails";
import CreateCampaign from "./pages/CreateCampaign";
import UserProfile from "./pages/UserProfile";
import ImpactReport from "./pages/ImpactReport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-16 lg:pt-20">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/projects" element={<ProjectsDiscovery />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/create" element={<CreateCampaign />} />
                <Route path="/users/:userId" element={<UserProfile />} />
                <Route path="/impact-report" element={<ImpactReport />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
