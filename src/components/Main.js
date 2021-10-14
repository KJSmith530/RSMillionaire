import React from "react";
import Question from "./Question";
import Answer from "./Answer";

const Main = ({
  nextQuestion,
  handleWrongAnswer,
  handleWalkAway,
  stages,
  currentQuestionId,
}) => {
  const currentStage = stages[currentQuestionId];
  return (
    <div className="main">
      <button onClick={handleWalkAway}>Walk away</button>
      <Question question={currentStage.question} />
      {currentStage.answers.map((answer) => (
        <Answer
          isCorrect={answer.isCorrect}
          text={answer.text}
          key={answer.id}
          nextQuestion={nextQuestion}
          handleWrongAnswer={handleWrongAnswer}
        />
      ))}
    </div>
  );
};

export default Main;
