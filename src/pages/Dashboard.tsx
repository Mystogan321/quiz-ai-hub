
import { useState } from "react";
import Navbar from "@/components/Navbar";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Clock, Search, Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Course, User } from "@/types";

// Mock data
const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "user@example.com",
  role: "learner",
};

const mockCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to Project Management",
    description: "Learn the fundamentals of project management methodologies and practices.",
    modules: [
      {
        id: "1-1",
        title: "Project Management Basics",
        description: "Core concepts and terminology",
        content: [
          {
            id: "1-1-1",
            title: "What is Project Management?",
            type: "text",
            content: "<p>Project management is the application of processes, methods, skills, knowledge and experience to achieve specific project objectives according to the project acceptance criteria within agreed parameters.</p>",
            completed: true,
          },
        ],
        assessments: [],
      },
    ],
    progress: 15,
  },
  {
    id: "2",
    title: "Business Communication Skills",
    description: "Enhance your professional communication in meetings, emails, and presentations.",
    modules: [
      {
        id: "2-1",
        title: "Effective Emails",
        description: "Writing professional emails",
        content: [],
        assessments: [],
      },
    ],
    progress: 0,
  },
  {
    id: "3",
    title: "Data Analysis with Excel",
    description: "Master data analysis techniques using Microsoft Excel for business insights.",
    modules: [
      {
        id: "3-1",
        title: "Excel Basics",
        description: "Introduction to Excel functions",
        content: [],
        assessments: [],
      },
    ],
    progress: 65,
  },
];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState(mockCourses);

  // Filter courses based on search query
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate overall progress
  const overallProgress = courses.length > 0
    ? Math.round(courses.reduce((sum, course) => sum + (course.progress || 0), 0) / courses.length)
    : 0;

  // Get in-progress courses
  const inProgressCourses = courses.filter((course) => 
    (course.progress || 0) > 0 && (course.progress || 0) < 100
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={mockUser} />
      
      <main className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {mockUser.name}. Continue your learning journey.
            </p>
          </div>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="w-full md:w-[300px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{overallProgress}%</div>
                <Trophy className="h-4 w-4 text-lms-blue" />
              </div>
              <Progress className="h-2 mt-2" value={overallProgress} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Courses In-Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{inProgressCourses.length}</div>
                <Clock className="h-4 w-4 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Certificates Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">0</div>
                <Award className="h-4 w-4 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Learning */}
        {inProgressCourses.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Continue Learning</h2>
              <Button variant="link" className="text-lms-blue">
                See all in progress
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inProgressCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        )}

        {/* All Courses */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">All Courses</h2>
          </div>
          
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground">No courses found matching your search.</p>
                <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                  Clear search
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
