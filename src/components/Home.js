import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/Home.css';

function Home() {
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const generateRandomName = () => {
    const randomNum = Math.floor(10000000 + Math.random() * 90000000);
    return `Player${randomNum}`;
  };

  const handleStart = () => {
    const name = playerName.trim() || generateRandomName();
    navigate('/game', { state: { playerName: name } });
  };

  return (
    <div className="home-container">
      <h1>Knight's Tour</h1>
      <input
        type="text"
        placeholder="ใส่ชื่อของคุณ"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button onClick={handleStart}>
        <FontAwesomeIcon icon="play" className="button-icon" />
        เริ่มเกม
      </button>
    </div>
  );
}

export default Home;