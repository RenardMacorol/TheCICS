import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
=======
import Button from "../global/Button";
>>>>>>> origin/main

const Hero = () => {
    const navigate = useNavigate();
    const handleSignIn = async () => {
        navigate('/SignInPage')
    }
    return(
<<<<<<< HEAD
        <div className="relative w-full flex-1 flex flex-col items-center justify-center pb-20">
                {/*place holder*/}
                <img className="w-full h-200 object-cover"
                src="animeLanding.jpg"/>
            <button onClick={handleSignIn} className="mt-6 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                Get Started
            </button>
            
            
        </div>
    )
}

export default Hero;
=======
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
>>>>>>> origin/main
