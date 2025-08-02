import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center text-center">
      <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="text-yellow-500" size={32} />
      </div>
      <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-6 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
      >
        <Home size={18} />
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;