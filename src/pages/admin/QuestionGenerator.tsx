
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  Check,
  CheckCircle,
  Clock,
  FileCheck,
  FileQuestion,
  UploadCloud,
  Loader2,
  PencilLine,
  Plus,
  RefreshCcw,
  Trash2,
  Webhook,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { AIGeneratedQuestion, User } from "@/types";

// Mock data
const mockUser: User = {
  id: "admin1",
  name: "Admin User",
  email: "admin@example.com",
  role: "admin",
};

const mockAIQuestions: AIGeneratedQuestion[] = [
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
    correctAnswer: 2,
    aiGenerated: true,
    approved: true,
    sourceContent: "Project management processes are categorized into five groups: Initiating, Planning, Executing, Monitoring and Controlling, and Closing.",
    status: "approved"
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
    correctAnswer: 1,
    aiGenerated: true,
    sourceContent: "Project management triple constraints are Scope, Time, and Cost. These three factors are often depicted as the sides of a triangle, where a change to one constraint affects the others.",
    status: "pending"
  },
  {
    id: "q-3",
    text: "What is a WBS in project management?",
    type: "mcq",
    options: [
      "Work Breakdown Structure",
      "Weekly Business Summary",
      "Work Budget Sheet",
      "Workflow Balance System"
    ],
    correctAnswer: 0,
    aiGenerated: true,
    sourceContent: "The Work Breakdown Structure (WBS) is a hierarchical decomposition of the total scope of work to be carried out by the project team to accomplish the project objectives and create the required deliverables.",
    status: "edited"
  },
  {
    id: "q-4",
    text: "Agile is a linear approach to project management.",
    type: "true-false",
    correctAnswer: "false",
    aiGenerated: true,
    sourceContent: "Agile is an iterative approach that focuses on continuous releases and incorporating customer feedback with every iteration. It allows for changes and provides great flexibility.",
    status: "rejected"
  }
];

const QuestionGenerator = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [processingFile, setProcessingFile] = useState(false);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [filePreview, setFilePreview] = useState("");
  const [rawText, setRawText] = useState("");
  const [aiQuestions, setAiQuestions] = useState<AIGeneratedQuestion[]>(mockAIQuestions);
  const [editingQuestion, setEditingQuestion] = useState<AIGeneratedQuestion | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploadingFile(true);

    // Simulate file upload
    setTimeout(() => {
      setUploadingFile(false);
      setProcessingFile(true);

      // Simulate file processing and text extraction
      const processingInterval = setInterval(() => {
        setProcessingProgress(prev => {
          const next = prev + 10;
          if (next >= 100) {
            clearInterval(processingInterval);
            setProcessingFile(false);
            
            // Set some sample text as if extracted from the document
            const extractedText = `Project management is the application of processes, methods, skills, knowledge and experience to achieve specific project objectives according to the project acceptance criteria within agreed parameters.

Key Elements of Project Management:
- Scope: The work that needs to be accomplished to deliver a product, service, or result with the specified features and functions.
- Time: The project schedule including task durations, dependencies, and overall timeline.
- Cost: The budget allocated for the project including all necessary expenses.
- Quality: Ensuring that the project will satisfy the needs for which it was undertaken.

Project management processes are categorized into five groups:
1. Initiating
2. Planning
3. Executing
4. Monitoring and Controlling
5. Closing

Each process group contains processes that are applicable to any project, regardless of industry or specialty.

There are several project management methodologies that organizations can adopt based on their specific needs and the nature of their projects:

1. Waterfall
A linear approach where each phase must be completed before the next phase can begin. It's simple and easy to understand but lacks flexibility for changes.

2. Agile
An iterative approach that focuses on continuous releases and incorporating customer feedback with every iteration. It allows for changes and provides great flexibility.

3. Scrum
A subset of Agile, Scrum is characterized by cycles or stages of development, called "sprints," and by the maximization of development time for a software product.`;
            
            setRawText(extractedText);
            setFilePreview(extractedText.substring(0, 300) + "...");
            
            toast({
              title: "File processed successfully",
              description: "Text has been extracted and is ready for AI question generation.",
            });
          }
          return next;
        });
      }, 300);
    }, 1500);
  };

  const handleGenerateQuestions = () => {
    setGeneratingQuestions(true);
    
    // Simulate AI question generation
    setTimeout(() => {
      setGeneratingQuestions(false);
      setActiveTab("review");
      
      toast({
        title: "Questions generated",
        description: "AI has generated questions based on the content.",
      });
    }, 3000);
  };

  const handleApproveQuestion = (questionId: string) => {
    setAiQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? { ...q, status: "approved", approved: true }
          : q
      )
    );
    
    toast({
      title: "Question approved",
      description: "The question has been added to your question bank.",
    });
  };

  const handleRejectQuestion = (questionId: string) => {
    setAiQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? { ...q, status: "rejected", approved: false }
          : q
      )
    );
    
    toast({
      variant: "destructive",
      title: "Question rejected",
      description: "The question has been rejected and won't be used.",
    });
  };

  const handleEditQuestion = (question: AIGeneratedQuestion) => {
    setEditingQuestion(question);
  };

  const handleSaveEditedQuestion = () => {
    if (!editingQuestion) return;
    
    setAiQuestions(prev =>
      prev.map(q =>
        q.id === editingQuestion.id
          ? { ...editingQuestion, status: "edited" }
          : q
      )
    );
    
    setEditingQuestion(null);
    
    toast({
      title: "Question edited",
      description: "Your changes to the question have been saved.",
    });
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "edited":
        return <Badge className="bg-amber-500">Edited</Badge>;
      case "pending":
      default:
        return <Badge variant="outline">Pending Review</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={mockUser} />
      
      <main className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">AI Question Generator</h1>
          <p className="text-muted-foreground">
            Generate quiz questions from your learning materials using AI
          </p>
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
        
        <Tabs defaultValue={activeTab} value={activeTab} className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upload">Upload Content</TabsTrigger>
            <TabsTrigger value="review" disabled={!filePreview}>Review & Edit</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UploadCloud className="h-5 w-5 mr-2" />
                  Upload Content
                </CardTitle>
                <CardDescription>
                  Upload content for AI to generate relevant assessment questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!fileName ? (
                  <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-muted rounded-md">
                    <UploadCloud className="h-16 w-16 text-muted mb-6" />
                    <p className="text-lg font-medium mb-2">Upload a document</p>
                    <p className="text-muted-foreground text-center mb-6">
                      Upload PDF, DOCX, or TXT files to generate questions from
                      <br />
                      Maximum file size: 10MB
                    </p>
                    <Input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileUpload}
                    />
                    <Button asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Select File
                      </label>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center p-4 border rounded-md">
                      <div className="bg-muted p-2 rounded mr-4">
                        <FileCheck className="h-8 w-8 text-lms-blue" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{fileName}</p>
                        {processingFile ? (
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm text-muted-foreground mb-1">
                              <span>Processing file...</span>
                              <span>{processingProgress}%</span>
                            </div>
                            <Progress value={processingProgress} />
                          </div>
                        ) : uploadingFile ? (
                          <p className="text-sm text-muted-foreground">Uploading...</p>
                        ) : (
                          <p className="text-sm text-green-600">Ready for question generation</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setFileName("");
                          setFilePreview("");
                          setRawText("");
                          setProcessingProgress(0);
                        }}
                        disabled={processingFile || uploadingFile}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {filePreview && (
                      <div className="border rounded-md p-4">
                        <p className="font-medium mb-2">Content Preview</p>
                        <div className="bg-muted rounded-md p-4 h-[200px] overflow-y-auto">
                          <p className="whitespace-pre-line">{filePreview}</p>
                        </div>
                      </div>
                    )}
                    
                    {filePreview && (
                      <div className="flex justify-end space-x-2">
                        <Button 
                          onClick={handleGenerateQuestions} 
                          disabled={generatingQuestions}
                        >
                          {generatingQuestions ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating Questions...
                            </>
                          ) : (
                            <>
                              <Webhook className="mr-2 h-4 w-4" />
                              Generate Questions
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Advanced Options</CardTitle>
                <CardDescription>
                  Customize AI question generation parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Question Type</label>
                  <Select defaultValue="both">
                    <SelectTrigger>
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq">Multiple Choice Only</SelectItem>
                      <SelectItem value="true-false">True/False Only</SelectItem>
                      <SelectItem value="both">Both Types</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Number of Questions</label>
                  <Select defaultValue="5">
                    <SelectTrigger>
                      <SelectValue placeholder="Number of questions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Questions</SelectItem>
                      <SelectItem value="5">5 Questions</SelectItem>
                      <SelectItem value="10">10 Questions</SelectItem>
                      <SelectItem value="15">15 Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty Level</label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="review" className="space-y-4">
            {editingQuestion ? (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Question</CardTitle>
                  <CardDescription>
                    Modify the AI-generated question before approving
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Question Text</label>
                    <Textarea 
                      value={editingQuestion.text} 
                      onChange={(e) => setEditingQuestion({...editingQuestion, text: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Question Type</label>
                    <Select 
                      value={editingQuestion.type} 
                      onValueChange={(value: "mcq" | "true-false") => 
                        setEditingQuestion({...editingQuestion, type: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mcq">Multiple Choice</SelectItem>
                        <SelectItem value="true-false">True/False</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {editingQuestion.type === "mcq" && (
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Options</label>
                      {editingQuestion.options?.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <Input 
                            value={option} 
                            onChange={(e) => {
                              const newOptions = [...(editingQuestion.options || [])];
                              newOptions[index] = e.target.value;
                              setEditingQuestion({...editingQuestion, options: newOptions});
                            }}
                          />
                          <Select 
                            value={editingQuestion.correctAnswer === index ? "correct" : "incorrect"} 
                            onValueChange={(value) => {
                              if (value === "correct") {
                                setEditingQuestion({...editingQuestion, correctAnswer: index});
                              }
                            }}
                          >
                            <SelectTrigger className="w-[110px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="correct">Correct</SelectItem>
                              <SelectItem value="incorrect">Incorrect</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          const newOptions = [...(editingQuestion.options || []), "New Option"];
                          setEditingQuestion({...editingQuestion, options: newOptions});
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Option
                      </Button>
                    </div>
                  )}
                  
                  {editingQuestion.type === "true-false" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Correct Answer</label>
                      <Select 
                        value={editingQuestion.correctAnswer as string} 
                        onValueChange={(value) => 
                          setEditingQuestion({...editingQuestion, correctAnswer: value})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">True</SelectItem>
                          <SelectItem value="false">False</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Source Content</label>
                    <div className="p-3 bg-muted rounded-md text-sm">
                      <p>{editingQuestion.sourceContent}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEditedQuestion}>
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Review AI-Generated Questions</h2>
                  <Button variant="outline" size="sm">
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Regenerate Questions
                  </Button>
                </div>
                
                {aiQuestions.map((question) => (
                  <Card key={question.id} className="border-l-4 border-l-lms-blue">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <FileQuestion className="h-4 w-4 text-lms-blue" />
                            <span className="text-sm text-muted-foreground">
                              {question.type === "mcq" ? "Multiple Choice" : "True/False"}
                            </span>
                            {getStatusBadge(question.status)}
                          </div>
                          <CardTitle className="text-base">{question.text}</CardTitle>
                        </div>
                        {question.status === "pending" && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEditQuestion(question)}>
                              <PencilLine className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      {question.type === "mcq" && question.options && (
                        <div className="space-y-2 ml-6">
                          {question.options.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                question.correctAnswer === index 
                                  ? "bg-green-500 text-white" 
                                  : "bg-muted"
                              }`}>
                                {String.fromCharCode(65 + index)}
                              </div>
                              <span>{option}</span>
                              {question.correctAnswer === index && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {question.type === "true-false" && (
                        <div className="space-y-2 ml-6">
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                              question.correctAnswer === "true" 
                                ? "bg-green-500 text-white" 
                                : "bg-muted"
                            }`}>
                              T
                            </div>
                            <span>True</span>
                            {question.correctAnswer === "true" && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                              question.correctAnswer === "false" 
                                ? "bg-green-500 text-white" 
                                : "bg-muted"
                            }`}>
                              F
                            </div>
                            <span>False</span>
                            {question.correctAnswer === "false" && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p className="font-medium">Source content:</p>
                        <p className="bg-muted p-2 rounded mt-1">{question.sourceContent}</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      {question.status === "pending" && (
                        <div className="flex justify-end gap-2 w-full">
                          <Button 
                            variant="outline" 
                            onClick={() => handleRejectQuestion(question.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                          <Button 
                            onClick={() => handleApproveQuestion(question.id)}
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                        </div>
                      )}
                      
                      {question.status !== "pending" && (
                        <div className="flex justify-end w-full">
                          <Button 
                            variant="ghost" 
                            onClick={() => handleEditQuestion(question)}
                            className="text-muted-foreground"
                            disabled={question.status === "rejected"}
                          >
                            <PencilLine className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Question Generation History</CardTitle>
                <CardDescription>
                  View past AI question generation sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Project Management Basics</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Generated 2 days ago</span>
                        </div>
                      </div>
                      <div>
                        <Badge variant="outline">8 Questions</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">View Questions</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Communication Skills Module</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Generated 5 days ago</span>
                        </div>
                      </div>
                      <div>
                        <Badge variant="outline">12 Questions</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">View Questions</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default QuestionGenerator;
