import useQuizStore from "../stores/quizStore";
import { COLOR_STATES } from "../constants/colors";
import { getColorState } from "../utils/colorUtils";

const AnswerCard = () => {
  const {
    questions,
    currentQuestionIndex,
    answeredQuestions,
    navigateQuestion,
  } = useQuizStore();

  return (
    <div className="fixed top-16 right-4 w-72 bg-white p-4 rounded-lg shadow-lg overflow-y-auto max-h-[calc(100vh-5rem)] z-20 border border-gray-200">
      <h3 className="text-lg font-bold mb-3 text-gray-800">答题卡</h3>
      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, index) => {
          const answered = answeredQuestions[q.no];
          const isCurrent = currentQuestionIndex === index;
          const bgColor = getColorState(answered, q.best);
          const hasAnswered = answered && answered.length > 0;
          const colorClass = hasAnswered ? bgColor : COLOR_STATES.GREY;

          return (
            <button
              key={q.no}
              onClick={() => navigateQuestion(index)}
              className={`p-2 rounded-md text-sm font-medium transition duration-300 ease-in-out ${colorClass} ${
                isCurrent ? "ring-2 ring-blue-500" : ""
              }`}
            >
              {q.no}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AnswerCard;
