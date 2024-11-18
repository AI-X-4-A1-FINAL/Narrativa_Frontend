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
import Settings from "./user_pages/Settings";
import DeleteAccount from "./user_pages/DeleteAccount";
import SignUp from "./user_pages/SignUp";
import Header from "./components/Header";
import GameIntro from "./components/GameIntro";
import GamePage from "./components/GamePage";
import GameEnding from "./components/GameEnding";

const App: React.FC = () => {
  const location = useLocation();

  // Header를 숨길 경로 리스트
  const noHeaderRoutes = [
    "/login",
    "/delete-account",
    "/game-page",
    "/game-ending",
    "/game-intro",
  ];

  return (
    <div className="flex flex-col min-h-screen items-center justify-between bg-black">
      {/* 특정 경로에서는 Header를 숨김 */}
      {!noHeaderRoutes.includes(location.pathname) && <Header />}
      <main className="flex-grow pt-32 px-4 w-full max-w-xl mx-auto bg-white">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/delete-account" element={<DeleteAccount />} />
          <Route path="/game-intro" element={<GameIntro />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/game-page" element={<GamePage />} />
          <Route path="/game-ending" element={<GameEnding />} />
        </Routes>
      </main>
    </div>
  );
};

// `useLocation`을 Router 바깥에서 사용할 수 있도록 Router를 감싼 컴포넌트 생성
const AppWithRouter: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;
