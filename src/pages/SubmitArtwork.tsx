
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { saveArtwork, fileToDataUrl } from "@/utils/storage";
import Layout from "@/components/layout/Layout";
import { Artwork } from "@/utils/api";

const SubmitArtwork = () => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [year, setYear] = useState("");
  const [medium, setMedium] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to submit artwork",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (!file) {
      toast({
        title: "Image required",
        description: "Please select an image of your artwork",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Convert file to data URL
      const imageUrl = await fileToDataUrl(file);
      
      // Create artwork object
      const newArtwork: Artwork = {
        id: crypto.randomUUID(),
        title,
        artist,
        year,
        medium,
        description,
        imageUrl,
        source: "user",
        userId: user.id,
      };
      
      // Save to local storage
      saveArtwork(newArtwork);
      
      toast({
        title: "Artwork submitted",
        description: "Your artwork has been successfully added to the gallery",
      });
      
      navigate("/gallery");
    } catch (error) {
      console.error("Error submitting artwork:", error);
      toast({
        title: "Submission failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                You need to be logged in to submit artwork.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate("/login")}>Go to Login</Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Submit Your Artwork</CardTitle>
            <CardDescription>
              Share your creation with the art community
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Artwork Title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="artist" className="text-sm font-medium">Artist Name</label>
                <Input
                  id="artist"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Your name or pseudonym"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="year" className="text-sm font-medium">Year Created</label>
                  <Input
                    id="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g., 2023"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="medium" className="text-sm font-medium">Medium</label>
                  <Select onValueChange={setMedium} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select medium" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Oil paint">Oil paint</SelectItem>
                      <SelectItem value="Acrylic paint">Acrylic paint</SelectItem>
                      <SelectItem value="Watercolor">Watercolor</SelectItem>
                      <SelectItem value="Digital">Digital</SelectItem>
                      <SelectItem value="Mixed media">Mixed media</SelectItem>
                      <SelectItem value="Photography">Photography</SelectItem>
                      <SelectItem value="Sculpture">Sculpture</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about your artwork..."
                  rows={4}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="image" className="text-sm font-medium">Artwork Image</label>
                <Input
                  id="image"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                />
                {file && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Selected file: {file.name}
                  </p>
                )}
              </div>
            </CardContent>
            
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Artwork"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default SubmitArtwork;
