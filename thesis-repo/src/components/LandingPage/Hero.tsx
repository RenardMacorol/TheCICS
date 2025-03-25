import { useNavigate } from "react-router-dom";
import Button from "../global/Button";
import React from "react";

// Define the type for props
interface HeroProps {
  isLoaded: boolean;
}

const Hero: React.FC<HeroProps>= ({ isLoaded }) => {
    const navigate = useNavigate();
    
    const handleSignIn = async () => {
        navigate('/SignInPage');
    };
    
    return (
        <div className="relative w-full flex-1 flex items-center justify-center pt-16 pb-4 z-10">
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mx-auto px-8 md:px-10 lg:px-12">
                {/* Mascot Image with animation */}
                <div className={`flex-1 flex justify-center md:justify-start mb-8 md:mb-0 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}>
                    <div className="relative">
                        <img
                            className="w-auto h-auto md:w-96 lg:w-[32rem] xl:w-[36rem] object-contain drop-shadow-xl transform hover:scale-105 transition-transform duration-500"
                            src="Peper.png"
                            alt="Mascot"
                        />
                        
                        {/* Decorative elements */}
                        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-violet-100 -z-10"></div>
                        <div className="absolute top-1/4 -right-4 w-12 h-12 rounded-full bg-violet-200 -z-10"></div>
                    </div>
                </div>

                {/* Text Content with animations */}
                <div className={`flex-1 text-center md:text-left transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}>
                    <div className="relative">
                        <h1 className="text-5xl md:text-5xl lg:text-7xl font-bold mb-4 text-gray-800 relative">
                            Hello World!
                            {/* <span className="text-violet-600">💜</span> Will remove the heart na  :(( */}
                            <div className="absolute -bottom-2 left-0 w-24 h-2 bg-violet-500 rounded-full transform origin-left transition-transform duration-1000 delay-300"></div>
                        </h1>
                        
                        <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-lg">
                            The New Era University College of Informatics and Computing Studies Thesis Repository
                        </p>
                        
                        <div className={`transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <Button
                                variant="whitePurple"
                                size="medium"
                                onClick={handleSignIn}
                                className="transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                            >
                                Get Started
                            </Button>
                        </div>
                    </div>
                    
                    {/* Decorative floating items */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-300 to-purple-200 rounded-full blur-3xl opacity-20 -z-10"></div>
                </div>
            </div>
        </div>
    );
};

export default Hero;