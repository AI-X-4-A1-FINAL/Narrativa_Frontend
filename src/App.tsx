import React from "react";
import { Provider } from 'react-redux';
import store from './store';
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
import SignUp from "./user_pages/SignUp";

const App: React.FC = () => {
  const location = useLocation();

  // Main 페이지(`/`) 여부 확인
  const isMainPage = location.pathname === "/";

  // Header를 숨길 경로 리스트
  const noHeaderRoutes = ["/login", "/delete-account", "/", "/game-page"];

  return (
    <>
      {isMainPage ? (
        <Main />
      ) : (
        <div className="flex flex-col min-h-screen items-center justify-between bg-black">
          {!noHeaderRoutes.includes(location.pathname) && <Header />}
          <main className="flex-grow pt-32 px-4 w-full max-w-xl mx-auto bg-white">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/delete-account" element={<DeleteAccount />} />
              <Route path="/game-intro" element={<GameIntro />} />
              <Route path="/game-page" element={<GamePage />} />
              <Route path="/sign-up" element={<SignUp />} />
            </Routes>
          </main>
        </div>
      )}
    </>
  );
};

const AppWithRouter: React.FC = () => (
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>
  </Provider>
);

export default AppWithRouter;
