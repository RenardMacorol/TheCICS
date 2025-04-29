import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-52 h-52 relative mb-4 animate-bounce">
        <img 
          src="/Peper.png" 
          alt="Peper Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex items-center space-x-2">
        <div className="h-2 w-2 bg-purple-600 rounded-full animate-pulse"></div>
        <div className="h-2 w-2 bg-violet-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="h-2 w-2 bg-cyan-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <h2 className="text-xl font-semibold mt-4 text-purple-800">Loading theCICS...</h2>
      <p className="text-sm text-gray-500 mt-2">Please wait while we prepare your dashboard</p>
    </div>
  );
};

export default LoadingScreen;