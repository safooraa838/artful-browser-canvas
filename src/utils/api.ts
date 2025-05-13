
// Metropolitan Museum of Art API
// Documentation: https://metmuseum.github.io/

// Types for artwork data
export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: string;
  medium: string;
  description: string;
  imageUrl: string;
  source: "api" | "user";
  userId?: string;
}

// Function to fetch a list of artwork IDs from a department
export const fetchArtworkIds = async (departmentId = 11): Promise<number[]> => {
  try {
    const response = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${departmentId}`
    );
    const data = await response.json();
    return data.objectIDs.slice(0, 100); // Limit to first 100 for performance
  } catch (error) {
    console.error("Error fetching artwork IDs:", error);
    return [];
  }
};

// Function to fetch details for a single artwork
export const fetchArtworkDetails = async (id: number): Promise<Artwork | null> => {
  try {
    const response = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
    );
    const data = await response.json();
    
    // Only return items with images and required fields
    if (
      data.primaryImage &&
      data.title &&
      (data.artistDisplayName || data.culture)
    ) {
      return {
        id: data.objectID.toString(),
        title: data.title,
        artist: data.artistDisplayName || data.culture,
        year: data.objectDate || "Unknown",
        medium: data.medium || "Unknown medium",
        description: data.objectDescription || data.objectName || "No description available",
        imageUrl: data.primaryImage,
        source: "api"
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching artwork ${id}:`, error);
    return null;
  }
};

// Function to fetch multiple artwork details
export const fetchMultipleArtworks = async (count = 8): Promise<Artwork[]> => {
  // First get the IDs from the Medieval Art department (id=11)
  const ids = await fetchArtworkIds();
  if (!ids.length) return [];
  
  // Shuffle the array to get random artworks
  const shuffledIds = ids.sort(() => 0.5 - Math.random());
  
  // Take the first 'count' IDs
  const selectedIds = shuffledIds.slice(0, count);
  
  // Fetch details for each ID
  const artworkPromises = selectedIds.map(id => fetchArtworkDetails(id));
  const artworks = await Promise.all(artworkPromises);
  
  // Filter out null results
  return artworks.filter(Boolean) as Artwork[];
};
