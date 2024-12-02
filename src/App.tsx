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
import GamePage from "./components/GamePage";
import GameEnding from "./components/GameEnding";
import WrongPage from "./action/WrongPage";
import Loading from "./action/Loading";
import { DarkModeProvider } from "./Contexts/DarkModeContext";
import { NotificationProvider } from "./Contexts/NotificationContext";
import NotificationList from "./user_pages/NotificationList";
import Notification from "./components/Notification";

const AppContent: React.FC = () => {
  const location = useLocation();

  // Main 페이지(`/`) 여부 확인
  const isMainPage = location.pathname === "/";

  // Header를 숨길 경로 리스트
  const noHeaderRoutes = ["/login", "/delete-account", "/", "/game-page"];

  // Skip pt-32 for specific routes (including /bookmarks)
  const noPaddingRoutes = ["/bookmarks"];

  // Determine whether padding is required
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
            className={`flex-grow w-full max-w-lg mx-auto bg-white dark:bg-gray-900 dark:text-white
              ${isHeaderVisible && isPaddingRequired ? "pt-32 px-4" : ""}`}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/delete-account" element={<DeleteAccount />} />
              <Route path="/game-intro" element={<GameIntro />} />
              <Route path="/game-page" element={<GamePage />} />
              <Route path="/game-ending" element={<GameEnding />} />
              <Route path="/*" element={<WrongPage />} />
              <Route path="/loading" element={<Loading />} />
              <Route path="/notification-list" element={<NotificationList />} />
              <Route path="/notification/:id" element={<Notification />} />
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
      {" "}
      {/* 다크 모드 상태를 전역적으로 제공 */}
      <AppContent />
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
