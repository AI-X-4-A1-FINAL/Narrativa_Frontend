import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './user_pages/Main';
import Login from './user_pages/Login';
import Home from './user_pages/Home';
import Profile from './user_pages/Profile';
import Bookmarks from './user_pages/Bookmarks';
import Settings from './user_pages/Settings';
import DeleteAccount from './user_pages/DeleteAccount';
import Footer from './components/Footer';
import Header from './components/Header';



const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col items-center justify-center h-screen max-w-lg mx-auto border shadow-lg">
        <Header />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/delete-account" element={<DeleteAccount />} />
          </Routes>
        </main>
        <Footer />
      </div>  
    </Router>
  );
};

export default App;
