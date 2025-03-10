import { useNavigate } from 'react-router-dom';
import CicsLogo from '../global/CicsLogo';
import SwitchTheme from '../global/SwitchTheme';
import Button from '../global/Button';

const NavBarLanding = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/SignInPage');
  };

  return (
    <nav className="bg-white flex items-center justify-between p-4">
        <CicsLogo />
      <div className="flex gap-8">
        <Button 
            variant="solid" 
            size="medium"  
            onClick={handleSignIn}> 
            Sign-In 
        </Button>

        <SwitchTheme />
      </div>
    </nav>
  );
};

export default NavBarLanding;

//🍓
