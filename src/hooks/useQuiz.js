// src/hooks/useQuiz.js
import { useState, useEffect, useCallback } from 'react';
import questionsData from "../assets/dop.json";
import { COLOR_STATES } from '../constants/colors';

export const useQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [showAnswerCard, setShowAnswerCard] = useState(false);
  const [direction, setDirection] = useState("next");
  const [{ quizState, currentQuestionIndex }, setState] = useState(() =>
    initializeQuizState()
  );

  function initializeQuizState() {
    const savedState = localStorage.getItem("quizState");
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      return {
        quizState: parsedState,
        currentQuestionIndex: parsedState.lastIndex || 0,
      };
    }
    return {
      quizState: {
        answeredQuestions: {},
        lastIndex: 0,
      },
      currentQuestionIndex: 0,
    };
  }

  useEffect(() => {
    setQuestions(questionsData.sort((a, b) => a.no - b.no));
  }, []);

  useEffect(() => {
    localStorage.setItem("quizState", JSON.stringify(quizState));
  }, [quizState]);

  const currentQuestion = questions[currentQuestionIndex];

  const getColorState = (answered, correct) => {
    if (!answered || answered.length === 0) return COLOR_STATES.GREY;

    const answeredSet = new Set(answered);
    const correctSet = new Set(correct);

    const isExact =
      answeredSet.size === correctSet.size &&
      [...answeredSet].every((option) => correctSet.has(option));

    if (isExact) return COLOR_STATES.GREEN;

    const hasPartialMatch = [...answeredSet].some((option) =>
      correctSet.has(option)
    );

    if (hasPartialMatch) return COLOR_STATES.YELLOW;

    return COLOR_STATES.RED;
  };

  const updateQuizState = useCallback((questionNo, option) => {
    if (!currentQuestion) return;
    
    setState((prev) => {
      const currentAnswers = prev.quizState.answeredQuestions[questionNo] || [];
      const isSelected = currentAnswers.includes(option);
      let newSelectedOptions;

      if (isSelected) {
        newSelectedOptions = currentAnswers.filter((opt) => opt !== option);
      } else {
        newSelectedOptions = [...currentAnswers, option].slice(
          -currentQuestion.choose
        );
      }

      return {
        quizState: {
          ...prev.quizState,
          answeredQuestions: {
            ...prev.quizState.answeredQuestions,
            [questionNo]: newSelectedOptions,
          },
          lastIndex: prev.currentQuestionIndex,
        },
        currentQuestionIndex: prev.currentQuestionIndex,
      };
    });
  }, [currentQuestion]);

  const navigateQuestion = useCallback((newIndex) => {
    if (newIndex < 0 || newIndex >= questions.length) return;
    setDirection(newIndex > currentQuestionIndex ? "next" : "prev");
    setState((prev) => ({
      quizState: {
        ...prev.quizState,
        lastIndex: newIndex,
      },
      currentQuestionIndex: newIndex,
    }));
  }, [currentQuestionIndex, questions.length]);

  const nextQuestion = useCallback(() => 
    navigateQuestion(currentQuestionIndex + 1), [currentQuestionIndex, navigateQuestion]);
    
  const previousQuestion = useCallback(() => 
    navigateQuestion(currentQuestionIndex - 1), [currentQuestionIndex, navigateQuestion]);
    
  const goToQuestion = useCallback((index) => 
    navigateQuestion(index), [navigateQuestion]);

  const shouldShowAnswer = useCallback(() => {
    if (!currentQuestion) return false;
    const currentAnswers = quizState.answeredQuestions[currentQuestion.no] || [];
    return currentAnswers.length === currentQuestion.choose;
  }, [currentQuestion, quizState]);

  return {
    questions,
    currentQuestion,
    showAnswerCard,
    setShowAnswerCard,
    direction,
    quizState,
    currentQuestionIndex,
    getColorState,
    updateQuizState,
    navigateQuestion,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    shouldShowAnswer
  };
};