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
      className="flex flex-col items-center justify-center h-screen bg-white text-black font-custom-font cursor-pointer"
    >
      <div className="min-h-screen mt-80 text-4xl">Narrativa</div>
    </div>
  );
};

export default Main;
