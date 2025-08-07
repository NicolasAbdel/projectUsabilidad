import { CheckCircle, XCircle } from 'lucide-react';
import { useSound } from '../../hooks/useSound';
import { useEffect } from 'react';

type MultipleChoiceProps = {
  question: {
    text: string;
    options: string[];
    correctAnswer: string;
  };
  selectedAnswer: string;
  onSelectAnswer: (answer: string) => void;
  answerState: 'idle' | 'correct' | 'incorrect';
};

const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  answerState
}) => {
  const { playSuccess, playError } = useSound();

  // Reproducir sonido cuando cambia el estado de la respuesta
  useEffect(() => {
    if (answerState === 'correct') {
      playSuccess();
    } else if (answerState === 'incorrect') {
      playError();
    }
  }, [answerState, playSuccess, playError]);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{question.text}</h3>
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = question.correctAnswer === option;
          
          let optionClass = "border border-gray-200 p-4 rounded-lg cursor-pointer transition-all";
          
          if (answerState === 'idle') {
            optionClass += isSelected 
              ? " border-purple-500 bg-purple-50" 
              : " hover:border-gray-300";
          } else {
            if (isCorrect) {
              optionClass += " border-green-500 bg-green-50";
            } else if (isSelected && !isCorrect) {
              optionClass += " border-red-500 bg-red-50";
            }
          }
          
          return (
            <div 
              key={index}
              className={optionClass}
              onClick={() => answerState === 'idle' && onSelectAnswer(option)}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {answerState !== 'idle' && (
                  <>
                    {isCorrect ? (
                      <CheckCircle className="text-green-500\" size={20} />
                    ) : (isSelected && !isCorrect) ? (
                      <XCircle className="text-red-500" size={20} />
                    ) : null}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MultipleChoice;