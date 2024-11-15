import React from "react";
import { useNavigate } from "react-router-dom";

const Main: React.FC = () => {
  const navigate = useNavigate();

  const handlePageClick = () => {
    navigate("/login");
  };

  return (
    <div
      onClick={handlePageClick}
      className="flex items-center justify-center h-screen bg-black text-white font-custom-font cursor-pointer"
    >
      <div className="text-4xl">Narrativa</div>
    </div>
  );
};

export default Main;
