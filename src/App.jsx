import React, { useState } from 'react';
import WrappedStory from './pages/ViennaWrapped';
import FinalSummary from './pages/FinalSummary';

export default function App() {
  const [isFinished, setIsFinished] = useState(false); // Houdt bij of de 10 slides klaar zijn

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden m-0 p-0">
      {/* Schakel tussen de Story en de Samenvatting */}
      {!isFinished ? (
        <WrappedStory onComplete={() => setIsFinished(true)} />
      ) : (
        <FinalSummary onRestart={() => setIsFinished(false)} />
      )}
    </div>
  );
}