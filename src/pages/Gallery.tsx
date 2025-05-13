
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchMultipleArtworks, Artwork } from "@/utils/api";
import { getSubmittedArtworks } from "@/utils/storage";
import Layout from "@/components/layout/Layout";
import ArtworkCard from "@/components/ArtworkCard";

const Gallery = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [userArtworks, setUserArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const loadArtworks = async () => {
      setLoading(true);
      try {
        // Fetch API artworks
        const apiArtworks = await fetchMultipleArtworks(12);
        
        // Get user-submitted artworks
        const submitted = getSubmittedArtworks();
        
        setArtworks(apiArtworks);
        setUserArtworks(submitted);
      } catch (error) {
        console.error("Error loading artworks:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadArtworks();
  }, []);

  // Filter artworks based on search query
  const filteredApiArtworks = artworks.filter(
    artwork =>
      artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.medium.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredUserArtworks = userArtworks.filter(
    artwork =>
      artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.medium.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Combine all artworks for "All" tab
  const allArtworks = [...filteredApiArtworks, ...filteredUserArtworks];

  // Loading skeleton
  const renderSkeletons = () => {
    return Array(8)
      .fill(0)
      .map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <Skeleton className="h-[300px] w-full" />
          <CardContent className="p-4">
            <Skeleton className="h-4 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col mb-8">
          <h1 className="text-3xl font-bold mb-6">Art Gallery</h1>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center">
            <Input
              placeholder="Search artworks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="all">All Artworks</TabsTrigger>
                <TabsTrigger value="api">Featured Collection</TabsTrigger>
                <TabsTrigger value="user">Community Submissions</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="mb-4">
            <p className="text-muted-foreground">
              {activeTab === "all" 
                ? `Showing ${allArtworks.length} artworks`
                : activeTab === "api" 
                  ? `Showing ${filteredApiArtworks.length} featured artworks`
                  : `Showing ${filteredUserArtworks.length} community submissions`
              }
            </p>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {renderSkeletons()}
            </div>
          ) : allArtworks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allArtworks.map(artwork => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium">No artworks found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search criteria</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="api" className="mt-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {renderSkeletons()}
            </div>
          ) : filteredApiArtworks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredApiArtworks.map(artwork => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium">No featured artworks found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search criteria</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="user" className="mt-0">
          {filteredUserArtworks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredUserArtworks.map(artwork => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium">No community submissions yet</h3>
              <p className="text-muted-foreground mt-2 mb-4">Be the first to share your artwork!</p>
              <Button asChild>
                <a href="/submit">Submit Artwork</a>
              </Button>
            </div>
          )}
        </TabsContent>
      </div>
    </Layout>
  );
};

export default Gallery;
