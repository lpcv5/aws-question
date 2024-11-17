// src/contexts/QuizContext.js
import { createContext, useContext } from 'react';
import { useQuiz } from '../hooks/useQuiz';

const QuizContext = createContext(null);

export const QuizProvider = ({ children }) => {
  const quizState = useQuiz();
  
  return (
    <QuizContext.Provider value={quizState}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return context;
};