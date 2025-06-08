import React, { useState } from 'react';
import { Loader2 } from 'lucide-react'; // Make sure you're importing this from the correct package
import { useNavigate } from 'react-router-dom';
export default function AdminGallery() {
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();
  const handleClick = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate('/auth/login');
    }, 3000);
    
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h1>Gallery</h1>
      <button
        onClick={handleClick}
        className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
      >
        Show Loading
      </button>
    </div>
  );
}
