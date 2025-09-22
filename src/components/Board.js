import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/Board.css';

function Board({ size, mode, onComplete, playerName }) {
  const [board, setBoard] = useState(
    Array(size)
      .fill()
      .map(() => Array(size).fill(0))
  );
  const [moves, setMoves] = useState([]);
  const [knightPos, setKnightPos] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [status, setStatus] = useState('เริ่มเดินอัศวิน!');
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [isHelpActive, setIsHelpActive] = useState(false);
  const navigate = useNavigate();

  const knightMoves = [
    { dx: 2, dy: 1 },
    { dx: 2, dy: -1 },
    { dx: -2, dy: 1 },
    { dx: -2, dy: -1 },
    { dx: 1, dy: 2 },
    { dx: 1, dy: -2 },
    { dx: -1, dy: 2 },
    { dx: -1, dy: -2 },
  ];

  useEffect(() => {
    const corners = [
      { x: 0, y: 0 },
      { x: 0, y: size - 1 },
      { x: size - 1, y: 0 },
      { x: size - 1, y: size - 1 },
    ];
    const startPos = corners[Math.floor(Math.random() * corners.length)];
    const newBoard = Array(size)
      .fill()
      .map(() => Array(size).fill(0));
    newBoard[startPos.x][startPos.y] = 1;
    setBoard(newBoard);
    setKnightPos(startPos);
    setMoves([{ ...startPos }]);
    setTime(0);
    setIsRunning(true);
    setStatus('เริ่มเดินอัศวิน!');
    setPossibleMoves([]);
    setIsHelpActive(false);
  }, [size]);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const tryMove = (x, y) => {
    if (!isRunning) return;
    if (isValidMove(x, y)) {
      const newBoard = board.map((row) => [...row]);
      newBoard[x][y] = moves.length + 1;
      setBoard(newBoard);
      setKnightPos({ x, y });
      setMoves([...moves, { x, y }]);
      setStatus('เดินสำเร็จ!');
      if (isHelpActive) {
        const possible = [];
        for (let move of knightMoves) {
          const nx = x + move.dx;
          const ny = y + move.dy;
          if (
            nx >= 0 &&
            nx < size &&
            ny >= 0 &&
            ny < size &&
            newBoard[nx][ny] === 0
          ) {
            possible.push({ x: nx, y: ny });
          }
        }
        setPossibleMoves(possible);
      }
      if (moves.length + 1 === size * size) {
        setIsRunning(false);
        setStatus('ชนะ! ครบทุกช่อง!');
        setPossibleMoves([]);
        setIsHelpActive(false);
        onComplete(time + 1);
      }
    } else {
      setStatus('การเดินไม่ถูกต้อง!');
    }
  };

  const isValidMove = (x, y) => {
    const lastMove = moves[moves.length - 1];
    for (let move of knightMoves) {
      if (
        lastMove.x + move.dx === x &&
        lastMove.y + move.dy === y &&
        board[x][y] === 0
      ) {
        return true;
      }
    }
    return false;
  };

  const undoMove = () => {
    if (moves.length > 1 && isRunning) {
      const newMoves = [...moves];
      const lastMove = newMoves.pop();
      const newBoard = board.map((row) => [...row]);
      newBoard[lastMove.x][lastMove.y] = 0; // ลบการเดินล่าสุด
      setBoard(newBoard);
      setKnightPos(newMoves[newMoves.length - 1]);
      setMoves(newMoves);
      setStatus('ย้อนกลับแล้ว!');
      // ถ้าตัวช่วยเปิดอยู่ อัปเดตตำแหน่งที่เดินได้ใหม่
      if (isHelpActive) {
        const possible = [];
        const newKnightPos = newMoves[newMoves.length - 1];
        for (let move of knightMoves) {
          const nx = newKnightPos.x + move.dx;
          const ny = newKnightPos.y + move.dy;
          if (
            nx >= 0 &&
            nx < size &&
            ny >= 0 &&
            ny < size &&
            newBoard[nx][ny] === 0
          ) {
            possible.push({ x: nx, y: ny });
          }
        }
        setPossibleMoves(possible);
      } else {
        setPossibleMoves([]);
      }
    }
  };

  const resetBoard = () => {
    const corners = [
      { x: 0, y: 0 },
      { x: 0, y: size - 1 },
      { x: size - 1, y: 0 },
      { x: size - 1, y: size - 1 },
    ];
    const startPos = corners[Math.floor(Math.random() * corners.length)];
    const newBoard = Array(size)
      .fill()
      .map(() => Array(size).fill(0));
    newBoard[startPos.x][startPos.y] = 1;
    setBoard(newBoard);
    setKnightPos(startPos);
    setMoves([{ ...startPos }]);
    setTime(0);
    setIsRunning(true);
    setStatus('เริ่มใหม่แล้ว!');
    setPossibleMoves([]);
    setIsHelpActive(false);
  };

  const toggleHelp = () => {
    if (!isRunning) return;
    setIsHelpActive(!isHelpActive);
    if (!isHelpActive) {
      const possible = [];
      for (let move of knightMoves) {
        const nx = knightPos.x + move.dx;
        const ny = knightPos.y + move.dy;
        if (
          nx >= 0 &&
          nx < size &&
          ny >= 0 &&
          ny < size &&
          board[nx][ny] === 0
        ) {
          possible.push({ x: nx, y: ny });
        }
      }
      setPossibleMoves(possible);
      setStatus('แสดงตำแหน่งที่เดินได้แล้ว!');
    } else {
      setPossibleMoves([]);
      setStatus('ปิดตัวช่วยแล้ว!');
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="board-container">
      <h2>
        กระดาน {size}x{size}
      </h2>
      <p>
        เวลา: {Math.floor(time / 60)}:
        {(time % 60).toString().padStart(2, '0')}
      </p>
      <div
        className="board"
        style={{ gridTemplateColumns: `repeat(${size}, var(--cell-size, 50px))` }}
      >
        {board.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`cell ${
                cell > 0 ? 'path' : ''
              } ${i === knightPos.x && j === knightPos.y ? 'knight' : ''} ${
                possibleMoves.some((pos) => pos.x === i && pos.y === j)
                  ? 'possible'
                  : ''
              }`}
              onClick={() => tryMove(i, j)}
            >
              {i === knightPos.x && j === knightPos.y ? (
                <FontAwesomeIcon icon="chess-knight" className="knight-icon" />
              ) : cell > 0 ? (
                cell
              ) : (
                ''
              )}
            </div>
          ))
        )}
      </div>
      <div className="board-container controls">
        <button onClick={undoMove} className="undo">
          <FontAwesomeIcon icon="undo" className="button-icon" />
          ย้อนกลับ
        </button>
        <button onClick={resetBoard} className="restart">
          <FontAwesomeIcon icon="rotate-right" className="button-icon" />
          เริ่มใหม่
        </button>
        <button
          onClick={toggleHelp}
          className={`help ${isHelpActive ? 'active' : ''}`}
        >
          <FontAwesomeIcon icon="eye" className="button-icon" />
          ตัวช่วย
        </button>
        <button onClick={handleHome} className="gohome">
          <FontAwesomeIcon icon="house" className="button-icon" />
          หน้าหลัก
        </button>
      </div>
      <p className="status">{status}</p>
    </div>
  );
}

export default Board;