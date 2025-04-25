
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Book, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  Search,
  Timer 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Assessment, User } from "@/types";
import { Badge } from "@/components/ui/badge";

// Mock data
const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "user@example.com",
  role: "learner",
};

const mockAssessments: Assessment[] = [
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
    ],
    completed: true,
    score: 67,
  },
  {
    id: "assessment-2",
    title: "Project Planning Assessment",
    description: "Evaluate your knowledge of project planning techniques",
    type: "graded",
    timeLimit: 15,
    questions: [
      {
        id: "q-4",
        text: "What is a WBS in project management?",
        type: "mcq",
        options: [
          "Work Breakdown Structure",
          "Weekly Business Summary",
          "Work Budget Sheet",
          "Workflow Balance System"
        ],
        correctAnswer: 0
      }
    ]
  },
  {
    id: "assessment-3",
    title: "Communication Skills Quiz",
    description: "Test your business communication knowledge",
    type: "practice",
    timeLimit: 5,
    questions: [
      {
        id: "q-5",
        text: "What is the most important aspect of business emails?",
        type: "mcq",
        options: [
          "Length",
          "Clarity",
          "Formality",
          "Speed of response"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "assessment-4",
    title: "Excel Functions Test",
    description: "Demonstrate your knowledge of Excel formulas and functions",
    type: "sectional",
    timeLimit: 30,
    questions: [
      {
        id: "q-6",
        text: "Which Excel function would you use to count cells that meet specific criteria?",
        type: "mcq",
        options: [
          "SUM",
          "COUNT",
          "COUNTIF",
          "VLOOKUP"
        ],
        correctAnswer: 2
      }
    ]
  }
];

const AssessmentView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [assessments, setAssessments] = useState(mockAssessments);
  const [activeTab, setActiveTab] = useState("all");

  // Filter assessments based on search query and active tab
  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          assessment.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "upcoming") return matchesSearch && !assessment.completed;
    if (activeTab === "completed") return matchesSearch && assessment.completed;
    if (activeTab === "practice") return matchesSearch && assessment.type === "practice";
    if (activeTab === "graded") return matchesSearch && (assessment.type === "graded" || assessment.type === "sectional" || assessment.type === "full");
    
    return matchesSearch;
  });

  const getAssessmentTypeLabel = (type: string) => {
    switch (type) {
      case "practice": return "Practice Quiz";
      case "graded": return "Graded Test";
      case "sectional": return "Sectional Mock";
      case "full": return "Full-Length Mock";
      default: return "Assessment";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={mockUser} />
      
      <main className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
            <p className="text-muted-foreground">
              Take quizzes and tests to evaluate your knowledge
            </p>
          </div>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search assessments..."
              className="w-full md:w-[300px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
        
        <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
            <TabsTrigger value="graded">Graded</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            {filteredAssessments.length > 0 ? (
              filteredAssessments.map((assessment) => (
                <Card key={assessment.id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{assessment.title}</h3>
                          <Badge variant={assessment.type === "practice" ? "outline" : "default"}>
                            {getAssessmentTypeLabel(assessment.type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{assessment.description}</p>
                        <div className="flex flex-wrap gap-4 mt-2">
                          <div className="flex items-center text-sm">
                            <Book className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{assessment.questions.length} questions</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{assessment.timeLimit} minutes</span>
                          </div>
                          {assessment.completed && assessment.score !== undefined && (
                            <div className="flex items-center text-sm">
                              <FileCheck className="h-4 w-4 mr-1 text-green-600" />
                              <span>Score: {assessment.score}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <Button 
                          variant={assessment.completed ? "outline" : "default"}
                          className={`min-w-[120px] ${assessment.completed ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800" : ""}`}
                          asChild
                        >
                          <Link to={`/assessments/${assessment.id}`}>
                            {assessment.completed ? (
                              <>
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Review
                              </>
                            ) : (
                              <>
                                <Timer className="mr-2 h-4 w-4" /> Start
                              </>
                            )}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Calendar className="h-12 w-12 text-muted mb-4" />
                  <p className="text-muted-foreground mb-2">No assessments found matching your criteria.</p>
                  {searchQuery && (
                    <Button variant="outline" onClick={() => setSearchQuery("")}>
                      Clear search
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AssessmentView;
