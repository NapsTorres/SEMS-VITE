/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import MainBracket from '../../../components/brackets/mainBracket'
import { io } from "socket.io-client";
import { WEBSOCKET_URL } from '../../../config/socket/websocket';

const BracketSection: React.FC<{ matches: any, teams: any, bracketType: any }> = ({ matches: initialMatches, teams, bracketType }) => {
  const [matches, setMatches] = useState(initialMatches);

  useEffect(() => {
    console.log('BracketSection: Initial matches updated', initialMatches);
    setMatches(initialMatches);
  }, [initialMatches]);

  useEffect(() => {
    console.log('BracketSection: Setting up WebSocket connection');
    const socket = io(WEBSOCKET_URL, {
      withCredentials: true
    });

    socket.on('connect', () => {
      console.log('BracketSection: WebSocket connected');
    });

    socket.on('connect_error', (error) => {
      console.error('BracketSection: WebSocket connection error:', error);
    });

    // Listen for score updates and status updates for all matches
    if (matches) {
      console.log('BracketSection: Setting up listeners for matches:', matches);
      matches.forEach((match: any) => {
        // Score updates
        socket.on(`score_update_${match.matchId}`, ({ team1Score, team2Score }) => {
          console.log(`BracketSection: Received score update for match ${match.matchId}:`, { team1Score, team2Score });
          setMatches((prevMatches: typeof initialMatches) => 
            prevMatches.map((m: any) => 
              m.matchId === match.matchId 
                ? { ...m, team1Score, team2Score }
                : m
            )
          );
        });

        // Status updates
        socket.on(`status_update_${match.matchId}`, ({ status, winnerId }) => {
          console.log(`BracketSection: Received status update for match ${match.matchId}:`, { status, winnerId });
          setMatches((prevMatches: typeof initialMatches) => 
            prevMatches.map((m: any) => 
              m.matchId === match.matchId 
                ? { ...m, status: status.toLowerCase(), winner_team_id: winnerId }
                : m
            )
          );
        });
      });
    }

    return () => {
      console.log('BracketSection: Cleaning up WebSocket connection');
      socket.disconnect();
    };
  }, [matches]);

  return (
    <section className='z-20 relative' style={{ backgroundColor: '#e9ece4' }}>
      <div className='absolute w-full h-full z-40' />
      <div className="p-4">
        <MainBracket matches={matches} teams={teams} bracketType={bracketType} />
      </div>
    </section>
  )
}

export default BracketSection
