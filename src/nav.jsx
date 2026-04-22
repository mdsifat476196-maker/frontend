import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";

function Nav() {
    let navigate = useNavigate();
    let location = useLocation(); // বর্তমানে কোন পেজে আছেন তা বোঝার জন্য

    let logoutUser = () => {
        let confirmPopup = confirm("আপনি কি নিশ্চিতভাবে লগ আউট করতে চান?");
        if (confirmPopup) {
            localStorage.clear(); // সব ডাটা একবারে ক্লিয়ার করা ভালো
            navigate('/login');
        }
    };

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;500;700&display=swap');

        .nav-container {
            font-family: 'Hind Siliguri', sans-serif;
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 12px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 1000;
            width: 100%;
            box-sizing: border-box;
        }

        .nav-left {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .nav-center {
            display: flex;
            gap: 10px;
            background: rgba(15, 23, 42, 0.5);
            padding: 5px;
            border-radius: 12px;
        }

        .nav-btn {
            background: transparent;
            border: none;
            color: #94a3b8;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: 0.3s;
            font-size: 15px;
        }

        .nav-btn:hover {
            color: #ffcc00;
            background: rgba(255, 204, 0, 0.1);
        }

        .nav-btn.active {
            background: #ffcc00;
            color: #020617;
            font-weight: 700;
        }

        .back-btn {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.1);
            width: 35px;
            height: 35px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: 0.3s;
        }

        .back-btn:hover {
            background: #ffcc00;
            color: #020617;
            border-color: #ffcc00;
        }

        .logout-btn {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.2);
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: 0.3s;
        }

        .logout-btn:hover {
            background: #ef4444;
            color: white;
        }

        @media (max-width: 600px) {
            .nav-btn {
                padding: 6px 10px;
                font-size: 13px;
            }
        }
    `;

    return (
        <>
            <style>{styles}</style>
            <div className="nav-container">
                {/* Left Side: Back Button */}
                <div className="nav-left">
                    <button className="back-btn" onClick={() => navigate(-1)} title="পিছনে যান">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                </div>

                {/* Center Side: Navigation Links */}
                <div className="nav-center">
                    <button 
                        className={`nav-btn ${location.pathname === '/' ? 'active' : ''}`} 
                        onClick={() => navigate("/")}
                    >
                        বন্ধুরা
                    </button>
                    <button 
                        className={`nav-btn ${location.pathname === '/login' ? 'active' : ''}`} 
                        onClick={() => navigate("/login")}
                    >
                        লগইন
                    </button>
                    <button 
                        className={`nav-btn ${location.pathname === '/register' ? 'active' : ''}`} 
                        onClick={() => navigate("/register")}
                    >
                        রেজিস্টার
                    </button>
                </div>

                {/* Right Side: Logout */}
                <div className="nav-right">
                    <button className="logout-btn" onClick={logoutUser}>
                        লগ আউট
                    </button>
                </div>
            </div>
        </>
    );
}

export default Nav;
