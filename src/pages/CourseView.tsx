
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CourseContent from "@/components/CourseContent";
import QuizInterface from "@/components/QuizInterface";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Book, 
  CheckSquare, 
  ChevronRight,
  FileText,
  Play
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Assessment, 
  ContentItem, 
  Course, 
  Module,
  User 
} from "@/types";

// Mock data
const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "user@example.com",
  role: "learner",
};

const mockCourse: Course = {
  id: "1",
  title: "Introduction to Project Management",
  description: "Learn the fundamentals of project management methodologies and practices.",
  modules: [
    {
      id: "module-1",
      title: "Module 1: Project Management Basics",
      description: "Learn the core concepts and terminology of project management",
      content: [
        {
          id: "content-1",
          title: "What is Project Management?",
          type: "text",
          content: `<div class="prose max-w-none">
            <p>Project management is the application of processes, methods, skills, knowledge and experience to achieve specific project objectives according to the project acceptance criteria within agreed parameters.</p>
            <h3>Key Elements of Project Management:</h3>
            <ul>
              <li><strong>Scope:</strong> The work that needs to be accomplished to deliver a product, service, or result with the specified features and functions.</li>
              <li><strong>Time:</strong> The project schedule including task durations, dependencies, and overall timeline.</li>
              <li><strong>Cost:</strong> The budget allocated for the project including all necessary expenses.</li>
              <li><strong>Quality:</strong> Ensuring that the project will satisfy the needs for which it was undertaken.</li>
            </ul>
            <p>Project management processes are categorized into five groups:</p>
            <ol>
              <li>Initiating</li>
              <li>Planning</li>
              <li>Executing</li>
              <li>Monitoring and Controlling</li>
              <li>Closing</li>
            </ol>
            <p>Each process group contains processes that are applicable to any project, regardless of industry or specialty.</p>
          </div>`
        },
        {
          id: "content-2",
          title: "Project Management Methodologies",
          type: "text",
          content: `<div class="prose max-w-none">
            <p>There are several project management methodologies that organizations can adopt based on their specific needs and the nature of their projects:</p>
            <h3>1. Waterfall</h3>
            <p>A linear approach where each phase must be completed before the next phase can begin. It's simple and easy to understand but lacks flexibility for changes.</p>
            <h3>2. Agile</h3>
            <p>An iterative approach that focuses on continuous releases and incorporating customer feedback with every iteration. It allows for changes and provides great flexibility.</p>
            <h3>3. Scrum</h3>
            <p>A subset of Agile, Scrum is characterized by cycles or stages of development, called "sprints," and by the maximization of development time for a software product.</p>
            <h3>4. Kanban</h3>
            <p>A visual framework used to implement Agile that shows what to produce, when to produce it, and how much to produce.</p>
            <h3>5. Lean</h3>
            <p>Focuses on streamlining and eliminating waste while delivering more value with less work.</p>
          </div>`
        },
        {
          id: "content-3",
          title: "Project Management Tool Overview",
          type: "video",
          content: "https://www.youtube.com/embed/qkuUBcmmBpk"
        }
      ],
      assessments: [
        {
          id: "assessment-1",
          title: "Project Management Basics Quiz",
          description: "Test your understanding of basic project management concepts",
          type: "practice",
          timeLimit: 10,
          questions: [
            {
              id: "q-1",
              text: "Which of the following is NOT a process group in project management?",
              type: "mcq",
              options: [
                "Initiating",
                "Planning",
                "Designing",
                "Closing"
              ],
              correctAnswer: 2
            },
            {
              id: "q-2",
              text: "The triple constraint in project management consists of:",
              type: "mcq",
              options: [
                "Time, Cost, and Quality",
                "Scope, Time, and Cost",
                "Scope, Resources, and Schedule",
                "Budget, Timeline, and Deliverables"
              ],
              correctAnswer: 1
            },
            {
              id: "q-3",
              text: "Agile is a linear approach to project management.",
              type: "true-false",
              correctAnswer: "false"
            }
          ]
        }
      ]
    },
    {
      id: "module-2",
      title: "Module 2: Project Planning",
      description: "Master the techniques for effective project planning",
      content: [
        {
          id: "content-4",
          title: "Creating a Project Plan",
          type: "text",
          content: "<p>A comprehensive project plan includes...</p>"
        }
      ],
      assessments: []
    }
  ],
  progress: 15,
};

const CourseView = () => {
  const { courseId, moduleId, contentId, assessmentId } = useParams();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course>(mockCourse);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [activeContent, setActiveContent] = useState<ContentItem | null>(null);
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);

  // Set active module based on route param or default to first
  useState(() => {
    const module = moduleId 
      ? course.modules.find(m => m.id === moduleId) 
      : course.modules[0];
    
    setActiveModule(module || null);

    // Set active content or assessment based on route params
    if (module) {
      if (contentId) {
        const content = module.content.find(c => c.id === contentId);
        if (content) setActiveContent(content);
      } else if (assessmentId) {
        const assessment = module.assessments.find(a => a.id === assessmentId);
        if (assessment) setActiveAssessment(assessment);
      } else if (module.content.length > 0) {
        // Default to first content item
        setActiveContent(module.content[0]);
      }
    }
  });

  const handleCompleteContent = (contentId: string) => {
    // Mark content as completed
    const updatedCourse = { ...course };
    course.modules.forEach(module => {
      module.content.forEach(content => {
        if (content.id === contentId) {
          content.completed = true;
        }
      });
    });

    // Update course progress
    const totalItems = course.modules.reduce(
      (total, module) => total + module.content.length, 
      0
    );
    const completedItems = course.modules.reduce(
      (total, module) => total + module.content.filter(c => c.completed).length, 
      0
    );
    
    updatedCourse.progress = totalItems > 0 
      ? Math.round((completedItems / totalItems) * 100)
      : 0;
    
    setCourse(updatedCourse);
    
    toast({
      title: "Progress saved",
      description: "Your progress has been updated.",
    });
  };

  const handleCompleteAssessment = (answers: Record<string, string | number>, events: string[]) => {
    // In a real app, this would submit answers to backend for grading
    // For now, just mark as completed with random score
    const score = Math.floor(Math.random() * 41) + 60; // Random score between 60-100
    
    if (activeAssessment) {
      const updatedCourse = { ...course };
      course.modules.forEach(module => {
        module.assessments.forEach(assessment => {
          if (assessment.id === activeAssessment.id) {
            assessment.completed = true;
            assessment.score = score;
          }
        });
      });
      
      setCourse(updatedCourse);
      setActiveAssessment(null); // Reset active assessment after completion
      
      toast({
        title: `Assessment completed`,
        description: `Your score: ${score}%`,
      });
      
      // Log cheating events if any
      if (events.length > 0) {
        console.log("Suspicious events detected:", events);
        toast({
          variant: "destructive",
          title: "Suspicious activity detected",
          description: `${events.length} suspicious events were logged during the assessment.`,
        });
      }
    }
  };

  // Calculate progress for current module
  const calculateModuleProgress = (module: Module): number => {
    const totalItems = module.content.length;
    const completedItems = module.content.filter(c => c.completed).length;
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={mockUser} />
      
      <div className="container py-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <Link to="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link to="/courses" className="hover:text-foreground">
            Courses
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="font-medium text-foreground">{course.title}</span>
        </div>
        
        {/* Back button */}
        <div className="mb-4">
          <Button variant="outline" size="sm" asChild className="group">
            <Link to="/dashboard">
              <ArrowLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Course navigation */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Course Progress</span>
                  <span>{course.progress || 0}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="modules" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="modules">Modules</TabsTrigger>
                  <TabsTrigger value="assessments">Assessments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="modules" className="space-y-4 pt-4">
                  {course.modules.map((module) => (
                    <div key={module.id} className="space-y-2">
                      <div 
                        className={`font-medium ${activeModule?.id === module.id ? 'text-lms-blue' : ''}`}
                        onClick={() => setActiveModule(module)}
                      >
                        {module.title}
                      </div>
                      
                      {calculateModuleProgress(module) > 0 && (
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>{calculateModuleProgress(module)}%</span>
                        </div>
                      )}
                      
                      <Progress 
                        value={calculateModuleProgress(module)} 
                        className="h-1 mb-2" 
                      />
                      
                      {activeModule?.id === module.id && (
                        <div className="pl-4 border-l-2 border-muted space-y-2 mt-2">
                          {module.content.map((item) => (
                            <button
                              key={item.id}
                              className={`flex items-center text-sm w-full text-left py-1 px-2 rounded hover:bg-muted/50 ${
                                activeContent?.id === item.id
                                  ? "bg-muted font-medium"
                                  : "text-muted-foreground"
                              }`}
                              onClick={() => {
                                setActiveContent(item);
                                setActiveAssessment(null);
                              }}
                            >
                              {item.completed && (
                                <CheckSquare className="h-3 w-3 mr-2 text-green-500" />
                              )}
                              {!item.completed && item.type === "text" && (
                                <FileText className="h-3 w-3 mr-2" />
                              )}
                              {!item.completed && item.type === "video" && (
                                <Play className="h-3 w-3 mr-2" />
                              )}
                              <span className="truncate">{item.title}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="assessments" className="space-y-4 pt-4">
                  {course.modules.flatMap((module) =>
                    module.assessments.map((assessment) => (
                      <button
                        key={assessment.id}
                        className={`flex items-center text-sm w-full text-left p-2 rounded hover:bg-muted/50 ${
                          activeAssessment?.id === assessment.id
                            ? "bg-muted font-medium"
                            : ""
                        }`}
                        onClick={() => {
                          setActiveAssessment(assessment);
                          setActiveContent(null);
                        }}
                      >
                        <Book className="h-4 w-4 mr-2" />
                        <div className="flex-1">
                          <div>{assessment.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {module.title}
                          </div>
                          {assessment.completed && assessment.score !== undefined && (
                            <div className="text-xs text-green-600">
                              Score: {assessment.score}%
                            </div>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                  
                  {course.modules.flatMap(m => m.assessments).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No assessments available for this course yet.
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Right content area - Content or Assessment */}
          <div className="lg:col-span-2">
            {activeContent && (
              <Card>
                <CardContent className="p-6">
                  <CourseContent 
                    contentItem={activeContent} 
                    onComplete={handleCompleteContent}
                  />
                </CardContent>
              </Card>
            )}
            
            {activeAssessment && (
              <Card>
                <CardContent className="p-6">
                  <QuizInterface 
                    assessment={activeAssessment} 
                    onComplete={handleCompleteAssessment}
                  />
                </CardContent>
              </Card>
            )}
            
            {!activeContent && !activeAssessment && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Book className="h-12 w-12 text-muted mb-4" />
                  <p className="text-muted-foreground">
                    Select a content item or assessment from the menu to begin.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
