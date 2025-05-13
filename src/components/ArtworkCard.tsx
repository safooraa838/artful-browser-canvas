
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Artwork } from "@/utils/api";

interface ArtworkCardProps {
  artwork: Artwork;
}

const ArtworkCard = ({ artwork }: ArtworkCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <>
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-all duration-300">
        <div className="aspect-square w-full overflow-hidden">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
          />
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg line-clamp-1">{artwork.title}</CardTitle>
            <Badge variant={artwork.source === "api" ? "secondary" : "default"}>
              {artwork.source === "api" ? "Featured" : "Community"}
            </Badge>
          </div>
          <CardDescription>
            By {artwork.artist} • {artwork.year}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {artwork.description}
          </p>
        </CardContent>
        
        <CardFooter className="pt-0">
          <Button variant="outline" onClick={() => setShowDetails(true)} className="w-full">
            View Details
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{artwork.title}</DialogTitle>
            <DialogDescription>
              By {artwork.artist} • {artwork.year}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-square overflow-hidden rounded-md">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="object-cover w-full h-full"
              />
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">About this artwork</h3>
              <p className="text-muted-foreground mb-4">{artwork.description}</p>
              
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-medium w-24">Medium:</span>
                  <span>{artwork.medium}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">Year:</span>
                  <span>{artwork.year}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">Source:</span>
                  <span>{artwork.source === "api" ? "Featured Collection" : "Community Submission"}</span>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArtworkCard;
