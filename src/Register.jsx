import React, { useState, useRef } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { Link, useNavigate } from "react-router-dom";
import Nav from "./nav";

function Register() {
    let [name, setName] = useState("");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [fileName, setFIleName] = useState("");
    let [progress, setProgress] = useState(0);
    let [isUploading, setIsUploading] = useState(false);
    let fileRef = useRef();
    let navigate = useNavigate();

    let uploadImage = async (file) => {
        if (!file) return;
        setIsUploading(true);
        try {
            const compressedFile = await imageCompression(file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 800,
                useWebWorker: true
            });

            let sigRes = await fetch(`${import.meta.env.VITE_BACKEND_URI}/get-signature`);
            let { timestamp, signature, api_key, cloud_name } = await sigRes.json();

            let formData = new FormData();
            formData.append("file", compressedFile);
            formData.append("api_key", api_key);
            formData.append("timestamp", timestamp);
            formData.append("signature", signature);

            let res = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, formData, {
                onUploadProgress: (e) => {
                    let percent = Math.round((e.loaded * 100) / e.total);
                    setProgress(percent);
                }
            });

            setFIleName(res.data.secure_url);
            setIsUploading(false);
        } catch (error) {
            console.error(error);
            setIsUploading(false);
            alert("ছবি আপলোড ব্যর্থ হয়েছে!");
        }
    };

    let accountCreation = async () => {
        if (!name || !email || !password || !fileName) {
            return alert("সবগুলো তথ্য সঠিকভাবে দিন।");
        }
        // আপনার আগের লজিক এখানে থাকবে...
        navigate("/");
    };

    // ডার্ক থিম স্টাইলস
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
        ::-webkit-scrollbar-thumb:hover {
            background: #e6b800;
        }

        .register-container {
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
            max-width: 450px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
            margin-top: 30px;
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
        }

        .input-style:focus {
            border-color: #ffcc00;
            box-shadow: 0 0 10px rgba(255, 204, 0, 0.2);
        }

        .upload-area {
            border: 2px dashed #334155;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            cursor: pointer;
            transition: 0.3s;
            background: rgba(15, 23, 42, 0.5);
        }

        .upload-area:hover {
            border-color: #ffcc00;
            background: rgba(255, 204, 0, 0.05);
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

        .submit-btn:disabled {
            background: #334155;
            color: #94a3b8;
            cursor: not-allowed;
        }

        .submit-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 204, 0, 0.3);
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
            <div className="register-container">
                <Nav />
                
                <div className="glass-card">
                    <h1 style={{ textAlign: 'center', marginBottom: '10px', color: '#fff' }}>কি খবর সাইফুর মামু! 👋</h1>
                    <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '30px' }}>আপনার নতুন অ্যাকাউন্ট তৈরি করুন</p>

                    <div className="input-group">
                        <label>নাম</label>
                        <input className="input-style" type="text" placeholder="উদা: সাইফুর" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="input-group">
                        <label>ইমেইল ঠিকানা</label>
                        <input className="input-style" type="email" placeholder="example@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="input-group">
                        <label>পাসওয়ার্ড</label>
                        <input className="input-style" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <div className="input-group">
                        <label>প্রোফাইল ছবি</label>
                        <div className="upload-area" onClick={() => fileRef.current.click()}>
                            {fileName ? (
                                <span style={{ color: '#4ade80' }}>ছবি আপলোড হয়েছে ✅</span>
                            ) : (
                                <span>{isUploading ? `আপলোড হচ্ছে... ${progress}%` : "এখানে ক্লিক করে ছবি বাছুন"}</span>
                            )}
                            <input type="file" hidden ref={fileRef} onChange={(e) => uploadImage(e.target.files[0])} accept="image/*" />
                        </div>
                    </div>

                    {progress > 0 && progress < 100 && (
                        <div style={{ width: '100%', height: '4px', background: '#334155', borderRadius: '2px', marginBottom: '20px' }}>
                            <div style={{ width: `${progress}%`, height: '100%', background: '#ffcc00', transition: '0.3s' }}></div>
                        </div>
                    )}

                    <button className="submit-btn" onClick={accountCreation} disabled={!fileName || isUploading}>
                        রেজিস্ট্রেশন সম্পন্ন করুন
                    </button>

                    <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '14px' }}>
                        ইতিমধ্যে অ্যাকাউন্ট আছে? <Link to="/login" className="link-text">লগইন করুন</Link>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Register;
