
import { useState } from "react";
import { ContentItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, ExternalLink, FileText, Play, Link as LinkIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CourseContentProps {
  contentItem: ContentItem;
  onComplete: (contentId: string) => void;
}

const CourseContent = ({ contentItem, onComplete }: CourseContentProps) => {
  const [isReading, setIsReading] = useState(false);
  
  const handleMarkComplete = () => {
    onComplete(contentItem.id);
  };

  const renderContentByType = () => {
    switch (contentItem.type) {
      case "text":
        return (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: contentItem.content }} />
          </div>
        );
      
      case "pdf":
        return (
          <div className="space-y-4">
            <div className="aspect-[4/3] w-full border rounded">
              <iframe 
                src={contentItem.content} 
                className="w-full h-full" 
                title={contentItem.title}
              />
            </div>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={() => window.open(contentItem.content, "_blank")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Open PDF in new tab
            </Button>
          </div>
        );
      
      case "document":
        return (
          <div className="space-y-4">
            <div className="aspect-[4/3] w-full border rounded">
              <iframe 
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(contentItem.content)}&embedded=true`}
                className="w-full h-full" 
                title={contentItem.title}
              />
            </div>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={() => window.open(contentItem.content, "_blank")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Open document in new tab
            </Button>
          </div>
        );
      
      case "video":
        return (
          <div className="space-y-4">
            <div className="aspect-video w-full">
              <iframe 
                src={contentItem.content}
                className="w-full h-full border rounded" 
                title={contentItem.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={() => window.open(contentItem.content, "_blank")}
            >
              <Play className="mr-2 h-4 w-4" />
              Open video in new tab
            </Button>
          </div>
        );
        
      case "link":
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center p-4 text-center">
                  <LinkIcon className="h-12 w-12 text-lms-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{contentItem.title}</h3>
                  <p className="text-muted-foreground mb-6">
                    This content is hosted on an external website. Click the button below to access it.
                  </p>
                  <Button 
                    onClick={() => {
                      window.open(contentItem.content, "_blank");
                      setIsReading(true);
                    }}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open External Resource
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return <div>Unsupported content type</div>;
    }
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{contentItem.title}</h2>
      
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="py-4">
          {renderContentByType()}
        </TabsContent>
        <TabsContent value="notes" className="py-4">
          <div className="border rounded-md p-4 min-h-[300px]">
            <textarea 
              className="w-full h-full min-h-[250px] bg-transparent outline-none resize-none" 
              placeholder="Take notes here..."
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <Separator className="my-6" />
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {contentItem.completed ? "Completed" : isReading ? "In progress" : "Not started"} 
        </p>
        <Button
          onClick={handleMarkComplete}
          disabled={contentItem.completed}
          variant={contentItem.completed ? "outline" : "default"}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          {contentItem.completed ? "Completed" : "Mark as Complete"}
        </Button>
      </div>
    </div>
  );
};

export default CourseContent;
