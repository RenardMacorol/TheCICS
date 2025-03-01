import NavBarLanding from '../components/LandingPage/NavbarLanding';
import Hero from "../components/LandingPage/Hero";

const LandingPage = () => {  
     
    return(
        <div className="flex flex-col min-h-screen w-full gap-0">
            <NavBarLanding/>
            <Hero/>
        </div>
    );
}

export default LandingPage;