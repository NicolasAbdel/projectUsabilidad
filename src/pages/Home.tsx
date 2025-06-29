import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sparkles, Star, Lock, Heart, Award } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { units } from '../data/units';

const Home = () => {
  const { progress } = useProgress();

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl overflow-hidden shadow-lg relative">
          <img
            src="https://images.pexels.com/photos/4778621/pexels-photo-4778621.jpeg"
            alt="Students learning together"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-20"
          />
          <div className="px-6 py-12 md:py-16 md:px-12 text-white relative">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Welcome to Quizzbe!
            </h1>
            <p className="text-lg md:text-xl mb-6 max-w-2xl">
              Learn English through fun, interactive lessons based on Interchange 2, 5th Edition. Master small talk, descriptions, and future plans!
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to={progress.lastUnlockedUnit ? `/unit/${progress.lastUnlockedUnit}` : '/unit/1'} 
                className="bg-white text-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {progress.lastUnlockedUnit ? 'Continue Learning' : 'Start Learning'}
              </Link>
              <Link 
                to="/profile" 
                className="bg-purple-700 bg-opacity-25 text-white border border-white border-opacity-30 px-6 py-3 rounded-lg font-semibold hover:bg-opacity-40 transition-colors"
              >
                View Progress
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-baseline mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Learning Units</h2>
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="text-yellow-500" size={16} />
            <span className="font-semibold text-gray-700">{progress.points} points</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {units.map((unit, index) => {
            const unitNumber = index + 1;
            const isUnlocked = unitNumber <= progress.unlockedUnits.length;
            const unitImages = {
              1: "https://images.pexels.com/photos/7516363/pexels-photo-7516363.jpeg",
              2: "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg",
              3: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
            };
            
            return (
              <div 
                key={unitNumber} 
                className={`rounded-xl overflow-hidden shadow-md border border-gray-100 ${isUnlocked ? 'bg-white' : 'bg-gray-50'}`}
              >
                <div className="relative h-48">
                  <img
                    src={unitImages[unitNumber as keyof typeof unitImages]}
                    alt={`Unit ${unitNumber}: ${unit.title}`}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 flex items-center justify-center ${
                    isUnlocked ? 'bg-purple-900 bg-opacity-40' : 'bg-gray-900 bg-opacity-60'
                  }`}>
                    {isUnlocked ? (
                      <BookOpen className="text-white" size={48} />
                    ) : (
                      <Lock className="text-gray-300" size={48} />
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">
                      {`Unit ${unitNumber}: ${unit.title}`}
                    </h3>
                    {isUnlocked && progress.completedUnits.includes(unitNumber) && (
                      <Star className="text-yellow-400 fill-yellow-400" size={20} />
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {isUnlocked ? unit.description : 'Complete previous units to unlock'}
                  </p>
                  
                  {/* Lesson Types Preview */}
                  {isUnlocked && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Quiz</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Video</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Audio</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    {isUnlocked ? (
                      <Link 
                        to={`/unit/${unitNumber}`}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        {progress.completedUnits.includes(unitNumber) ? 'Review' : 'Start'}
                      </Link>
                    ) : (
                      <span className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed">
                        Locked
                      </span>
                    )}
                    
                    {isUnlocked && (
                      <div className="flex items-center gap-1">
                        <div className="bg-gray-200 rounded-full h-2 w-24">
                          <div 
                            className="bg-purple-600 rounded-full h-2" 
                            style={{ width: `${(progress.unitProgress[unitNumber] || 0) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {Math.round((progress.unitProgress[unitNumber] || 0) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Learning Path Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Your Learning Path</h3>
          <p className="text-blue-700 mb-3">
            Each unit contains three types of lessons designed to enhance your English skills:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <BookOpen className="text-purple-600" size={20} />
              </div>
              <div>
                <h4 className="font-medium text-purple-800">Interactive Quiz</h4>
                <p className="text-sm text-purple-600">Multiple choice questions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="text-blue-600" size={20} />
              </div>
              <div>
                <h4 className="font-medium text-blue-800">Video Lesson</h4>
                <p className="text-sm text-blue-600">Watch and learn</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <BookOpen className="text-green-600" size={20} />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Audio Practice</h4>
                <p className="text-sm text-green-600">Listen and repeat</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;