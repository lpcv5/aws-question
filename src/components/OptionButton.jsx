import React from "react";
import { COLOR_STATES } from "../constants/colors";

export function OptionButton({
  optionKey,
  value,
  currentQuestion,
  quizState,
  shouldShowAnswer,
  handleOptionSelect,
}) {
  const isSelected = quizState[currentQuestion.id] === optionKey;
  const isCorrectAnswer = optionKey === currentQuestion.correctAnswer;
  const isWrongAnswer = shouldShowAnswer && isSelected && !isCorrectAnswer;

  const getButtonColor = () => {
    if (!shouldShowAnswer) {
      return isSelected ? COLOR_STATES.BLUE_DARK : COLOR_STATES.GRAY;
    }

    if (isCorrectAnswer) {
      return COLOR_STATES.GREEN;
    }

    if (isWrongAnswer) {
      return COLOR_STATES.RED;
    }

    return COLOR_STATES.GRAY;
  };

  const getHoverEffect = () => {
    if (shouldShowAnswer) return "";
    return `hover:bg-${isSelected ? "blue-600" : "gray-600"}`;
  };

  return (
    <button
      onClick={() => handleOptionSelect(currentQuestion.id, optionKey)}
      disabled={shouldShowAnswer}
      className={`
        ${getButtonColor()}
        ${getHoverEffect()}
        w-full 
        px-4 
        py-2 
        text-left
        rounded-md 
        shadow 
        transition 
        duration-300 
        ease-in-out 
        mb-2
        ${shouldShowAnswer ? "cursor-not-allowed" : ""}
      `}
    >
      <div className="flex">
        <span className="w-7">{optionKey}.</span>
        <span className="flex-1">{value}</span>
      </div>
    </button>
  );
}
