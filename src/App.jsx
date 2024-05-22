import "./App.css";
import { useState, useEffect } from "react";
import { QUESTIONS } from "./Data";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [userAnswers, setUserAnswers] = useState([]);
  const [options, setOptions] = useState([]);
  const [media, setMedia] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    let answerTimeout;
    let questionTimeout;

    if (isPlaying && QUESTIONS[index]) {
      setQuestion(QUESTIONS[index].question);
      setAnswer(QUESTIONS[index].answer);
      setMedia(QUESTIONS[index].media);
      setShowOptions(false);

      answerTimeout = setTimeout(() => {
        setOptions(QUESTIONS[index].options);
        setShowOptions(true);
      }, 10000);

      questionTimeout = setTimeout(() => {
        setIndex((prevIndex) => prevIndex + 1);
      }, 30000);
    }

    return () => {
      clearTimeout(answerTimeout);
      clearTimeout(questionTimeout);
    };
  }, [index, isPlaying]);

  const startTest = () => {
    setIsPlaying(true);
    setIndex(0);
    setUserAnswers([]);
    setResults(null);
  };

  const selectAnswer = (selectedOption) => {
    setUserAnswers([
      ...userAnswers,
      {
        question: QUESTIONS[index].question,
        selectedOption,
        correctAnswer: QUESTIONS[index].answer,
      },
    ]);
    if (index < QUESTIONS.length - 1) {
      setIndex((prevIndex) => prevIndex + 1);
    } else {
      setIsPlaying(false);
      calculateResults();
    }
  };

  const calculateResults = () => {
    const correctAnswers = userAnswers.filter(
      (answer) => answer.selectedOption === answer.correctAnswer
    ).length;
    const incorrectAnswers = userAnswers.length - correctAnswers;
    setResults({ correctAnswers, incorrectAnswers });
  };

  return (
    <div className="App">
      {!isPlaying && !results && (
        <>
          <div className="container">
            <h2>
              The test consists of 10 questions and you have 30 seconds to
              answer each question.
              <br />
              At the end of the test, your total correct and incorrect answers
              will appear on the screen.
            </h2>
            <h3 className="mt-5" style={{ color: "red" }}>
              If you're ready.
            </h3>
          </div>
          <div>
            <span>
              <button
                id="start"
                className="btn btn-primary"
                onClick={startTest}
              >
                Start Test
              </button>
            </span>
          </div>
        </>
      )}
      {isPlaying && (
        <div className="question-section">
          {media && <img src={media} alt="media" />}
          <h1>{question}</h1>
          {showOptions && (
            <ul>
              {options.map((option, index) => (
                <li onClick={() => selectAnswer(option)} key={index}>
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {!isPlaying && results && (
        <div className="results-section">
          <h2>Results</h2>
          <p>Total Questions: {userAnswers.length}</p>
          <p>Correct Answers: {results.correctAnswers}</p>
          <p>Incorrect Answers: {results.incorrectAnswers}</p>
          <h3>Your Answers:</h3>
          <ul>
            {userAnswers.map((answer, index) => (
              <li key={index}>
                Q: {answer.question}
                <br />
                Your Answer: {answer.selectedOption}
                <br />
                Correct Answer: {answer.correctAnswer}
              </li>
            ))}
          </ul>
          <button className="btn btn-primary" onClick={startTest}>
            Restart Test
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
