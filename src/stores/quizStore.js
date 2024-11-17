import create from 'zustand'
import questionsData from "../assets/dop.json"

const initializeQuizState = () => {
  const savedState = localStorage.getItem("quizState");
  if (savedState) {
    const parsedState = JSON.parse(savedState);
    return {
      answeredQuestions: parsedState.answeredQuestions || {},
      currentQuestionIndex: parsedState.lastIndex || 0,
    };
  }
  return {
    answeredQuestions: {},
    currentQuestionIndex: 0,
  };
};

const useQuizStore = create((set, get) => ({
  ...initializeQuizState(),
  questions: questionsData.sort((a, b) => a.no - b.no),
  showAnswerCard: false,
  direction: "next",

  setShowAnswerCard: (show) => set({ showAnswerCard: show }),
  setDirection: (direction) => set({ direction }),

  updateAnsweredQuestions: (questionNo, option) => {
    const { questions, answeredQuestions, currentQuestionIndex } = get();
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswers = answeredQuestions[questionNo] || [];
    const isSelected = currentAnswers.includes(option);
    
    let newSelectedOptions;
    if (isSelected) {
      newSelectedOptions = currentAnswers.filter((opt) => opt !== option);
    } else {
      newSelectedOptions = [...currentAnswers, option].slice(-currentQuestion.choose);
    }

    const newAnsweredQuestions = {
      ...answeredQuestions,
      [questionNo]: newSelectedOptions,
    };

    set({ answeredQuestions: newAnsweredQuestions });
    localStorage.setItem("quizState", JSON.stringify({
      answeredQuestions: newAnsweredQuestions,
      lastIndex: currentQuestionIndex,
    }));
  },

  navigateQuestion: (newIndex) => {
    const { questions } = get();
    if (newIndex < 0 || newIndex >= questions.length) return;
    
    set((state) => ({
      direction: newIndex > state.currentQuestionIndex ? "next" : "prev",
      currentQuestionIndex: newIndex,
    }));
  },
}));

export default useQuizStore;