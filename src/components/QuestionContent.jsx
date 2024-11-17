import { motion, AnimatePresence } from "framer-motion";
import { OptionButton } from './OptionButton';

export function QuestionContent({
  currentQuestion,
  currentQuestionIndex,
  direction,
  variants,
  quizState,
  shouldShowAnswer,
  handleOptionSelect,
  renderExamOutline
}) {
  return (
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
            <p className="mb-4 text-gray-700">{currentQuestion.question}</p>
            <p className="mb-4 text-sm text-gray-600">
              请选择 {currentQuestion.choose} 项
            </p>
            <div className="space-y-4">
              {Object.entries(currentQuestion.options).map(([key, value]) => (
                <OptionButton
                  key={key}
                  optionKey={key}
                  value={value}
                  currentQuestion={currentQuestion}
                  quizState={quizState}
                  shouldShowAnswer={shouldShowAnswer}
                  handleOptionSelect={handleOptionSelect}
                />
              ))}
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
  );
}