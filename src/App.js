import { useState } from "react";
import "./App.css";
import InProgress from "./components/InProgress";
import Results from "./components/Results";
import Start from "./components/Start";
import stages from "./stages.json";
import useAudio from "./hooks/useAudio.js";
import wait from "./utils/wait";

function App() {
  const [gameState, setGameState] = useState("START");
  const [currentQuestionId, setCurrentQuestionId] = useState(0);
  const [winnings, setWinnings] = useState(0);
  const [isPmButtonDisabled, setIsPmButtonDisabled] = useState(false);
  const [is50ButtonDisabled, setIs50ButtonDisabled] = useState(false);
  const [disabled50AnswerIds, setDisabled50AnswerIds] = useState([]);
  const [isGambleButtonDisabled, setIsGambleButtonDisabled] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const playAlchSound = useAudio("/alch.mp3", 0.1);
  const playCorrectSound = useAudio("/Correct.mp3", 0.1);
  const playLoseSound = useAudio("/lose.mp3", 0.1);
  const [answerSelected, setAnswerSelected] = useState(false);

  // console.log(audioRef);
  // useEffect(() => {
  //   console.log("effect");
  // }, []);

  const handleAnswerClick = async (id, isCorrect) => {
    setAnswerSelected(true);
    await wait(3000);
    if (isCorrect) {
      nextQuestion();
      playCorrectSound();
    } else {
      handleWrongAnswer();
      playLoseSound();
    }
    setAnswerSelected(false);
  };

  const startGame = () => {
    playAlchSound();
    setGameState("IN_PROGRESS");
  };

  const nextQuestion = async () => {
    if (currentQuestionId + 1 === stages.length) {
      setGameState("RESULTS");
      setWinnings(stages[currentQuestionId].amount);
    } else {
      setDisabled50AnswerIds([]);
      setCurrentQuestionId(currentQuestionId + 1);
    }
  };

  const handleWrongAnswer = () => {
    if (currentQuestionId === 0) {
      setWinnings(0);
    } else {
      for (let i = currentQuestionId - 1; i >= 0; i--) {
        if (stages[i].checkpoint) {
          setWinnings(stages[i].amount);
          break;
        }
      }
    }
    setGameState("RESULTS");
  };

  const handleWalkAway = () => {
    if (currentQuestionId === 0) {
      setWinnings(0);
    } else {
      setWinnings(stages[currentQuestionId - 1].amount);
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const leaveGame = () => {
    setGameState("RESULTS");
  };

  const handlePlayAgain = () => {
    setCurrentQuestionId(0);
    setIsPmButtonDisabled(false);
    setIs50ButtonDisabled(false);
    setIsGambleButtonDisabled(false);
    setModalIsOpen(false);
    setWinnings(0);
    setDisabled50AnswerIds([]);
    setGameState("START");
  };

  const handlePmClick = () => {
    setIsPmButtonDisabled(true);
  };

  const handle50Click = () => {
    const answers = stages[currentQuestionId].answers;
    const wrongAnswers = answers.filter((answer) => !answer.isCorrect);
    const randomIndex = Math.floor(Math.random() * 3);
    wrongAnswers.splice(randomIndex, 1);
    const disabledAnswerIds = wrongAnswers.map((answer) => answer.id);
    setDisabled50AnswerIds(disabledAnswerIds);
    setIs50ButtonDisabled(true);
    console.log(disabledAnswerIds);
  };

  const handleGambleClick = () => {
    setIsGambleButtonDisabled(true);
  };

  switch (gameState) {
    case "START":
      return <Start startGame={startGame} />;
    case "IN_PROGRESS":
      return (
        <InProgress
          stages={stages}
          winnings={winnings}
          currentQuestionId={currentQuestionId}
          handleWalkAway={handleWalkAway}
          isPmButtonDisabled={isPmButtonDisabled}
          handlePmClick={handlePmClick}
          is50ButtonDisabled={is50ButtonDisabled}
          disabled50AnswerIds={disabled50AnswerIds}
          handle50Click={handle50Click}
          isGambleButtonDisabled={isGambleButtonDisabled}
          handleGambleClick={handleGambleClick}
          modalIsOpen={modalIsOpen}
          leaveGame={leaveGame}
          closeModal={closeModal}
          handleAnswerClick={handleAnswerClick}
          answerSelected={answerSelected}
        />
      );
    case "RESULTS":
      return (
        <Results
          stages={stages}
          currentQuestionId={currentQuestionId}
          handlePlayAgain={handlePlayAgain}
          winnings={winnings}
        />
      );
    default:
      return null;
  }
}

export default App;

// setGamblequestionId(currentQuestionId + 3);
// const answers = stages[currentQuestionId + 3].answers;
// const wrongAnswers = answers.filter((answer) => !answer.isCorrect);
// const randomIndex = Math.floor(Math.random() * 3);
// wrongAnswers.splice(randomIndex, 1);
// const disabledAnswerIds = wrongAnswers.map((answer) => answer.id);
// if (stages[currentQuestionId].id === gambleQuestionId) {
//   setDisabledGambleAnswerIds(disabledAnswerIds);
//   console.log("here");
