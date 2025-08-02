import React, { useState } from 'react';

type DragAndDropProps = {
  question: {
    text: string;
    options: string[];
    correctAnswer: string[];
  };
  selectedAnswers: string[];
  onAnswersChange: (answers: string[]) => void;
  answerState: 'idle' | 'correct' | 'incorrect';
};

const DragAndDrop: React.FC<DragAndDropProps> = ({
  question,
  selectedAnswers,
  onAnswersChange,
  answerState
}) => {
  const [availableOptions, setAvailableOptions] = useState(() => {
    // Filter out options that are already selected
    return question.options.filter(option => !selectedAnswers.includes(option));
  });


  const handleOptionClick = (option: string) => {
    if (answerState !== 'idle') return;
    
    if (selectedAnswers.includes(option)) {
      // Remove from selected and add to available
      const newSelected = selectedAnswers.filter(item => item !== option);
      setAvailableOptions([...availableOptions, option]);
      onAnswersChange(newSelected);
    } else {
      // Add to selected and remove from available
      const newAvailable = availableOptions.filter(item => item !== option);
      setAvailableOptions(newAvailable);
      onAnswersChange([...selectedAnswers, option]);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{question.text}</h3>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Your Answer:</h4>
        <div className="min-h-16 p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-2">
          {selectedAnswers.length === 0 ? (
            <p className="text-gray-400">Drag words here to form your answer</p>
          ) : (
            selectedAnswers.map((option, index) => (
              <div
                key={`selected-${index}`}
                onClick={() => handleOptionClick(option)}
                className={`px-3 py-1 rounded-md cursor-pointer ${
                  answerState === 'idle' 
                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                    : answerState === 'correct'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                }`}
              >
                {option}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Available Words:</h4>
        <div className="p-4 bg-white border border-gray-200 rounded-lg flex flex-wrap gap-2">
          {availableOptions.length === 0 ? (
            <p className="text-gray-400">No more words available</p>
          ) : (
            availableOptions.map((option, index) => (
              <div
                key={`available-${index}`}
                onClick={() => handleOptionClick(option)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200"
              >
                {option}
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Note: This is just a simplified version without actual drag and drop */}
      <p className="text-sm text-gray-500 mt-3">
        Click on words to move them between sections
      </p>
    </div>
  );
};

export default DragAndDrop;