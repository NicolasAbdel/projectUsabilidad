import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Heart, Star, Sparkles, Trophy, BookOpen, Activity, LogOut } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useProgress } from '../context/ProgressContext';
import { units } from '../data/units';

const Profile = () => {
  const { user, login, logout } = useUser();
  const { progress, resetProgress } = useProgress();

  const handleSignOut = () => {
    logout();
    resetProgress();
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
          <p className="text-gray-600 mb-6 text-center">
            Sign in to track your progress and access all lessons
          </p>
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            <button
              type="button"
              onClick={() => login({ name: 'Student', email: 'student@example.com' })}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Sign In
            </button>
            <div className="text-center text-sm text-gray-500">
              <p>Demo mode: Just click Sign In to continue</p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const totalCompletedLessons = progress.completedLessons.length;
  const totalCompletedExercises = progress.completedExercises.length;
  const totalCompletedUnits = progress.completedUnits.length;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
              <Trophy className="text-purple-600" size={24} />
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold text-purple-600">{progress.points}</h2>
              <p className="text-sm text-gray-500">Total Points</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Sparkles className="text-yellow-500" size={14} />
            <span className="text-gray-600">Keep learning to earn more points!</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <Star className="text-green-600" size={24} />
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold text-green-600">{totalCompletedUnits}</h2>
              <p className="text-sm text-gray-500">Units Completed</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <BookOpen className="text-green-600" size={14} />
            <span className="text-gray-600">{units.length - totalCompletedUnits} units remaining</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="text-red-600" size={24} />
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold text-red-600">{progress.lives}</h2>
              <p className="text-sm text-gray-500">Lives Remaining</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Activity className="text-red-600" size={14} />
            <span className="text-gray-600">Lives refill every 24 hours</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="text-yellow-500" size={20} />
            Achievements
          </h2>
          <div className="space-y-4">
            {[
              { 
                title: "First Steps", 
                description: "Complete your first lesson", 
                progress: totalCompletedLessons > 0 ? 1 : 0, 
                total: 1,
                isCompleted: totalCompletedLessons > 0
              },
              { 
                title: "Getting Started", 
                description: "Complete 5 lessons", 
                progress: Math.min(totalCompletedLessons, 5), 
                total: 5,
                isCompleted: totalCompletedLessons >= 5
              },
              { 
                title: "Practice Makes Perfect", 
                description: "Complete 10 practice exercises", 
                progress: Math.min(totalCompletedExercises, 10), 
                total: 10,
                isCompleted: totalCompletedExercises >= 10
              },
              { 
                title: "Unit Master", 
                description: "Complete all lessons in a unit", 
                progress: totalCompletedUnits, 
                total: 1,
                isCompleted: totalCompletedUnits > 0
              },
              { 
                title: "Point Collector", 
                description: "Earn 500 points", 
                progress: Math.min(progress.points, 500), 
                total: 500,
                isCompleted: progress.points >= 500
              }
            ].map((achievement, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  achievement.isCompleted ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  {achievement.isCompleted ? (
                    <Trophy className="text-yellow-500" size={20} />
                  ) : (
                    <Trophy className="text-gray-400" size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold">{achievement.title}</h3>
                    <span className="text-sm text-gray-500">
                      {achievement.progress}/{achievement.total}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{achievement.description}</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-yellow-500 h-1.5 rounded-full" 
                      style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="text-purple-600" size={20} />
            Learning Stats
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Lessons Completed</p>
              <p className="text-2xl font-bold">{totalCompletedLessons}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Exercises Completed</p>
              <p className="text-2xl font-bold">{totalCompletedExercises}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Current Streak</p>
              <p className="text-2xl font-bold">3 days</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Best Streak</p>
              <p className="text-2xl font-bold">5 days</p>
            </div>
          </div>
          
          <h3 className="font-semibold mb-3">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: "Completed lesson", item: "Describing people", time: "2 hours ago" },
              { action: "Earned achievement", item: "First Steps", time: "Yesterday" },
              { action: "Completed exercise", item: "Personality traits vocabulary", time: "Yesterday" }
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                  <BookOpen className="text-purple-600" size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium">{activity.action}: <span className="font-normal">{activity.item}</span></p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Link 
          to="/"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          Continue Learning
        </Link>
      </div>
    </div>
  );
};

export default Profile;