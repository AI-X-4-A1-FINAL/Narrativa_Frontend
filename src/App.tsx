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
import useHeaderVisibility from "./hooks/useHeaderVisibility";
import ParticleBackground from "./components/ParticleBackground"

const AppContent: React.FC = () => {
  const headerState = useHeaderVisibility();

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <ParticleBackground />
      </div>
      {headerState.isMainPage ? (
        <Main />
      ) : (
        <div className="flex flex-col min-h-screen items-center justify-between shadow-2xl">
          {headerState.showHeader && <Header />}
          <main
            className={`flex-grow w-full h-auto max-w-lg mx-auto bg-white dark:bg-custom-background dark:text-white 
              ${headerState.isHeaderVisible && headerState.isPaddingRequired ? "pt-32 px-4" : ""}`}
          >
            <Routes>
              {/* 일반 라우트 */}
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/delete-account" element={<DeleteAccount />} />
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

              {/* 404 라우트 - 항상 마지막에 위치 */}
              <Route path="/*" element={<WrongPage />} />
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