import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Board from './Board';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/Game.css';

function Game() {
  const [boardSize, setBoardSize] = useState(null);
  const [mode, setMode] = useState('normal');
  const [isOverall, setIsOverall] = useState(false);
  const [currentBoardIndex, setCurrentBoardIndex] = useState(0);
  const [overallTimes, setOverallTimes] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const playerName = location.state?.playerName || 'Unknown';

  const boardSizes = [5, 6, 7, 8];
  const overallSizes = [5, 6, 7, 8];

  const startGame = (size, isOverallMode = false) => {
    setBoardSize(size);
    setIsOverall(isOverallMode);
    setCurrentBoardIndex(isOverallMode ? overallSizes.indexOf(size) : 0);
  };

  const handleComplete = (time) => {
    if (isOverall && currentBoardIndex < overallSizes.length - 1) {
      setOverallTimes([...overallTimes, { size: boardSize, time }]);
      const nextSize = overallSizes[currentBoardIndex + 1];
      setBoardSize(nextSize);
      setCurrentBoardIndex(currentBoardIndex + 1);
    } else {
      const finalTimes = isOverall
        ? [...overallTimes, { size: boardSize, time }]
        : [{ size: boardSize, time }];
      setOverallTimes(finalTimes);
      setBoardSize(null);
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="game-container">
      <p className="grayCG">by S.Chollasit</p>
      <h1>Knight's Tour</h1>
      <h2>"{playerName}"</h2>
      {!boardSize && (
        <div className="controls">
          <div className="mode-selection">
            <h2>เลือกโหมด</h2>
            <div className="mode-buttons">
              <button
                className={mode === 'normal' ? 'active' : ''}
                onClick={() => setMode('normal')}
              >
                <FontAwesomeIcon icon="gamepad" className="button-icon" />
                โหมดปกติ
              </button>
              <button disabled>
                <FontAwesomeIcon icon="trophy" className="button-icon" />
                โหมดท้าทาย (เร็วๆ นี้)
              </button>
            </div>
          </div>
          <div className="board-selection">
            <h2>เลือกกระดาน</h2>
            <div className="board-buttons">
              {boardSizes.map((size) => (
                <button
                  key={size}
                  className={`board-size-${size}`}
                  onClick={() => startGame(size)}
                >
                  <FontAwesomeIcon icon="chess-board" className="button-icon" />
                  {size}x{size}
                </button>
              ))}
              <button
                className="board-overall"
                onClick={() => startGame(5, true)}
              >
                <FontAwesomeIcon icon="star" className="button-icon" />
                Overall
              </button>
            </div>
          </div>
        </div>
      )}
      {boardSize && (
        <Board
          size={boardSize}
          mode={mode}
          onComplete={handleComplete}
          playerName={playerName}
        />
      )}
      {!boardSize && overallTimes.length > 0 && (
        <div className="results">
          <h2>ผลลัพธ์</h2>
          {overallTimes.map(({ size, time }, index) => (
            <p key={index} className="result-text">
              กระดาน {size}x{size} ใช้เวลา {Math.floor(time / 60)}:
              {(time % 60).toString().padStart(2, '0')} นาที
            </p>
          ))}
          {isOverall && (
            <p className="result-text">
              เวลารวม:{' '}
              {Math.floor(
                overallTimes.reduce((sum, { time }) => sum + time, 0) / 60
              )}
              :
              {(overallTimes.reduce((sum, { time }) => sum + time, 0) % 60)
                .toString()
                .padStart(2, '0')}{' '}
              นาที
            </p>
          )}
          <button onClick={handleHome} className="backhome">
            <FontAwesomeIcon icon="house" className="button-icon" />
            หน้าหลัก
          </button>
        </div>
      )}
    </div>
  );
}

export default Game;