import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./nav";

function User() {
    let navigate = useNavigate();
    let [allUser, setAllUser] = useState([]);
    let token = localStorage.getItem("token") || false;

    useEffect(() => {
        if (!token) {
            alert("মামা, আগে লগইন অথবা রেজিস্ট্রেশন করুন!");
            navigate("/login");
            return;
        }
    }, [token, navigate]);

    useEffect(() => {
        async function datafetch() {
            try {
                let getUserData = await fetch(`${import.meta.env.VITE_BACKEND_URI}/get-all-users`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: token })
                });
                let data = await getUserData.json();
                setAllUser(data);
            } catch (err) {
                console.error("Data fetch error:", err);
            }
        }
        datafetch();
    }, [token]);

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;500;700&display=swap');

        .user-page {
            font-family: 'Hind Siliguri', sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #020617 100%);
            min-height: 100vh;
            color: white;
            padding-bottom: 40px;
        }

        .title {
            text-align: center;
            padding: 30px 0;
            font-size: 2rem;
            background: linear-gradient(to right, #ffcc00, #f97316);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 700;
        }

        .user-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            padding: 0 15px;
        }

        .user-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(30, 41, 59, 0.4);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            width: 100%;
            max-width: 450px;
            padding: 12px 20px;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .user-card::before {
            content: '';
            position: absolute;
            top: 0; left: -100%;
            width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 204, 0, 0.1), transparent);
            transition: 0.5s;
        }

        .user-card:hover::before {
            left: 100%;
        }

        .user-card:hover {
            transform: translateY(-5px);
            background: rgba(30, 41, 59, 0.7);
            border-color: #ffcc00;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        .profile-section {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .user-avatar {
            width: 55px;
            height: 55px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #ffcc00;
            padding: 2px;
            background: #0f172a;
        }

        .user-name {
            font-size: 1.1rem;
            font-weight: 600;
            color: #f8fafc;
        }

        .status-dot {
            width: 10px;
            height: 10px;
            background: #4ade80;
            border-radius: 50%;
            box-shadow: 0 0 10px #4ade80;
        }

        .chat-btn-icon {
            color: #ffcc00;
            opacity: 0.7;
            transition: 0.3s;
        }

        .user-card:hover .chat-btn-icon {
            opacity: 1;
            transform: translateX(3px);
        }
    `;

    return (
        <div className="user-page">
            <style>{styles}</style>
            <Nav />
            <h1 className="title">মামা ভাগিনা চ্যাটবক্স 💬</h1>

            <div className="user-container">
                {allUser.length > 0 ? (
                    allUser.map((item) => (
                        <div 
                            key={item._id} 
                            className="user-card" 
                            onClick={() => navigate(`/chatpage/${item._id}`)}
                        >
                            <div className="profile-section">
                                <img 
                                    className="user-avatar"
                                    src={item.profilePic || "https://res.cloudinary.com/dh5ymy9fa/image/upload/v1776269042/wlaz7lmuywcxyuhuznfv.png"} 
                                    alt={item.name}
                                />
                                <div className="user-info">
                                    <div className="user-name">{item.name}</div>
                                    <div style={{fontSize: '12px', color: '#94a3b8'}}>ক্লিক করে চ্যাট করুন</div>
                                </div>
                            </div>
                            
                            <div className="chat-btn-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{marginTop: '50px', color: '#64748b'}}>লোডিং হচ্ছে অথবা কোনো বন্ধু নেই...</div>
                )}
            </div>
        </div>
    );
}

export default User;
