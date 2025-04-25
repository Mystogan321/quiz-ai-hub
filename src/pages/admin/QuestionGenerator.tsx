
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Search, Check, XCircle, PenLine, ThumbsUp, ThumbsDown } from "lucide-react";
import {
  getAIGeneratedQuestions,
  approveQuestion,
  rejectQuestion,
  editQuestion,
  generateQuestionsFromContent
} from "@/services/questionService";
import { AIGeneratedQuestion } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const QuestionGenerator = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<AIGeneratedQuestion | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState<{
    text: string;
    type: "mcq" | "true-false";
    options?: string[];
    correctAnswer: string | number;
  }>({ text: "", type: "mcq", options: ["", "", "", ""], correctAnswer: 0 });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch AI generated questions
  const { data: questions = [], isLoading, error } = useQuery({
    queryKey: ['ai-questions'],
    queryFn: getAIGeneratedQuestions,
  });
  
  // Mutations for question actions
  const approveMutation = useMutation({
    mutationFn: approveQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-questions'] });
      toast({ title: "Question approved", description: "The question has been added to the question bank." });
    }
  });
  
  const rejectMutation = useMutation({
    mutationFn: rejectQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-questions'] });
      toast({ title: "Question rejected", description: "The question has been rejected." });
    }
  });
  
  const editMutation = useMutation({
    mutationFn: (params: { id: string; data: Partial<AIGeneratedQuestion> }) => 
      editQuestion(params.id, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-questions'] });
      toast({ title: "Question updated", description: "Your changes have been saved." });
      setIsEditDialogOpen(false);
    }
  });
  
  const generateMutation = useMutation({
    mutationFn: (params: { contentId: string; count: number }) =>
      generateQuestionsFromContent(params.contentId, params.count),
    onSuccess: (data) => {
      if (data.success) {
        toast({ 
          title: "Generation started", 
          description: "The AI is generating questions from your content. This may take a minute." 
        });
        // In a real app, you might poll for status updates using the jobId
        // For now, we'll just wait and refresh
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['ai-questions'] });
        }, 5000);
      } else {
        toast({
          variant: "destructive",
          title: "Generation failed",
          description: data.message || "Failed to start question generation."
        });
      }
    }
  });

  // Filter questions based on search and active tab
  const filteredQuestions = questions.filter(
    q => q.text.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const pendingQuestions = filteredQuestions.filter(q => q.status === 'pending');
  const approvedQuestions = filteredQuestions.filter(q => q.status === 'approved');
  const rejectedQuestions = filteredQuestions.filter(q => q.status === 'rejected');
  const editedQuestions = filteredQuestions.filter(q => q.status === 'edited');

  // Handlers
  const handleApproveQuestion = (questionId: string) => {
    approveMutation.mutate(questionId);
  };

  const handleRejectQuestion = (questionId: string) => {
    rejectMutation.mutate(questionId);
  };

  const handleEditQuestion = () => {
    if (!selectedQuestion) return;
    
    editMutation.mutate({
      id: selectedQuestion.id,
      data: {
        text: editedQuestion.text,
        type: editedQuestion.type,
        options: editedQuestion.options,
        correctAnswer: editedQuestion.correctAnswer,
        status: 'edited'
      }
    });
  };

  const handleOpenEditDialog = (question: AIGeneratedQuestion) => {
    setSelectedQuestion(question);
    setEditedQuestion({
      text: question.text,
      type: question.type,
      options: question.options?.slice() || ["", "", "", ""],
      correctAnswer: question.correctAnswer
    });
    setIsEditDialogOpen(true);
  };

  const handleAddOption = () => {
    setEditedQuestion(prev => ({
      ...prev,
      options: [...(prev.options || []), ""]
    }));
  };

  const handleRemoveOption = (index: number) => {
    setEditedQuestion(prev => ({
      ...prev,
      options: (prev.options || []).filter((_, i) => i !== index),
      correctAnswer: typeof prev.correctAnswer === 'number' && prev.correctAnswer === index 
        ? 0 
        : prev.correctAnswer
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    setEditedQuestion(prev => ({
      ...prev,
      options: (prev.options || []).map((opt, i) => i === index ? value : opt)
    }));
  };

  const handleGenerateQuestions = () => {
    // This is a mock function - in a real app you'd have a content selector
    const mockContentId = "content-123";
    
    toast({
      title: "Generating questions",
      description: "Sending request to generate questions from selected content..."
    });
    
    generateMutation.mutate({ contentId: mockContentId, count: 5 });
  };

  // Render status badge for questions
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending Review</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'edited':
        return <Badge variant="secondary">Edited</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Question Generator</h1>
            <p className="text-muted-foreground">
              Review, edit, and manage AI-generated questions
            </p>
          </div>
          
          <Button onClick={handleGenerateQuestions} disabled={generateMutation.isPending}>
            {generateMutation.isPending ? "Generating..." : "Generate New Questions"}
          </Button>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search questions..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Review ({pendingQuestions.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedQuestions.length})
            </TabsTrigger>
            <TabsTrigger value="edited">
              Edited ({editedQuestions.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedQuestions.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-5 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <div className="flex justify-between mt-4">
                          <Skeleton className="h-10 w-20" />
                          <div className="flex gap-2">
                            <Skeleton className="h-10 w-20" />
                            <Skeleton className="h-10 w-20" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-red-500">Failed to load questions. Please try again later.</p>
                  <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </CardContent>
              </Card>
            ) : pendingQuestions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-muted-foreground">No pending questions to review.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingQuestions.map((question) => (
                  <Card key={question.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{question.text}</CardTitle>
                        {renderStatusBadge(question.status)}
                      </div>
                      <CardDescription className="text-xs">
                        Source: {question.sourceContent.substring(0, 100)}...
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {question.type === 'mcq' ? (
                          <div className="grid gap-2">
                            {question.options?.map((option, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className={`h-5 w-5 rounded-full flex items-center justify-center border ${
                                  question.correctAnswer === index
                                    ? 'bg-green-500 border-green-600 text-white'
                                    : 'border-gray-300'
                                }`}>
                                  {question.correctAnswer === index && <Check className="h-3 w-3" />}
                                </div>
                                <span>{option}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-4">
                            <div className={`px-3 py-1 rounded-full ${
                              question.correctAnswer === 'true'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200'
                            }`}>
                              True
                            </div>
                            <div className={`px-3 py-1 rounded-full ${
                              question.correctAnswer === 'false'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200'
                            }`}>
                              False
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end space-x-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEditDialog(question)}
                            disabled={approveMutation.isPending || rejectMutation.isPending}
                          >
                            <PenLine className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                            onClick={() => handleRejectQuestion(question.id)}
                            disabled={approveMutation.isPending || rejectMutation.isPending}
                          >
                            <ThumbsDown className="h-4 w-4 mr-1" /> Reject
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                            onClick={() => handleApproveQuestion(question.id)}
                            disabled={approveMutation.isPending || rejectMutation.isPending}
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" /> Approve
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="approved">
            {!isLoading && approvedQuestions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-muted-foreground">No approved questions found.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {approvedQuestions.map((question) => (
                  <Card key={question.id}>
                    {/* Similar card structure as pending questions, but without action buttons */}
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{question.text}</CardTitle>
                        {renderStatusBadge(question.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {question.type === 'mcq' ? (
                          <div className="grid gap-2">
                            {question.options?.map((option, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className={`h-5 w-5 rounded-full flex items-center justify-center border ${
                                  question.correctAnswer === index
                                    ? 'bg-green-500 border-green-600 text-white'
                                    : 'border-gray-300'
                                }`}>
                                  {question.correctAnswer === index && <Check className="h-3 w-3" />}
                                </div>
                                <span>{option}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-4">
                            <div className={`px-3 py-1 rounded-full ${
                              question.correctAnswer === 'true'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200'
                            }`}>
                              True
                            </div>
                            <div className={`px-3 py-1 rounded-full ${
                              question.correctAnswer === 'false'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200'
                            }`}>
                              False
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="edited">
            {!isLoading && editedQuestions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-muted-foreground">No edited questions found.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {editedQuestions.map((question) => (
                  <Card key={question.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{question.text}</CardTitle>
                        {renderStatusBadge(question.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Content similar to approved questions */}
                      <div className="space-y-4">
                        {question.type === 'mcq' ? (
                          <div className="grid gap-2">
                            {question.options?.map((option, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className={`h-5 w-5 rounded-full flex items-center justify-center border ${
                                  question.correctAnswer === index
                                    ? 'bg-green-500 border-green-600 text-white'
                                    : 'border-gray-300'
                                }`}>
                                  {question.correctAnswer === index && <Check className="h-3 w-3" />}
                                </div>
                                <span>{option}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-4">
                            <div className={`px-3 py-1 rounded-full ${
                              question.correctAnswer === 'true'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200'
                            }`}>
                              True
                            </div>
                            <div className={`px-3 py-1 rounded-full ${
                              question.correctAnswer === 'false'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200'
                            }`}>
                              False
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end space-x-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                            onClick={() => handleApproveQuestion(question.id)}
                            disabled={approveMutation.isPending}
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" /> Approve
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="rejected">
            {!isLoading && rejectedQuestions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-muted-foreground">No rejected questions found.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {rejectedQuestions.map((question) => (
                  <Card key={question.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{question.text}</CardTitle>
                        {renderStatusBadge(question.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Content similar to approved questions */}
                      <div className="space-y-4">
                        {question.type === 'mcq' ? (
                          <div className="grid gap-2">
                            {question.options?.map((option, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className={`h-5 w-5 rounded-full flex items-center justify-center border ${
                                  question.correctAnswer === index
                                    ? 'bg-green-500 border-green-600 text-white'
                                    : 'border-gray-300'
                                }`}>
                                  {question.correctAnswer === index && <Check className="h-3 w-3" />}
                                </div>
                                <span>{option}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-4">
                            <div className={`px-3 py-1 rounded-full ${
                              question.correctAnswer === 'true'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200'
                            }`}>
                              True
                            </div>
                            <div className={`px-3 py-1 rounded-full ${
                              question.correctAnswer === 'false'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200'
                            }`}>
                              False
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Edit Question Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>
              Make changes to the AI-generated question below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question-text">Question Text</Label>
              <Textarea
                id="question-text"
                value={editedQuestion.text}
                onChange={(e) => setEditedQuestion({...editedQuestion, text: e.target.value})}
                placeholder="Enter your question here"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Question Type</Label>
              <RadioGroup
                value={editedQuestion.type}
                onValueChange={(value: "mcq" | "true-false") => {
                  setEditedQuestion({
                    ...editedQuestion,
                    type: value,
                    correctAnswer: value === "mcq" ? 0 : "false"
                  });
                }}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mcq" id="mcq" />
                  <Label htmlFor="mcq">Multiple Choice</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true-false" id="true-false" />
                  <Label htmlFor="true-false">True/False</Label>
                </div>
              </RadioGroup>
            </div>
            
            {editedQuestion.type === "mcq" ? (
              <div className="space-y-4">
                <Label>Options</Label>
                {editedQuestion.options?.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Radio 
                      checked={editedQuestion.correctAnswer === index}
                      onClick={() => setEditedQuestion({...editedQuestion, correctAnswer: index})}
                    />
                    <Input 
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1"
                    />
                    {(editedQuestion.options?.length || 0) > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveOption(index)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                
                {(editedQuestion.options?.length || 0) < 6 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddOption}
                    className="w-full"
                  >
                    Add Option
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Correct Answer</Label>
                <RadioGroup
                  value={editedQuestion.correctAnswer as string}
                  onValueChange={(value: "true" | "false") => {
                    setEditedQuestion({...editedQuestion, correctAnswer: value});
                  }}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="true" />
                    <Label htmlFor="true">True</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="false" />
                    <Label htmlFor="false">False</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditQuestion} disabled={editMutation.isPending}>
              {editMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper component for radio buttons in the edit dialog
const Radio = ({ checked, onClick }: { checked: boolean; onClick: () => void }) => (
  <div
    className={`h-5 w-5 rounded-full flex items-center justify-center cursor-pointer border ${
      checked ? 'bg-lms-blue border-lms-blue' : 'border-gray-300'
    }`}
    onClick={onClick}
  >
    {checked && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
  </div>
);

export default QuestionGenerator;
