import { useState, useEffect } from 'react';
import NavBarLanding from '../components/LandingPage/NavbarLanding';
import Hero from "../components/LandingPage/Hero";


const LandingPage = () => {  
    const [isLoaded, setIsLoaded] = useState(false);
    
    useEffect(() => {
        setIsLoaded(true);
    }, []);
     
    return(
        <div className={`flex flex-col h-screen w-full bg-gradient-to-br from-white to-violet-50 transition-opacity duration-700 overflow-hidden ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <NavBarLanding/>
            <Hero isLoaded={isLoaded}/>
            
            {/* Animated background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {/* Floating particles */}
                {[...Array(12)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute w-3 h-3 rounded-full bg-violet-600 opacity-10"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float ${8 + i * 3}s infinite ease-in-out ${i * 0.5}s`
                        }}
                    ></div>
                ))}
                
                {/* Background pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(124,58,237,0.03)_1px,_transparent_1px)] bg-[size:24px_24px]"></div>
            </div>
            
            {/* Footer */}
            <footer className="w-full py-3 text-center text-violet-800 bg-white bg-opacity-70 backdrop-blur-sm">
                <p>© 2025 TheCICS - Renard Macorol . DL Cabanilla . Pia Macalanda . Juliana Mancera</p>
            </footer>
            
            {/* Global styles for animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes float {
                        0%, 100% { transform: translateY(0) rotate(0); }
                        50% { transform: translateY(-30px) rotate(8deg); }
                    }
                `
            }} />
        </div>
    );
}

export default LandingPage;