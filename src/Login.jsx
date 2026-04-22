import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "./nav";

function Login() {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let navigate = useNavigate();

    let accountLogin = async (e) => {
        if (!email || !password) {
            return alert("দয়া করে ইমেইল এবং পাসওয়ার্ড দিন।");
        }

        try {
            let loginData = await fetch(`${import.meta.env.VITE_BACKEND_URI}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            let res = await loginData.json();

            // এখানে res.data এর বদলে সরাসরি res ব্যবহার করতে হবে
            if (res.successCode) {
                localStorage.setItem("token", res.token);
                localStorage.setItem("name", res.name);
                localStorage.setItem("email", res.user.email);
                localStorage.setItem("id", res.user._id);
                localStorage.setItem("profilePic", res.user.profilePic);

                setEmail("");
                setPassword("");
                navigate("/");
            } else {
                // যদি লগইন সফল না হয় (যেমন ভুল পাসওয়ার্ড)
                alert(res.msg || "লগইন ব্যর্থ হয়েছে!");
            }
        } catch (err) {
            console.error(err);
            alert("সার্ভারে সমস্যা হচ্ছে, পরে চেষ্টা করুন।");
        }
    };

    // স্টাইলস (রেজিস্টার পেজের সাথে হুবহু মিল রেখে)
    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;500;700&display=swap');

        /* হলুদ স্ক্রলবার */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #0a0e17;
        }
        ::-webkit-scrollbar-thumb {
            background: #ffcc00;
            border-radius: 10px;
        }

        .login-container {
            font-family: 'Hind Siliguri', sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #020617 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #e2e8f0;
            padding: 20px;
        }

        .glass-card {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 24px;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
            margin-top: 50px;
        }

        .input-group {
            margin-bottom: 20px;
        }

        .input-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #94a3b8;
        }

        .input-style {
            width: 100%;
            padding: 14px;
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid #334155;
            border-radius: 12px;
            color: #fff;
            outline: none;
            transition: 0.3s;
            font-size: 16px;
            box-sizing: border-box;
        }

        .input-style:focus {
            border-color: #ffcc00;
            box-shadow: 0 0 10px rgba(255, 204, 0, 0.2);
        }

        .submit-btn {
            width: 100%;
            padding: 16px;
            background: #ffcc00;
            color: #020617;
            border: none;
            border-radius: 12px;
            font-size: 18px;
            font-weight: 700;
            cursor: pointer;
            transition: 0.3s;
            margin-top: 10px;
        }

        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 204, 0, 0.3);
            background: #e6b800;
        }

        .link-text {
            color: #ffcc00;
            text-decoration: none;
            font-weight: 600;
        }
    `;

    return (
        <>
            <style>{styles}</style>
            <div className="login-container">
                <Nav />

                <div className="glass-card">
                    <h1 style={{ textAlign: 'center', marginBottom: '10px', color: '#fff' }}>স্বাগতম! 👋</h1>
                    <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '30px' }}>আপনার অ্যাকাউন্টে লগইন করুন</p>

                    <div className="input-group">
                        <label>ইমেইল ঠিকানা</label>
                        <input
                            className="input-style"
                            type="email"
                            placeholder="example@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>পাসওয়ার্ড</label>
                        <input
                            className="input-style"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button className="submit-btn" onClick={accountLogin}>
                        লগইন করুন
                    </button>

                    <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '14px' }}>
                        একাউন্ট নেই? <Link to="/register" className="link-text">নতুন একাউন্ট খুলুন</Link>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Login;
