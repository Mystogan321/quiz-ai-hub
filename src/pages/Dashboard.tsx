
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Clock, Search, Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { getCourses } from "@/services/courseService";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses
  });

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
      <Navbar />
      
      <main className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}. Continue your learning journey.
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
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{overallProgress}%</div>
                    <Trophy className="h-4 w-4 text-lms-blue" />
                  </div>
                  <Progress className="h-2 mt-2" value={overallProgress} />
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Courses In-Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{inProgressCourses.length}</div>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Certificates Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {courses.filter(c => c.progress === 100).length}
                  </div>
                  <Award className="h-4 w-4 text-green-500" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardHeader className="p-4 pb-0">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="text-red-500">Failed to load courses. Please try again later.</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Continue Learning */}
        {!isLoading && inProgressCourses.length > 0 && (
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
        {!isLoading && (
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
        )}
      </main>
    </div>
  );
};

export default Dashboard;
