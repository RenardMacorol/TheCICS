import { useState, useEffect } from "react";
import SignInButton from "../components/SignInButton";

const SignInPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    
    // Simple animation sequence
    const intervalId = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 3);
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex h-screen bg-white text-gray-100 overflow-hidden">
      {/* Left Sidebar */}
      <div className={`w-1/2 bg-violet-700 relative flex items-center justify-center transition-all duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0 translate-x-[-50px]'}`}>
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-violet-900 animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.2)_1px,_transparent_1px)] bg-[size:20px_20px]"></div>
        </div>
          
        {/* Login Container */}
        <div className={`text-center bg-gray-900 bg-opacity-40 p-12 rounded-xl backdrop-blur-sm shadow-2xl transition-all duration-500 ease-in-out ${isLoaded ? 'scale-100' : 'scale-95'}`}>
          <h1 className="text-3xl font-bold mb-4 text-white">Welcome to TheCICS!</h1>
          <p className="text-xl font-semibold mb-10 text-violet-200">Log in using your institutional email.</p>
          
          <div className="transform hover:scale-105 transition-transform duration-300 mb-8">
            <SignInButton />
          </div>
          
          <div className="mt-8 text-violet-200 text-sm">
            <p>🔐 Secure access to your collaborative workspace.</p>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-4 h-4 bg-white rounded-full opacity-30"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${5 + i * 2}s infinite ease-in-out`
              }}
            ></div>
          ))}
        </div>

        {/* Logo */}
        <div className="absolute top-8 left-8 bg-opacity-60 p-4 rounded-lg shadow-lg transform hover:scale-110 transition-transform duration-300">
          <img
            src="/TheCICSFullLogo.png"
            alt="TheCICS Full Logo"
            className="w-auto h-10 object-contain"
          />
        </div>
      </div>
      
      {/* Right Sidebar */}
      <div className="w-1/2 bg-white text-gray-900 flex flex-col justify-center items-center relative">
        {/* Subtle pattern background */}
        <div className="absolute inset-0 bg-violet-50 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(124,58,237,0.1)_1px,_transparent_1px)] bg-[size:20px_20px]"></div>
        </div>
        
        {/* Mascot container with animation */}
        <div className={`relative w-3/4 transition-all duration-700 ease-in-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <img
            className={`w-full h-auto object-contain transition-all duration-500 ease-in-out ${
              animationStep === 0 ? "transform scale-100" : 
              animationStep === 1 ? "transform scale-105" : 
              "transform scale-100 rotate-2"
            }`}
            src="/Chumchum.png"
            alt="Chumchum Mascot" 
          />
          
          {/* Speech bubble */}
          <div className={`absolute top-0 right-0 bg-violet-600 text-white p-4 rounded-2xl shadow-lg transform -translate-y-4 transition-opacity duration-300 ${animationStep === 1 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-violet-600 transform rotate-45"></div>
            <p className="text-lg font-medium">Yow~ Musta, lods!</p>
          </div>
        </div>
        
        {/* Bottom info */}
        <div className="absolute bottom-10 text-center">
          <p className="text-violet-800 font-medium">TheCICS | Ren DL Pia Juls © 2025 • All rights reserved</p>
        </div>
      </div>
      
      {/* Fixed global styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
        `
      }} />
    </div>
  );
};

export default SignInPage;