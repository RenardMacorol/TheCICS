import SignInButton from "../components/SignInButton";

const SignInPage = () => {
    return(
        <div className="flex h-screen bg-gray-900 text-gray-100">
            {/*left SideBar */} 
            <div className="w-1/2 bg-purple-700 relative flex items-center justify-center">
                {/* Mascot Image */}
                <div className="text-center ">
                <p className="text-2xl font-semibold">Log-in Using Institutional Email</p>
                <SignInButton/>
                </div>

            {/* Logo */}
            <div className="absolute top-6 left-6 bg-gray-800 bg-opacity-60 p-3 rounded-lg">
            <img
                src="/TheCICSFullLogo.png"
                alt="TheCICS Full Logo"
                className="w-10 h-10"
            />
            </div>
            </div>
           
            {/*Right SideBar */}
            <div className="w-1/2 bg-gray-300 text-gray-900 flex flex-col justify-center items-center">
                <img
                    className="w-3/4 h-auto object-contain"
                    src="/Chumchum.png"
                    alt="Chumchum Mascot" 
                    />
            </div>
        </div>
    )
}

export default SignInPage;

// 🚧 WORKING!!!
