
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-muted py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">ArtGallery</h3>
            <p className="text-muted-foreground">
              A platform for discovering and sharing beautiful artwork
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-muted-foreground hover:text-primary transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/submit" className="text-muted-foreground hover:text-primary transition-colors">
                  Submit Art
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">About</h3>
            <p className="text-muted-foreground">
              This gallery showcases both curated works from public collections and 
              original submissions from our community of artists.
            </p>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ArtGallery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
