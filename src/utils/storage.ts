
import { Artwork } from "./api";

// Save submitted artwork to local storage
export const saveArtwork = (artwork: Artwork): void => {
  // Get existing artworks
  const existingArtworks = getSubmittedArtworks();
  
  // Add new artwork to array
  existingArtworks.push(artwork);
  
  // Save back to localStorage
  localStorage.setItem("user_submitted_artworks", JSON.stringify(existingArtworks));
};

// Get all submitted artworks from local storage
export const getSubmittedArtworks = (): Artwork[] => {
  const stored = localStorage.getItem("user_submitted_artworks");
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error parsing stored artworks:", error);
    return [];
  }
};

// Function to convert a File to a data URL for storage
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Get all artworks (both API-fetched and user-submitted)
export const getAllArtworks = async (): Promise<Artwork[]> => {
  // First get user-submitted artworks
  const userArtworks = getSubmittedArtworks();
  
  // Return the combined array
  return userArtworks;
};
