import React, { useState, useRef } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const fileRef = useRef();

  const navigate = useNavigate();

  const accountCreation = async () => {
    if (!name || !email || !password) {
      return alert("Fill all fields");
    }

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, profilePic: fileName })
    });

    const data = await res.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.name);
    localStorage.setItem("email", data.user.email);
    localStorage.setItem("id", data.user._id);
    localStorage.setItem("profilePic", data.user.profilePic);

    if (data.successCode) navigate("/");
  };

  const uploadImage = async (file) => {
    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true
      });

      const sigRes = await fetch(`${import.meta.env.VITE_BACKEND_URI}/get-signature`);
      const { timestamp, signature, api_key, cloud_name } = await sigRes.json();

      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("api_key", api_key);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        formData,
        {
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setProgress(percent);
          }
        }
      );

      setFileName(res.data.secure_url);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none"
        />

        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={(e) => uploadImage(e.target.files[0])}
          className="w-full mb-4 text-sm"
        />

        {progress > 0 && (
          <div className="mb-4">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm mt-1">Uploading: {progress}%</p>
          </div>
        )}

        <button
          onClick={accountCreation}
          disabled={!fileName}
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
        >
          Sign Up
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
