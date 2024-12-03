import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Main from "./user_pages/Main";
import Login from "./user_pages/Login";
import Home from "./user_pages/Home";
import Profile from "./user_pages/Profile";
import Bookmarks from "./user_pages/Bookmarks";
import DeleteAccount from "./user_pages/DeleteAccount";
import Header from "./components/Header";
import GameIntro from "./components/GameIntro";
import GameWorldView from "./components/GameWorldView";
import GamePage from "./components/GamePage";
import GameEnding from "./components/GameEnding";
import WrongPage from "./action/WrongPage";
import Loading from "./action/Loading";
import { DarkModeProvider } from "./Contexts/DarkModeContext";
import { NotificationProvider } from "./Contexts/NotificationContext";
import NotificationList from "./user_pages/NotificationList";
import Notification from "./components/Notification";
import { AudioProvider } from "./Contexts/AudioContext";
import GameLayout from "./layouts/GameLayout";

const AppContent: React.FC = () => {
  const location = useLocation();
  const isMainPage = location.pathname === "/";
  const noHeaderRoutes = [
    "/login", 
    "/delete-account", 
    "/", 
    "/game-page", 
    "/game-world-view"
  ];
  const noPaddingRoutes = ["/bookmarks"];
  
  const isHeaderVisible = !noHeaderRoutes.includes(location.pathname);
  const isPaddingRequired = !noPaddingRoutes.includes(location.pathname);

  return (
    <>
      {isMainPage ? (
        <Main />
      ) : (
        <div className="flex flex-col min-h-screen items-center justify-between bg-white shadow-2xl">
          {!noHeaderRoutes.includes(location.pathname) && <Header />}
          <main
            className={`flex-grow w-full h-auto max-w-lg mx-auto bg-white dark:bg-custom-background dark:text-white 
              ${isHeaderVisible && isPaddingRequired ? "pt-32 px-4" : ""}`}
          >
            <Routes>
              {/* 일반 라우트 */}
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/delete-account" element={<DeleteAccount />} />
              <Route path="/*" element={<WrongPage />} />
              <Route path="/loading" element={<Loading />} />
              <Route path="/notification-list" element={<NotificationList />} />
              <Route path="/notification/:id" element={<Notification />} />

              {/* 게임 라우트 */}
              <Route path="/game-intro" element={
                <GameLayout>
                  <GameIntro />
                </GameLayout>
              } />
              <Route path="/game-world-view" element={
                <GameLayout>
                  <GameWorldView />
                </GameLayout>
              } />
              <Route path="/game-page" element={
                <GameLayout>
                  <GamePage />
                </GameLayout>
              } />
              <Route path="/game-ending" element={
                <GameLayout>
                  <GameEnding />
                </GameLayout>
              } />
            </Routes>
          </main>
        </div>
      )}
    </>
  );
};

const App: React.FC = () => (
  <DarkModeProvider>
    <NotificationProvider>
      <AudioProvider>
        <AppContent />
      </AudioProvider>
    </NotificationProvider>
  </DarkModeProvider>
);

const AppWithRouter: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/*" element={<App />} />
    </Routes>
  </Router>
);

export default AppWithRouter;