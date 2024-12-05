import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { RouterUrl } from "./routes";
import { CoachSide, Private, Public } from "./layout";
import {
  AdminDashboard,
  CoachTeamPage,
  EventsPage,
  GameResults,
  GameSchedule,
  GameScoring,
  LandingPage,
  LoginPage,
  MatchScoring,
  MediaPage,
  RegistrationPage,
  SportsPage,
  TeamInfo,
  TeamsPage,
  UserAccounts,
} from "./pages";
import EventInformation from "./pages/private/events/information";
import LiveMatch from "./pages/public/live";

function App() {
  const router = createBrowserRouter([
    {
      path: "/", // Root path for public routes
      element: <Public />,
      children: [
        { path: "/", element: <LandingPage /> }, // Landing page route
        { path: RouterUrl.Login, element: <LoginPage /> }, // Login page route
        { path: RouterUrl.Registration, element: <RegistrationPage /> },
        { path: RouterUrl.Live, element: <LiveMatch /> },
      ],
    },
    {
      path: "/coach", // Path for coach-specific routes
      element: <CoachSide />,
      children: [
        { path: RouterUrl.Coach, element: <CoachTeamPage /> },
        // Add more coach routes here
      ],
    },
    {
      path: "/admin", // Path for admin-specific routes
      element: <Private />,
      children: [
        { path: RouterUrl.AdminDashboard, element: <AdminDashboard /> },
        { path: RouterUrl.AdminTeams, element: <TeamsPage /> },
        { path: RouterUrl.AdminTeamsInfo, element: <TeamInfo /> },
        { path: RouterUrl.AdminGame, element: <GameScoring /> },
        { path: RouterUrl.AdminGameResults, element: <GameResults /> },
        { path: RouterUrl.AdminGameSched, element: <GameSchedule /> },
        { path: RouterUrl.AdminEvents, element: <EventsPage /> },
        { path: RouterUrl.AdminSports, element: <SportsPage /> },
        { path: RouterUrl.EventInfo, element: <EventInformation /> },
        { path: RouterUrl.MatchScoring, element: <MatchScoring /> },
        { path: RouterUrl.Accounts, element: <UserAccounts /> },
        { path: RouterUrl.AdminMedia, element: <MediaPage /> },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} fallbackElement={<h6>Loading...</h6>} />
    </>
  );
}

export default App;
