/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Team {
  coachName: string | Blob;
  teamId: number;
  teamName: string;
  teamCoach: string;
  teamLogo: any;
  players:any[];
  coachId:any;
}

export interface BracketTeam {
  teamId: number;
}

export interface Events {
  eventId: number;
  eventName: string;
  eventYear: string;
  eventStartDate: string;
  eventEndDate: string;
  description: string;
  createdBy: number;
  updatedBy?: number;
  createdByName?: string;
  updatedByName?: string;
  createdAt?: string;
  eventstartDate?: string; // For backward compatibility
  eventendDate?: string;   // For backward compatibility
}
export interface Sports {
  sportsId: number;
  sportsName: string;
  sportsLogo: any;
  description: any;
}

export interface SingleEliminationHooksProps {
  matches: Match[];
  teams: Team[];
}

export interface Matchup {
  id: string;
  teamA: Team | null;
  teamB: Team | null;
  round: number;
}

export interface BracketStage {
  name: string;
  isElimination: boolean;
}

export interface BracketType {
  "Single Elimination"?: BracketStage[];
  "Double Elimination"?: BracketStage[];
  "Round Robin"?: BracketStage[];
}

export interface Match {
  team1Score: number | null;
  team2Score: number | null;
  bracketType: string;
  matchId: number;
  round: number;
  team1Id: number | null;
  team2Id: number | null;
  schedule?: string;
  venue?: string;
  next_match_id?: number | null;
  status: string;
  winner_team_id: number | null;
  isFinal?: boolean;
  bracketRound?: number;
  byeTeam?: boolean;
}

export interface SingleEliminationBracketProps {
  matches: Match[];
  teams: Team[];
}
export interface DoubleEliminationHooksProps {
  matches: Match[];
  teams: Team[];
}
export interface RoundRobinHooksProps {
  matches: Match[];
  teams: Team[];
}

export interface User {
  id: number;
  username: string;
  password: string;
  collegeName: string;
  type: string;
  teamId: number | null;
  status: string;
}

export interface Player {
  playerId: number;
  playerName: string;
  medicalCertificate: string;
  status: 'pending' | 'approved' | 'rejected';
  addedBy?: number;
  updatedBy?: number;
  updatedAt?: string;
  createdAt?: string;
}

export interface SportDetails {
  sportsId: number;
  sportsName: string;
  sportsLogo: string;
  description: string;
}

export interface EventDetails {
  eventId: number;
  eventName: string;
  eventYear: number;
  eventStartDate: string;
  eventEndDate: string;
  description: string;
}


export interface HandledEvent {
  sportEventsId: number;
  sportsId: number;
  eventsId: number;
  bracketType: string;
  coachId: number | null;
  eventDetails: EventDetails | null;
  sportDetails: SportDetails | null;
  team: Team | null;
  players: Player[];
}

export interface CoachInfo {
  coach: {
    id: number;
    username: string;
    type: string;
    teamId: number;
    status: string;
  };
  handledEvents: HandledEvent[];
}
