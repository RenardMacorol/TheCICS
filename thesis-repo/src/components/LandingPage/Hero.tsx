import { useNavigate } from "react-router-dom";
import Button from "../global/Button";

const Hero = () => {
    const navigate = useNavigate();
    const handleSignIn = async () => {
        navigate('/SignInPage')
    }
    return(
        <div className="relative w-full flex-1 flex items-center justify-center pb-20">
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl px-4">
            {/* Mascot Image */}
            <div className="flex-1 flex justify-center md:justify-start mb-8 md:mb-0">
                <img
                    className="w-80 h-auto md:w-96 lg:w-[42rem] object-contain"
                    src="Peper.png"
                    alt="Mascot"
                />
            </div>

            {/* Text Content */}
            <div className="flex-1 text-center md:text-left">
                <h1 className="text-6xl md:text-6xl lg:text-8xl font-bold mb-4">
                    Hello World!💜
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-6">
                    The New Era University College of Informatics and Computing Studies Thesis Repository
                </p>
                
          <Button
            variant="whitePurple"
            size="medium"
            onClick={handleSignIn}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;

// 🍓