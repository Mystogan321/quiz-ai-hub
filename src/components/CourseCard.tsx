
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { Course } from "@/types";

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const { id, title, description, thumbnail, modules, progress } = course;
  
  // Calculate total assessments
  const totalAssessments = modules.reduce((total, module) => {
    return total + module.assessments.length;
  }, 0);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={thumbnail || "/placeholder.svg"}
          alt={title}
          className="object-cover w-full h-full"
        />
        {progress !== undefined && progress < 100 && progress > 0 && (
          <Badge className="absolute top-2 right-2 bg-lms-blue">In Progress</Badge>
        )}
        {progress === 100 && (
          <Badge className="absolute top-2 right-2 bg-green-600">Completed</Badge>
        )}
      </div>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg line-clamp-1">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{modules.length} modules</span>
          </div>
          <div>{totalAssessments} assessments</div>
        </div>
        {progress !== undefined && (
          <div className="space-y-1">
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-right text-muted-foreground">
              {progress}% complete
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full" variant="outline">
          <Link to={`/courses/${id}`} className="flex items-center justify-center">
            {progress === 0 ? "Start Course" : progress === 100 ? "Review Course" : "Continue Course"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
