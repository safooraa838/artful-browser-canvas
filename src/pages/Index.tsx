
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchMultipleArtworks, Artwork } from "@/utils/api";
import { getSubmittedArtworks } from "@/utils/storage";
import Layout from "@/components/layout/Layout";
import ArtworkCard from "@/components/ArtworkCard";

const Index = () => {
  const [featuredArtworks, setFeaturedArtworks] = useState<Artwork[]>([]);
  const [communityArtworks, setCommunityArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArtworks = async () => {
      setLoading(true);
      try {
        // Fetch featured artworks from API
        const apiArtworks = await fetchMultipleArtworks(4);
        setFeaturedArtworks(apiArtworks);
        
        // Get community artworks
        const userArtworks = getSubmittedArtworks();
        setCommunityArtworks(userArtworks.slice(0, 4)); // Show up to 4 community artworks
      } catch (error) {
        console.error("Error loading artworks:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadArtworks();
  }, []);

  // Loading skeleton
  const renderSkeletons = (count: number) => {
    return Array(count)
      .fill(0)
      .map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <Skeleton className="h-[300px] w-full" />
          <div className="p-4">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </Card>
      ));
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-24 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Discover & Share Beautiful Artwork
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Explore curated collections from renowned museums and community artists in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Link to="/gallery">Browse Gallery</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/submit">Submit Your Art</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Collection</h2>
            <Button variant="outline" asChild>
              <Link to="/gallery">View All</Link>
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {renderSkeletons(4)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredArtworks.map(artwork => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Community Submissions */}
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Community Submissions</h2>
            <Button variant="outline" asChild>
              <Link to="/gallery?tab=user">View All</Link>
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {renderSkeletons(4)}
            </div>
          ) : communityArtworks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {communityArtworks.map(artwork => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-4">No community submissions yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to share your artwork with our community!
              </p>
              <Button asChild>
                <Link to="/submit">Submit Your Artwork</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center">About Our Gallery</h2>
          <div className="prose prose-lg mx-auto">
            <p className="mb-4">
              Our gallery showcases beautiful artwork from both the Metropolitan Museum of Art's 
              collection and our growing community of artists. We believe in making art accessible 
              to everyone and providing a platform for emerging artists to share their work.
            </p>
            <p>
              Create an account to submit your own artwork, interact with the community, 
              and keep track of your favorite pieces. All data is stored locally in your 
              browser for a seamless, privacy-respecting experience.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
