
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CourseView from "./pages/CourseView";
import AssessmentView from "./pages/AssessmentView";
import AdminDashboard from "./pages/admin/Dashboard";
import ContentManager from "./pages/admin/ContentManager";
import QuestionGenerator from "./pages/admin/QuestionGenerator";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ 
  children, 
  requireAdmin = false 
}: { 
  children: React.ReactNode;
  requireAdmin?: boolean;
}) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
  // Show loading indicator while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/dashboard" element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } />
    <Route path="/courses" element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } />
    <Route path="/courses/:courseId" element={
      <ProtectedRoute>
        <CourseView />
      </ProtectedRoute>
    } />
    <Route path="/courses/:courseId/modules/:moduleId" element={
      <ProtectedRoute>
        <CourseView />
      </ProtectedRoute>
    } />
    <Route path="/courses/:courseId/modules/:moduleId/content/:contentId" element={
      <ProtectedRoute>
        <CourseView />
      </ProtectedRoute>
    } />
    <Route path="/courses/:courseId/modules/:moduleId/assessments/:assessmentId" element={
      <ProtectedRoute>
        <CourseView />
      </ProtectedRoute>
    } />
    <Route path="/assessments" element={
      <ProtectedRoute>
        <AssessmentView />
      </ProtectedRoute>
    } />
    <Route path="/assessments/:assessmentId" element={
      <ProtectedRoute>
        <AssessmentView />
      </ProtectedRoute>
    } />
    <Route path="/admin/dashboard" element={
      <ProtectedRoute requireAdmin={true}>
        <AdminDashboard />
      </ProtectedRoute>
    } />
    <Route path="/admin" element={
      <ProtectedRoute requireAdmin={true}>
        <AdminDashboard />
      </ProtectedRoute>
    } />
    <Route path="/admin/content-manager" element={
      <ProtectedRoute requireAdmin={true}>
        <ContentManager />
      </ProtectedRoute>
    } />
    <Route path="/admin/question-generator" element={
      <ProtectedRoute requireAdmin={true}>
        <QuestionGenerator />
      </ProtectedRoute>
    } />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
