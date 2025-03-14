import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CicsLogo from '../global/CicsLogo';
import SwitchTheme from '../global/SwitchTheme';
import Button from '../global/Button';

const NavBarLanding = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSignIn = () => {
    navigate('/SignInPage');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white shadow-md py-2' 
        : 'bg-transparent py-3'
    }`}>
      <div className="w-full px-8 flex items-center justify-between">
        <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
          <CicsLogo />
        </div>
        
        <div className={`flex items-center gap-4 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
          <div className="hidden md:flex items-center space-x-6">
            {/* Place holder only. For future purp - 🍓 */}
            {/* <a href="#features" className="text-violet-900 hover:text-violet-700 transition-colors">Features</a>
            <a href="#about" className="text-violet-900 hover:text-violet-700 transition-colors">About</a>
            <a href="#contact" className="text-violet-900 hover:text-violet-700 transition-colors">Contact</a> */}
          </div>
          
          <Button 
              variant="solid" 
              size="medium"  
              onClick={handleSignIn}
              className="transform hover:scale-105 transition-transform duration-300"> 
              Sign In
          </Button>

          <div className="ml-2">
            <SwitchTheme />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBarLanding;