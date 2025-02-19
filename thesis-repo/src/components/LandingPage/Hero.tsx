import { useNavigate } from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate();
    const handleSignIn = async () => {
        navigate('/SignInPage')
    }
    return(
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