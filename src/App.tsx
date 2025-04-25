
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CourseView from "./pages/CourseView";
import AssessmentView from "./pages/AssessmentView";
import AdminDashboard from "./pages/admin/Dashboard";
import ContentManager from "./pages/admin/ContentManager";
import QuestionGenerator from "./pages/admin/QuestionGenerator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Dashboard />} />
          <Route path="/courses/:courseId" element={<CourseView />} />
          <Route path="/courses/:courseId/modules/:moduleId" element={<CourseView />} />
          <Route path="/courses/:courseId/modules/:moduleId/content/:contentId" element={<CourseView />} />
          <Route path="/courses/:courseId/modules/:moduleId/assessments/:assessmentId" element={<CourseView />} />
          <Route path="/assessments" element={<AssessmentView />} />
          <Route path="/assessments/:assessmentId" element={<AssessmentView />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/content-manager" element={<ContentManager />} />
          <Route path="/admin/question-generator" element={<QuestionGenerator />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
