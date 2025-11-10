import React from 'react';
import Enter from './enter';

const Home = () => {
    const handleLogout = () => {
        // Add logout logic here
        alert('Logout functionality would go here!');
    };

    return (
        <div>
            <header>
                <h1>Jane Translator</h1>
                <nav>
                    <ul>
                        <li><a href="#logout" onClick={handleLogout}>👋 Logout</a></li>
                    </ul>
                </nav>
            </header>
            <main>
                <Enter />
            </main>
        </div>
    );
};

export default Home;