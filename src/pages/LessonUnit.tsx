import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, CheckCircle, BookOpen, Play, Video, Volume2 } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { units } from '../data/units';

const LessonUnit = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  const { progress, updateUnitProgress } = useProgress();
  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!unitId) {
      navigate('/');
      return;
    }

    const unitNumber = parseInt(unitId);
    if (isNaN(unitNumber) || unitNumber < 1 || unitNumber > units.length) {
      navigate('/');
      return;
    }

    // Check if unit is unlocked
    if (unitNumber > progress.unlockedUnits.length) {
      navigate('/');
      return;
    }

    setUnit(units[unitNumber - 1]);
    setLoading(false);
  }, [unitId, navigate, progress.unlockedUnits]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!unit) {
    return null;
  }

  const unitNumber = parseInt(unitId || '0');
  const unitProgress = progress.unitProgress[unitNumber] || 0;

  const getLessonIcon = (lessonType: string) => {
    switch (lessonType) {
      case 'multiple-choice':
        return <BookOpen className="text-purple-600" size={20} />;
      case 'video':
        return <Video className="text-blue-600" size={20} />;
      case 'audio':
        return <Volume2 className="text-green-600" size={20} />;
      default:
        return <BookOpen className="text-purple-600" size={20} />;
    }
  };

  const getLessonBgColor = (lessonType: string) => {
    switch (lessonType) {
      case 'multiple-choice':
        return 'bg-purple-100';
      case 'video':
        return 'bg-blue-100';
      case 'audio':
        return 'bg-green-100';
      default:
        return 'bg-purple-100';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Link to="/" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Unit {unitId}: {unit.title}</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="bg-purple-600 px-6 py-5 text-white">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Your Progress</h2>
            <span className="text-sm">{Math.round(unitProgress * 100)}% complete</span>
          </div>
          <div className="w-full bg-purple-700 rounded-full h-2 mt-2">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${unitProgress * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-4">{unit.description}</p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              <BookOpen size={14} />
              <span>{unit.lessons.length} lessons</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              <Play size={14} />
              <span>{unit.exercises.length} exercises</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Lessons</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {unit.lessons.map((lesson: any, index: number) => {
            const lessonId = `${unitNumber}-lesson-${index + 1}`;
            const isCompleted = progress.completedLessons.includes(lessonId);
            
            return (
              <div key={index} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-center mb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-100' : getLessonBgColor(lesson.type)
                  } mb-3`}>
                    {isCompleted ? (
                      <CheckCircle className="text-green-600" size={28} />
                    ) : (
                      getLessonIcon(lesson.type)
                    )}
                  </div>
                  <div className="mb-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      lesson.type === 'multiple-choice' ? 'bg-purple-100 text-purple-700' :
                      lesson.type === 'video' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {lesson.type === 'multiple-choice' ? 'Interactive Quiz' :
                       lesson.type === 'video' ? 'Video Lesson' : 'Audio Practice'}
                    </span>
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="font-semibold mb-2 text-lg">
                    Lesson {index + 1}
                  </h3>
                  <h4 className="font-medium mb-2 text-gray-800">
                    {lesson.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {lesson.description}
                  </p>
                  
                  {/* Special indicators for video/audio lessons */}
                  {lesson.type === 'video' && (
                    <div className="mb-3 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      📹 Video URL: {lesson.videoUrl}
                    </div>
                  )}
                  {lesson.type === 'audio' && (
                    <div className="mb-3 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      🎵 Audio URL: {lesson.videoUrl}
                    </div>
                  )}
                  
                  <Link
                    to={`/exercise/${lessonId}`}
                    className={`inline-block text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
                      isCompleted 
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                        : lesson.type === 'multiple-choice' ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : lesson.type === 'video' ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {isCompleted ? 'Review' : 'Start'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Practice Exercises</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {unit.exercises.map((exercise: any, index: number) => {
            const exerciseId = `${unitNumber}-exercise-${index + 1}`;
            const isCompleted = progress.completedExercises.includes(exerciseId);
            // Exercises are unlocked sequentially
            const isUnlocked = index === 0 || progress.completedExercises.includes(`${unitNumber}-exercise-${index}`);
            
            return (
              <div 
                key={index} 
                className={`bg-white p-4 rounded-lg shadow-sm border ${
                  isUnlocked ? 'border-gray-100' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="text-center mb-3">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-100' : isUnlocked ? 'bg-purple-100' : 'bg-gray-200'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="text-green-600" size={24} />
                    ) : isUnlocked ? (
                      <Play className="text-purple-600" size={24} />
                    ) : (
                      <Lock className="text-gray-400" size={24} />
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-center mb-1">
                  {exercise.title}
                </h3>
                <p className="text-sm text-gray-600 text-center mb-3">
                  {isUnlocked ? exercise.description : 'Complete previous exercises to unlock'}
                </p>
                <div className="text-center">
                  {isUnlocked ? (
                    <Link
                      to={`/exercise/${exerciseId}`}
                      className={`inline-block text-sm px-4 py-2 rounded ${
                        isCompleted 
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      } transition-colors`}
                    >
                      {isCompleted ? 'Practice Again' : 'Start Practice'}
                    </Link>
                  ) : (
                    <span className="inline-block text-sm px-4 py-2 bg-gray-200 text-gray-500 rounded cursor-not-allowed">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LessonUnit;