
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  BookOpen,
  FileQuestion,
  Layers,
  Plus,
  Users,
  Webhook
} from "lucide-react";
import { User } from "@/types";

// Mock data
const mockUser: User = {
  id: "admin1",
  name: "Admin User",
  email: "admin@example.com",
  role: "admin",
};

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={mockUser} />
      
      <main className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage courses, users, content, and assessments.
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">24</div>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">5</div>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Assessments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">12</div>
                <FileQuestion className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                AI-Generated Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">48</div>
                <Webhook className="h-4 w-4 text-lms-blue" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Admin Action Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layers className="h-5 w-5 mr-2 text-lms-blue" />
                Content Management
              </CardTitle>
              <CardDescription>
                Manage courses, modules, and learning materials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/admin/content-manager">
                  <Plus className="mr-2 h-4 w-4" />
                  Manage Content
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Add New Course
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileQuestion className="h-5 w-5 mr-2 text-lms-blue" />
                Assessment Tools
              </CardTitle>
              <CardDescription>
                Create and manage quizzes and tests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Create Assessment
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/admin/question-generator">
                  <Webhook className="mr-2 h-4 w-4" />
                  AI Question Generator
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-lms-blue" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage users, roles, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Add New User
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Reports Dashboard */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Analytics & Reports</h2>
          <Tabs defaultValue="engagement" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="engagement">User Engagement</TabsTrigger>
              <TabsTrigger value="performance">Course Performance</TabsTrigger>
              <TabsTrigger value="assessment">Assessment Results</TabsTrigger>
            </TabsList>
            <TabsContent value="engagement" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    User Engagement Overview
                  </CardTitle>
                  <CardDescription>
                    User activity and engagement metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center border-2 border-dashed border-muted rounded-md">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted mb-4" />
                    <p className="text-muted-foreground">
                      Analytics charts would be displayed here
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Detailed Reports</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="performance" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Course Performance</CardTitle>
                  <CardDescription>
                    Completion rates and user engagement by course
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center border-2 border-dashed border-muted rounded-md">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted mb-4" />
                    <p className="text-muted-foreground">
                      Course performance charts would be displayed here
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Detailed Reports</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="assessment" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Results</CardTitle>
                  <CardDescription>
                    User performance on assessments and quizzes
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center border-2 border-dashed border-muted rounded-md">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted mb-4" />
                    <p className="text-muted-foreground">
                      Assessment results charts would be displayed here
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Detailed Reports</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
