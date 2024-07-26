import { useState, useEffect } from 'react';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    fetch('/questions.json')
      .then(response => response.json())
      .then(data => setQuestions(data));
  }, []);

  const handleOptionChange = (e) => {
    const value = e.target.value;
    const currentQuestion = questions[currentQuestionIndex];
    const isMultipleChoice = currentQuestion.best.length > 1;

    if (isMultipleChoice) {
      setSelectedOptions(prevSelectedOptions =>
        prevSelectedOptions.includes(value)
          ? prevSelectedOptions.filter(option => option !== value)
          : [...prevSelectedOptions, value]
      );

      if (selectedOptions.length + 1 === currentQuestion.best.length) {
        setShowResult(true);
      }
    } else {
      setSelectedOptions([value]);
      setShowResult(true);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedOptions([]);
    setShowResult(false);
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedOptions.sort().toString() === currentQuestion.best.sort().toString();

  return (
    <div className="quiz-container">
      <h2>Question {currentQuestion.number}</h2>
      <p>{currentQuestion.question}</p>
      <form>
        {Object.entries(currentQuestion.options).map(([key, option]) => (
          <div key={key}>
            <label>
              <input
                type={currentQuestion.best.length > 1 ? "checkbox" : "radio"}
                value={key}
                checked={selectedOptions.includes(key)}
                onChange={handleOptionChange}
              />
              {option.option}
            </label>
          </div>
        ))}
      </form>
      {showResult && (
        <div className="result">
          {isCorrect ? <p>Correct!</p> : <p>Incorrect. The correct answer is {currentQuestion.best.join(', ')}</p>}
          {Object.entries(currentQuestion.options).map(([key, option]) => (
            <p key={key}>{option.option}: {option.reason}</p>
          ))}
          {currentQuestionIndex < questions.length - 1 && (
            <button onClick={handleNextQuestion}>Next Question</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
