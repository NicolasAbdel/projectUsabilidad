import React from 'react';

type FillInTheBlankProps = {
  question: {
    text: string;
    correctAnswer: string;
  };
  answer: string;
  onAnswerChange: (answer: string) => void;
  answerState: 'idle' | 'correct' | 'incorrect';
};

const FillInTheBlank: React.FC<FillInTheBlankProps> = ({
  question,
  answer,
  onAnswerChange,
  answerState
}) => {
  // Split the text by the ___ placeholder
  const parts = question.text.split('___');
  
  let inputBorderClass = 'border-gray-300 focus:border-purple-500 focus:ring-purple-500';
  if (answerState === 'correct') {
    inputBorderClass = 'border-green-500 focus:border-green-500 focus:ring-green-500';
  } else if (answerState === 'incorrect') {
    inputBorderClass = 'border-red-500 focus:border-red-500 focus:ring-red-500';
  }
  
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Fill in the blank</h3>
      <div className="text-lg mb-6">
        {parts[0]}
        <input
          type="text"
          value={answer}
          onChange={(e) => answerState === 'idle' && onAnswerChange(e.target.value)}
          disabled={answerState !== 'idle'}
          className={`inline-block mx-1 px-2 py-1 border ${inputBorderClass} rounded focus:outline-none focus:ring-2 w-32 text-center`}
          placeholder="Type here"
        />
        {parts[1]}
      </div>
    </div>
  );
};

export default FillInTheBlank;