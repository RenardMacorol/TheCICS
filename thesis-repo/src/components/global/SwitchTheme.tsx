import { useState } from 'react';

const SwitchTheme = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    // Toggle between light and dark mode
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        // This is a placeholder - in real implementation, you'd update a context or localStorage
        console.log("Theme switched to:", !isDarkMode ? "dark" : "light");
        
        // For demonstration purposes, we'll toggle a class on the body
        // In a real implementation, you'd use a theme context or similar
        if (!isDarkMode) {
            document.documentElement.classList.add('dark-theme');
        } else {
            document.documentElement.classList.remove('dark-theme');
        }
    };
    
    return (
        <button 
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
            aria-label="Toggle theme"
        >
            {isDarkMode ? (
                // Sun icon for light mode
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ) : (
                // Moon icon for dark mode
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )}
        </button>
    );
};

export default SwitchTheme;