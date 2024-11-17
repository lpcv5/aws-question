import { COLOR_STATES } from '../constants/colors';

export function NavigationButtons({
  currentQuestionIndex,
  questionsLength,
  previousQuestion,
  nextQuestion
}) {
  return (
    <div className="flex justify-between mt-6">
      <button
        onClick={previousQuestion}
        disabled={currentQuestionIndex === 0}
        className={`${
          currentQuestionIndex === 0
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-blue-600"
        } ${
          COLOR_STATES.BLUE_DARK
        } text-white px-4 py-2 rounded-md shadow transition duration-300 ease-in-out`}
      >
        上一题
      </button>
      <button
        onClick={nextQuestion}
        disabled={currentQuestionIndex === questionsLength - 1}
        className={`${
          currentQuestionIndex === questionsLength - 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-blue-600"
        } ${
          COLOR_STATES.BLUE_DARK
        } text-white px-4 py-2 rounded-md shadow transition duration-300 ease-in-out`}
      >
        下一题
      </button>
    </div>
  );
}