/* eslint-disable @typescript-eslint/no-explicit-any */
// MainBracket.tsx
import React from 'react';
import SingleEliminationBracket from './singleElimination';
import DoubleEliminationBracket from './doubleElimination';
import RoundRobinBracket from './roundRobin';

interface MainBracketProps {
  teams: any[];
  bracketType: 'Single Elimination' | 'Double Elimination' | 'Round Robin';
  matches: any[];
  isPublicView?: boolean;
}

const MainBracket: React.FC<MainBracketProps> = ({ teams, matches, bracketType, isPublicView = false }) => {
  return (
    <div className="w-full h-full overflow-x-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Tournament Bracket</h2>
      <div className="min-w-fit">
        {bracketType === 'Single Elimination' && <SingleEliminationBracket matches={matches} teams={teams} />}
        {bracketType === 'Double Elimination' && <DoubleEliminationBracket matches={matches} teams={teams} />}
        {bracketType === 'Round Robin' && <RoundRobinBracket teams={teams} matches={matches} isPublicView={isPublicView} />}
      </div>
    </div>
  );
};

export default MainBracket;
