
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Book,
  FileText,
  Film,
  FolderPlus,
  Layers,
  LayoutGrid,
  LayoutList,
  Link as LinkIcon,
  MoreHorizontal,
  PenLine,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Course } from "@/types";

// Mock data
const mockUser: User = {
  id: "admin1",
  name: "Admin User",
  email: "admin@example.com",
  role: "admin",
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
          },
        ],
        assessments: [],
      },
    ],
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
  },
];

const ContentManager = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [courses, setCourses] = useState(mockCourses);

  // Filter courses based on search query
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "document":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "video":
        return <Film className="h-4 w-4 text-purple-500" />;
      case "link":
        return <LinkIcon className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={mockUser} />
      
      <main className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content Manager</h1>
            <p className="text-muted-foreground">
              Manage courses, modules, and learning materials
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search content..."
                className="pl-8 w-full md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Course
            </Button>
          </div>
        </div>
        
        {/* Back button */}
        <div className="mb-4">
          <Button variant="outline" size="sm" asChild className="group">
            <Link to="/admin/dashboard">
              <ArrowLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <Tabs defaultValue="courses" className="w-full">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="modules">Modules</TabsTrigger>
                <TabsTrigger value="content">Content Items</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-muted" : ""}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-muted" : ""}
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <TabsContent value="courses" className="pt-4">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <Book className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <CardHeader className="p-4 pb-0">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>{course.title}</span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <PenLine className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FolderPlus className="h-4 w-4 mr-2" />
                                Add Module
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardTitle>
                        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Layers className="h-4 w-4 mr-1" />
                            <span>{course.modules.length} modules</span>
                          </div>
                          <div>
                            {course.modules.reduce((total, module) => total + module.content.length, 0)} content items
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button variant="outline" className="w-full" asChild>
                          <Link to={`/admin/courses/${course.id}`}>
                            Manage Course
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                  
                  {/* Add New Course Card */}
                  <Card className="flex flex-col items-center justify-center p-6 border-dashed border-2 border-muted h-full">
                    <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Create New Course</p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Course
                    </Button>
                  </Card>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredCourses.map((course) => (
                    <Card key={course.id}>
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-muted rounded">
                              <Book className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                              <h3 className="font-medium">{course.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {course.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/admin/courses/${course.id}`}>
                                Manage
                              </Link>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <PenLine className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FolderPlus className="h-4 w-4 mr-2" />
                                  Add Module
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  
                  <Button className="w-full py-6 border-dashed border-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Course
                  </Button>
                </div>
              )}
              
              {filteredCourses.length === 0 && (
                <Card className="w-full">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Book className="h-12 w-12 text-muted mb-4" />
                    <p className="text-muted-foreground mb-4">No courses found</p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Course
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="modules" className="pt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center py-8">
                    <Layers className="h-12 w-12 text-muted mb-4" />
                    <p className="text-muted-foreground mb-4">Select a course to view its modules</p>
                    <Button variant="outline">
                      Browse Courses
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Content</CardTitle>
                  <CardDescription>
                    Upload content items to add to your courses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted rounded-md">
                    <Upload className="h-12 w-12 text-muted mb-4" />
                    <p className="text-muted-foreground mb-2">
                      Drag and drop files here, or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supports PDF, DOCX, TXT, MP4, and more
                    </p>
                    <Button>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Files
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ContentManager;
