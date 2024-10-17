// src/QuizApp.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 定义颜色状态
const COLOR_STATES = {
  GREY: "bg-gray-200 hover:bg-gray-300",
  GREEN: "bg-green-200 hover:bg-green-300",
  YELLOW: "bg-yellow-200 hover:bg-yellow-300",
  RED: "bg-red-200 hover:bg-red-300",
  BLUE: "bg-blue-200 hover:bg-blue-300",
  BLUE_DARK: "bg-blue-500 hover:bg-blue-600",
};

function QuizApp() {
  // 状态管理
  const [questions, setQuestions] = useState([]);
  const [examOutline, setExamOutline] = useState({});
  const [showAnswerCard, setShowAnswerCard] = useState(false);
  const [direction, setDirection] = useState("next");
  const [{ quizState, currentQuestionIndex }, setState] = useState(() =>
    initializeQuizState()
  );

  // 初始化 quizState 和 currentQuestionIndex
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

  // 获取问题和考试大纲
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionsData, outlineData] = await Promise.all([
          fetch("/dop.json").then((res) => res.json()),
          fetch("/exam_outline.json").then((res) => res.json()),
        ]);
        setQuestions(questionsData.sort((a, b) => a.no - b.no));
        setExamOutline(outlineData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  // 同步 quizState 到 localStorage
  useEffect(() => {
    localStorage.setItem("quizState", JSON.stringify(quizState));
  }, [quizState]);

  const currentQuestion = questions[currentQuestionIndex];

  // 辅助函数：确定按钮颜色
  const getColorState = (answered, correct, isSelected) => {
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

  // 辅助函数：更新 quizState
  const updateQuizState = (questionNo, option) => {
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
  };

  // 事件处理函数
  const handleOptionSelect = (option) => {
    if (!currentQuestion) return;
    updateQuizState(currentQuestion.no, option);
  };

  const navigateQuestion = (newIndex) => {
    if (newIndex < 0 || newIndex >= questions.length) return;
    setDirection(newIndex > currentQuestionIndex ? "next" : "prev");
    setState((prev) => ({
      quizState: {
        ...prev.quizState,
        lastIndex: newIndex,
      },
      currentQuestionIndex: newIndex,
    }));
  };

  const nextQuestion = () => navigateQuestion(currentQuestionIndex + 1);
  const previousQuestion = () => navigateQuestion(currentQuestionIndex - 1);
  const goToQuestion = (index) => navigateQuestion(index);

  // 辅助函数：确定答题卡按钮颜色
  const getAnswerCardColor = (answered, correct) => {
    return getColorState(answered, correct, false);
  };

  // 渲染考试大纲内容
  const renderExamOutline = (field) => {
    const [mainSection, subSection] = field.split(".");
    const content = examOutline?.[mainSection]?.[subSection];
    if (!content) return null;

    return (
      <div className="mt-4">
        <h3 className="font-bold text-lg mb-2">{content.name}</h3>
        <div className="mb-2">
          <h4 className="font-semibold">知识点：</h4>
          <ul className="list-disc list-inside">
            {content.knows.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">技能点：</h4>
          <ul className="list-disc list-inside">
            {content.skills.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  // 定义动画变体
  const variants = {
    enter: (direction) => ({
      x: direction === "next" ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction === "next" ? -300 : 300,
      opacity: 0,
    }),
  };

  // 确定是否显示解析
  const shouldShowAnswer = useCallback(() => {
    if (!currentQuestion) return false;
    const currentAnswers =
      quizState.answeredQuestions[currentQuestion.no] || [];
    return currentAnswers.length === currentQuestion.choose;
  }, [quizState, currentQuestion]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden relative">
        {/* 答题卡切换按钮 */}
        <button
          onClick={() => setShowAnswerCard((prev) => !prev)}
          className="fixed top-4 right-4 z-10 bg-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          {showAnswerCard ? "隐藏答题卡" : "显示答题卡"}
        </button>

        {/* 答题卡 */}
        {showAnswerCard && (
          <div className="fixed top-16 right-4 w-72 bg-white p-4 rounded-lg shadow-lg overflow-y-auto max-h-[calc(100vh-5rem)] z-20 border border-gray-200">
            <h3 className="text-lg font-bold mb-3 text-gray-800">答题卡</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, index) => {
                const answered = quizState.answeredQuestions[q.no];
                const isCurrent = currentQuestionIndex === index;
                const bgColor = getAnswerCardColor(answered, q.best);

                const hasAnswered = answered && answered.length > 0;
                const colorClass = hasAnswered ? bgColor : COLOR_STATES.GREY;

                return (
                  <button
                    key={q.no}
                    onClick={() => goToQuestion(index)}
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
        )}

        {/* 问题内容 */}
        <div className="p-6">
          <motion.div layout>
            <AnimatePresence initial={false} custom={direction} mode="wait">
              {currentQuestion && (
                <motion.div
                  key={currentQuestionIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  <h1 className="text-2xl font-bold mb-4 text-gray-800">
                    题目 {currentQuestion.no}
                  </h1>
                  <p className="mb-4 text-gray-700">
                    {currentQuestion.question}
                  </p>
                  <p className="mb-4 text-sm text-gray-600">
                    请选择 {currentQuestion.choose} 项
                  </p>
                  <div className="space-y-4">
                    {Object.entries(currentQuestion.options).map(
                      ([key, value]) => {
                        const answered =
                          quizState.answeredQuestions[currentQuestion.no] || [];
                        const isSelected = answered.includes(key);
                        const colorClass = shouldShowAnswer()
                          ? isSelected
                            ? currentQuestion.best.includes(key)
                              ? COLOR_STATES.GREEN
                              : COLOR_STATES.RED
                            : COLOR_STATES.GREY
                          : isSelected
                          ? COLOR_STATES.BLUE
                          : COLOR_STATES.GREY;

                        return (
                          <div
                            key={key}
                            className="border border-gray-200 rounded-lg overflow-hidden"
                          >
                            <button
                              onClick={() => handleOptionSelect(key)}
                              disabled={shouldShowAnswer()}
                              className={`w-full text-left p-3 transition duration-300 ease-in-out ${colorClass}`}
                            >
                              {key}. {value}
                            </button>
                            <AnimatePresence>
                              {shouldShowAnswer() && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="p-3 bg-gray-50 border-t border-gray-200 overflow-hidden"
                                >
                                  <p className="text-sm text-gray-700">
                                    <span className="font-bold">解析：</span>
                                    {currentQuestion.analysis[key]}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      }
                    )}
                  </div>
                  {shouldShowAnswer() && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                    >
                      <p className="font-bold text-green-600 mb-4">
                        正确答案: {currentQuestion.best.join(", ")}
                      </p>
                      {renderExamOutline(currentQuestion.field)}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 导航按钮 */}
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
              disabled={currentQuestionIndex === questions.length - 1}
              className={`${
                currentQuestionIndex === questions.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600"
              } ${
                COLOR_STATES.BLUE_DARK
              } text-white px-4 py-2 rounded-md shadow transition duration-300 ease-in-out`}
            >
              下一题
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizApp;
