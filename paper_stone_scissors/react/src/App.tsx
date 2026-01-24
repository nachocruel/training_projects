import { useState } from 'react'
import './App.css'

function App() {
  const [scoreMachine, setScoreMachine] = useState(0)
  const [scorePlayer, setScorePlayer] = useState(0)
  const [message, setMessage] = useState('')
  const [selectedChoice, setSelectedChoice] = useState<'stone' | 'paper' | 'scissors' | null>(null)
  const choices = ['stone', 'paper', 'scissors'];

  const playGame = () => {
    if (selectedChoice === null) return;

    const machineChoice = choices[Math.floor(Math.random() * choices.length)];
    setMessage(`You chose ${selectedChoice}, machine chose ${machineChoice}`);

    if (selectedChoice === machineChoice) {
      setMessage("It's a tie!");
    } else if (
      (selectedChoice === 'stone' && machineChoice === 'scissors') ||
      (selectedChoice === 'paper' && machineChoice === 'stone') ||
      (selectedChoice === 'scissors' && machineChoice === 'paper')
    ) {
      setScorePlayer(scorePlayer + 1);
      setMessage("You win!");
    } else {
      setScoreMachine(scoreMachine + 1);
      setMessage("Machine wins!");
    }
  };

  return (
    <>
      <h1>Stone Paper Scissors</h1>
      <p>Player: {scorePlayer} | Machine: {scoreMachine}</p>
      <p>{message}</p>
      <div className="card">
        <p>Select your choice:</p>
        <button onClick={() => { setSelectedChoice('stone') }} className={selectedChoice === 'stone' ? 'selectedBtn' : ''}>🪨</button>
        <button onClick={() => { setSelectedChoice('paper') }} className={selectedChoice === 'paper' ? 'selectedBtn' : ''}>📄</button>
        <button onClick={() => { setSelectedChoice('scissors') }} className={selectedChoice === 'scissors' ? 'selectedBtn' : ''}>✂️</button>
      </div>
      <div className="card">
        <button onClick={playGame}>Play</button>
      </div>
    </>
  )
}

export default App
