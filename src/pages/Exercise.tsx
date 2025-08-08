import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart, CheckCircle, X, ArrowRight } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { exercises } from '../data/exercises';
import MultipleChoice from '../components/exercises/MultipleChoice';
import FillInTheBlank from '../components/exercises/FillInTheBlank';
import DragAndDrop from '../components/exercises/DragAndDrop';
import VideoLesson from '../components/exercises/VideoLesson';
import AudioPlayer from '../components/exercises/AudioPlayer';

type AnswerState = 'idle' | 'correct' | 'incorrect';

const Exercise = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const { progress, updateProgress, completeExercise, completeLessons, loseLife } = useProgress();
  
  const [currentExercise, setCurrentExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>('');
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showVideoLesson, setShowVideoLesson] = useState(false);

  const getUnitNumber = () => {
    if (!exerciseId) return '';
    const parts = exerciseId.split('-');
    return parts[0];
  };

  useEffect(() => {
    if (!exerciseId) {
      navigate('/');
      return;
    }

    const exercise = exercises.find(ex => ex.id === exerciseId);
    
    if (!exercise) {
      navigate('/');
      return;
    }

    setCurrentExercise(exercise);
    
    // Check if this is a video lesson only
    if (exercise.type === 'video') {
      setShowVideoLesson(true);
    }
    
    setLoading(false);
  }, [exerciseId, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!currentExercise) {
    return null;
  }

  const handleVideoComplete = () => {
    setShowVideoLesson(false);
  };

  // Show video lesson first for video types only
  if (showVideoLesson && currentExercise.type === 'video') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Link to={`/unit/${getUnitNumber()}`} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold">{currentExercise.title}</h1>
        </div>
        
        <VideoLesson
          title={currentExercise.title}
          description={currentExercise.description}
          videoUrl={currentExercise.videoUrl}
          isAudioOnly={false}
          onComplete={handleVideoComplete}
        />
      </div>
    );
  }

  const currentQuestion = currentExercise.questions[currentQuestionIndex];

  const handleAnswer = (answer: string | string[]) => {
    setSelectedAnswer(answer);
    // Only auto-check for multiple choice questions
    if (currentQuestion.type === 'multiple-choice') {
      setTimeout(() => {
        checkAnswer(answer);
      }, 500); // Increased delay to ensure state is updated
    }
  };

  const checkAnswer = (answer?: string | string[]) => {
    if (answerState !== 'idle') return;
    
    const answerToCheck = answer || selectedAnswer;
    
    let isCorrect = false;
    
    if (Array.isArray(currentQuestion.correctAnswer)) {
      isCorrect = Array.isArray(answerToCheck) && 
        answerToCheck.length === currentQuestion.correctAnswer.length && 
        answerToCheck.every(item => currentQuestion.correctAnswer.includes(item));
    } else {
      // Normalizar las cadenas para comparación
      const normalizedSelected = String(answerToCheck).trim().toLowerCase();
      const normalizedCorrect = String(currentQuestion.correctAnswer).trim().toLowerCase();
      isCorrect = normalizedSelected === normalizedCorrect;
    }
    
    if (isCorrect) {
      setAnswerState('correct');
      setScore(score + 10);
      updateProgress(10);
    } else {
      setAnswerState('incorrect');
      loseLife();
    }
    
    // Only auto-advance for multiple choice questions
    if (currentQuestion.type === 'multiple-choice') {
      setTimeout(() => {
        goToNextQuestion();
      }, 2000); // 2 seconds to show the result
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < currentExercise.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setAnswerState('idle');
    } else {
      setIsCompleted(true);
      if (exerciseId) {
        completeExercise(exerciseId);
        
        if (exerciseId.includes('-lesson-')) {
          completeLessons(exerciseId);
        }
      }
    }
  };

  const renderExerciseComponent = () => {
    switch (currentQuestion.type) {
      case 'multiple-choice':
        return (
          <MultipleChoice 
            question={currentQuestion}
            selectedAnswer={selectedAnswer as string}
            onSelectAnswer={handleAnswer}
            answerState={answerState}
          />
        );
      case 'fill-in-the-blank':
        return (
          <FillInTheBlank 
            question={currentQuestion}
            answer={selectedAnswer as string}
            onAnswerChange={handleAnswer}
            answerState={answerState}
          />
        );
      case 'drag-and-drop':
        return (
          <DragAndDrop 
            question={currentQuestion}
            selectedAnswers={selectedAnswer as string[]}
            onAnswersChange={handleAnswer}
            answerState={answerState}
          />
        );
      default:
        return <div>Unknown exercise type</div>;
    }
  };

  if (isCompleted) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <img
            src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg"
            alt="Achievement celebration"
            className="w-32 h-32 mx-auto rounded-full object-cover mb-6"
          />
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="text-green-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Great job!</h2>
          <p className="text-gray-600 mb-6">
            You've completed this {currentExercise.type === 'video' ? 'video lesson' : 
                                   currentExercise.type === 'audio' ? 'audio lesson' : 'exercise'} 
            {score > 0 && ` with a score of ${score} points`}!
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to={`/unit/${getUnitNumber()}`}
              className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Unit
            </Link>
            <Link
              to="/"
              className="px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/unit/${getUnitNumber()}`} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold">{currentExercise.title}</h1>
        </div>
        <div className="flex items-center gap-1">
          <Heart className="text-red-500" size={18} />
          <span className="font-semibold">{progress.lives}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="bg-purple-600 px-6 py-3 text-white">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Progress</h2>
            <span className="text-sm">Question {currentQuestionIndex + 1} of {currentExercise.questions.length}</span>
          </div>
          <div className="w-full bg-purple-700 rounded-full h-2 mt-2">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex) / currentExercise.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="p-6">
          {/* Audio Player for audio exercises */}
          {currentExercise.type === 'audio' && (
            <div className="mb-8">
              <AudioPlayer
                title={currentExercise.title}
                description={currentExercise.description}
                videoUrl={currentExercise.videoUrl}
              />
            </div>
          )}

          {/* Questions Section */}
          <div className={`${currentExercise.type === 'audio' ? 'border-t border-gray-200 pt-6' : ''}`}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {currentExercise.type === 'audio' ? '📝 Answer the questions based on the audio:' : 'Questions'}
              </h3>
            </div>
            {renderExerciseComponent()}
          </div>

          <div className="mt-8">
            {answerState === 'idle' && currentQuestion.type === 'fill-in-the-blank' && (
              <button
                onClick={() => checkAnswer()}
                className="w-full py-3 rounded-lg font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                Check Answer
              </button>
            )}
            {answerState !== 'idle' && (
              <div>
                <div className={`p-4 rounded-lg mb-4 flex items-center gap-3 ${
                  answerState === 'correct' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {answerState === 'correct' ? (
                    <>
                      <img
                        src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
                        alt="Success"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-green-800">Correct!</p>
                        <p className="text-sm text-green-700">+10 points</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src="https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg"
                        alt="Try again"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-red-800">Not quite right</p>
                        <p className="text-sm text-red-700">
                          The correct answer is: {Array.isArray(currentQuestion.correctAnswer) 
                            ? currentQuestion.correctAnswer.join(', ') 
                            : currentQuestion.correctAnswer}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                
                {currentQuestion.type === 'multiple-choice' ? (
                  <div className="text-center text-sm text-gray-600">
                    {currentQuestionIndex < currentExercise.questions.length - 1 ? (
                      <>Moving to next question in 2 seconds...</>
                    ) : (
                      <>Completing exercise in 2 seconds...</>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={goToNextQuestion}
                    className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    {currentQuestionIndex < currentExercise.questions.length - 1 ? (
                      <>Next Question <ArrowRight size={18} /></>
                    ) : (
                      'Complete Exercise'
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exercise;