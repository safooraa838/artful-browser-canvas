
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="text-2xl font-bold text-primary">ArtGallery</Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
          <Link to="/gallery" className="text-foreground hover:text-primary transition-colors">Gallery</Link>
          <Link to="/submit" className="text-foreground hover:text-primary transition-colors">Submit Art</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm hidden md:inline-block">Welcome, {user.username}</span>
              <Button variant="outline" onClick={logout}>Logout</Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
