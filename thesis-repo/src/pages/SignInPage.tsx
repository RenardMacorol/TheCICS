import SignInButton from "../components/SignInButton";

const SignInPage = () => {
    return(
        <div className="flex h-screen bg-gray-900 text-gray-100">
<<<<<<< HEAD
            {/*left SideBar */}
            <div className="w-1/2 bg-gray-300 relative">
                {/*Bg image */}
                <img className="w-full h-full object-cover"
                src="/AnimeLogin.jpg"/>
                <div className="absolute top-6 left-6 flex items-center
                gap-3 bg-gray-800 bg-opacity-60 p-3 rounded-lg">
                    <div className="w-1/2 bg-gray-300 flex flex-row ">
                    <img src="none" alt="Logo" className="w-10 h-10 rounded-full"/>
                    <div className="w-20 h-20 bg-gray-400 rounded-full flex ">
                    {/*This Place Holder for Icon */}
                    <span>X</span>
 
                </div>
           </div>
            <p className="mt-6 text-2xl font-semibold text-white-700">TheCICS</p>
            </div>
 
            </div>
           
            {/*Right SideBar */}
            <div className="w-1/2 bg-gray-300 text-gray-900 flex flex-col justify-center items-center">
=======
            {/*left SideBar */} 
            <div className="w-1/2 bg-purple-700 relative flex items-center justify-center">
                {/* Mascot Image */}
>>>>>>> origin/main
                <div className="text-center ">
                <p className="text-2xl font-semibold">Log-in Using Institutional Email</p>
                <SignInButton/>
                </div>
<<<<<<< HEAD
=======

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
>>>>>>> origin/main
            </div>
        </div>
    )
}

<<<<<<< HEAD
export default SignInPage;
=======
export default SignInPage;

// 🚧 WORKING!!!
>>>>>>> origin/main
