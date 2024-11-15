import React from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "boring-avatars";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const randomName = React.useMemo(
    () => Math.random().toString(36).substring(2, 10),
    []
  );
  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto pt-4 text-black">
      <div className="relative flex flex-col items-center">
        <div className="w-48 h-48 rounded-full overflow-hidden mb-4 flex items-center justify-center">
          <Avatar
            size={190}
            name={randomName}
            variant="beam"
            colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]} // 색상 팔레트
          />
        </div>
        <h1 className="text-3xl font-bold mb-2">poketmon</h1>
        <p className="text-xl mb-4">hi good to see you</p>
        <div className="flex space-x-4">
          <button
            className="px-4 py-2 text-white bg-custom-purple rounded hover:bg-blue-900"
            onClick={() => navigate("/home")}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
