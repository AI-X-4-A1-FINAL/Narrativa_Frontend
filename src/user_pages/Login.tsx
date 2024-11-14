import React from 'react';

const Login: React.FC = () => {
  return (
        <div className="w-full max-w-xs space-y-4">
            <button className="w-60 py-3 text-yellow-800 bg-custom-yellow rounded-md flex justify-center items-center">
              <img src="/images/kakao.png" alt="Kakao Icon" className="w-5 h-5 mr-2" />
              <span>Login with Kakao</span>
            </button>
            <button className="w-60 py-3 text-black bg-white border-black border rounded-md flex justify-center items-center">
              <img src="/images/google_icon.png" alt="Google Icon" className="w-5 h-5 mr-2" />
              <span>Login with Google</span>
            </button>
            <button className="w-full py-3 text-white bg-black rounded-md flex justify-center items-center">
              <img src="/images/github-mark-white.png" alt="GitHub Icon" className="w-5 h-5 mr-2" />
              <span>Login with GitHub</span>
            </button>
        </div>

);
};

export default Login;
