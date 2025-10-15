import React, { useState, useEffect } from 'react';

const Card = ({ card, handleCardClick, isFlipped }) => {
  return (
    <div 
      className="w-16 h-24 sm:w-24 sm:h-32 [transform-style:preserve-3d] transition-transform duration-500 cursor-pointer"
      style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      onClick={() => handleCardClick(card)}
    >
      <div className="absolute w-full h-full bg-indigo-500 rounded-lg flex items-center justify-center [backface-visibility:hidden]">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 sm:w-12 sm:h-12 text-indigo-200">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
      </div>
      <div className="absolute w-full h-full bg-gray-100 rounded-lg flex items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
        <span className="text-4xl sm:text-5xl">{card.emoji}</span>
      </div>
    </div>
  );
};

export default function App() {
  const initialCardEmojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
  
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [turns, setTurns] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);

  const shuffleAndStartGame = () => {
    const duplicatedCards = [...initialCardEmojis, ...initialCardEmojis];
    const shuffled = duplicatedCards
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }, index) => ({ id: index, emoji: value }));

    setCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs([]);
    setTurns(0);
    setIsGameWon(false);
  };

  useEffect(() => {
    shuffleAndStartGame();
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCard, secondCard] = flippedCards;

      if (firstCard.emoji === secondCard.emoji) {
        setMatchedPairs(prev => [...prev, firstCard.emoji]);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
      setTurns(prev => prev + 1);
    }
  }, [flippedCards]);
  
  useEffect(() => {
    if (initialCardEmojis.length > 0 && matchedPairs.length === initialCardEmojis.length) {
      setIsGameWon(true);
    }
  }, [matchedPairs]);

  const handleCardClick = (clickedCard) => {
    if (flippedCards.length === 2 || 
        flippedCards.find(c => c.id === clickedCard.id) || 
        matchedPairs.includes(clickedCard.emoji)) {
      return;
    }
    setFlippedCards(prev => [...prev, clickedCard]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-2">Juego de Memoria</h1>
        <p className="text-gray-400">Encuentra todos los pares</p>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
        {cards.map(card => (
          <Card 
            key={card.id} 
            card={card}
            handleCardClick={handleCardClick}
            isFlipped={flippedCards.some(c => c.id === card.id) || matchedPairs.includes(card.emoji)}
          />
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row items-center sm:space-x-8 space-y-4 sm:space-y-0">
          <p className="text-lg sm:text-xl order-2 sm:order-1">Turnos: <span className="font-bold text-2xl text-indigo-400">{turns}</span></p>
          <button 
            onClick={shuffleAndStartGame}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 order-1 sm:order-2"
          >
            Reiniciar
          </button>
      </div>

      {isGameWon && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-white text-gray-900 p-6 sm:p-8 rounded-lg shadow-2xl text-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">¡Felicidades!</h2>
                <p className="text-base sm:text-lg mb-6">Ganaste en {turns} turnos.</p>
                <button 
                    onClick={shuffleAndStartGame}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
                >
                    Jugar de Nuevo
                </button>
            </div>
        </div>
      )}
    </div>
  );
}

