
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Assessment, Question } from "@/types";
import { AlertCircle, AlertTriangle, ArrowLeft, ArrowRight, Clock, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface QuizInterfaceProps {
  assessment: Assessment;
  onComplete: (answers: Record<string, string | number>, events: string[]) => void;
}

const QuizInterface = ({ assessment, onComplete }: QuizInterfaceProps) => {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [timeLeft, setTimeLeft] = useState(assessment.timeLimit ? assessment.timeLimit * 60 : 0);
  const [cheatingEvents, setCheatingEvents] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentHasFocus, setDocumentHasFocus] = useState(true);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentQuestion = assessment.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / assessment.questions.length) * 100;

  // Set up timer
  useEffect(() => {
    if (assessment.timeLimit) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [assessment.timeLimit]);

  // Anti-cheating measures
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const event = `Tab/Window change detected at ${new Date().toLocaleTimeString()}`;
        setCheatingEvents((prev) => [...prev, event]);
        toast({
          variant: "destructive",
          title: "Warning",
          description: "Switching tabs or windows during an assessment is recorded.",
        });
      }
      setDocumentHasFocus(!document.hidden);
    };

    // Disable copy-paste
    const handleCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const event = `Copy/Paste attempt at ${new Date().toLocaleTimeString()}`;
      setCheatingEvents((prev) => [...prev, event]);
      toast({
        variant: "destructive",
        title: "Action not allowed",
        description: "Copying and pasting is disabled during this assessment.",
      });
      return false;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);
    document.addEventListener("cut", handleCopyPaste);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
      document.removeEventListener("cut", handleCopyPaste);
    };
  }, []);

  const handleAnswer = (value: string | number) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    onComplete(answers, cheatingEvents);
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">{assessment.title}</h2>
          {!documentHasFocus && (
            <div className="flex items-center text-destructive">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span className="text-sm">Tab change detected</span>
            </div>
          )}
        </div>
        {assessment.timeLimit && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className={`font-mono ${timeLeft < 60 ? 'text-red-500 animate-pulse' : ''}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div>Question {currentQuestionIndex + 1} of {assessment.questions.length}</div>
        <div>{Math.round(progress)}% complete</div>
      </div>
      
      <Progress value={progress} className="h-1" />

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg">Question {currentQuestionIndex + 1}</CardTitle>
          <CardDescription className="text-base font-normal">
            {currentQuestion.text}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentQuestion.type === 'mcq' && currentQuestion.options && (
            <RadioGroup
              value={answers[currentQuestion.id]?.toString()}
              onValueChange={(value) => handleAnswer(value)}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="text-base font-normal">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQuestion.type === 'true-false' && (
            <RadioGroup
              value={answers[currentQuestion.id]?.toString()}
              onValueChange={(value) => handleAnswer(value)}
            >
              <div className="flex items-center space-x-2 py-2">
                <RadioGroupItem value="true" id="option-true" />
                <Label htmlFor="option-true" className="text-base font-normal">
                  True
                </Label>
              </div>
              <div className="flex items-center space-x-2 py-2">
                <RadioGroupItem value="false" id="option-false" />
                <Label htmlFor="option-false" className="text-base font-normal">
                  False
                </Label>
              </div>
            </RadioGroup>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrev} 
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          
          {currentQuestionIndex < assessment.questions.length - 1 ? (
            <Button 
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || !Object.keys(answers).length}
            >
              <Save className="mr-2 h-4 w-4" /> Submit
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <div className="flex justify-between text-sm">
        <div>
          <span className="font-semibold">Answered:</span> {Object.keys(answers).length} of {assessment.questions.length}
        </div>
        {cheatingEvents.length > 0 && (
          <div className="flex items-center text-amber-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>{cheatingEvents.length} suspicious activities logged</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizInterface;
