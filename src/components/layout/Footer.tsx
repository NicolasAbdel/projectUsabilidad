import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-purple-700">Quizzbe</span>
            <span className="text-sm text-gray-500">© {new Date().getFullYear()}</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-purple-600 transition-colors">About</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Help</a>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span>Made for Group 2</span>
            <Heart size={14} className="text-red-500 fill-red-500" />
            <span>for learning</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;