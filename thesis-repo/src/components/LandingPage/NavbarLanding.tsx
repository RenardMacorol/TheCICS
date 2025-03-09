<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
import CicsLogo from "../global/CicsLogo";
import SwitchTheme from "../global/SwitchTheme";

const NavBarLanding = () => {
    const navigate = useNavigate();
    const handleSignIn = async () => {
        navigate('/SignInPage')
    }
    return(
        <nav className="bg-white flex items-center justify-between p-4">
            <div className="flex gap-5">
            <CicsLogo/>
            <span className="text-4xl font-semibold">TheCICS</span>
            </div>
            <div className="flex gap-8">
            <button className="p-3 bg-blue-400 text-2xl rounded-3xl"onClick={handleSignIn}>Sign-In</button>
            <SwitchTheme/>
            </div>
        </nav>
    )
}

export default NavBarLanding;
=======
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
>>>>>>> origin/main
