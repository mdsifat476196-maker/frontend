import React, { useState, useRef } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression"
import { Link, useNavigate } from "react-router-dom";
import Nav from "./nav";
function Register() {

    let [name, setName] = useState("");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [isFile, setIsFile] = useState("");
    let [fileName, setFIleName] = useState("");
    let [progress, setProgress] = useState(0);
    let fileRef = useRef();

    let navigate = useNavigate();

    let accountCreation = async (e) => {
        console.log(name, email, password);
        if (!name && !email && !password) {
            return alert("fill al field")
        }

        let registerData = await fetch(`${import.meta.env.VITE_BACKEND_URI}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                profilePic: fileName
            })
        })
        let data = await registerData.json();
        console.log(data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name);
        localStorage.setItem("email",data.user.email);
        localStorage.setItem("id",data.user._id);
        localStorage.setItem("profilePic", data.user.profilePic);
        setName("");
        setEmail("");
        setPassword("");
        setProgress(0);
        fileRef.current.value = "";
        if (data.successCode) {
            navigate("/");
        }
    }

    let uploadImage = async (file) => {
        try {
            // 🔹 1. Compress image
            const compressedFile = await imageCompression(file, {
                maxSizeMB: 1,          // max 1MB
                maxWidthOrHeight: 800, // resize
                useWebWorker: true
            });

            let sigRes = await fetch(`${import.meta.env.VITE_BACKEND_URI}/get-signature`);
            let { timestamp, signature, api_key, cloud_name } = await sigRes.json();

            let formData = new FormData();
            formData.append("file", compressedFile);
            formData.append("api_key", api_key);
            formData.append("timestamp", timestamp);
            formData.append("signature", signature);
            setIsFile(true)
            let res = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, formData, {
                onUploadProgress: (e) => {
                    let percent = Math.round((e.loaded * 100) / e.total);
                    setProgress(percent); // 👈 UI তে দেখাবা
                }
            })
            console.log(res);
            console.log(res.data.secure_url);
            setFIleName(res.data.secure_url);
            if (!fileName) {
                return alert("Image upload hoi nai");
            }

        } catch (error) {
            console.log(error.name);
            console.log(error.message);
        }
    }

    return (
        <>
            <center>
                <Nav />
                <h2>কি খবর সাইফুর মামু</h2>
                <h2>Register account</h2>
                <p>Name : </p>
                <input type="text" name="name" id="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required /><br /><br />
                <p>Email : </p>
                <input type="email" name="email" id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br /><br />
                <p>Password : </p>
                <input type="password" name="password" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br /><br />

                <p>Profile photo</p>
                <input type="file" accept="image/*" onChange={(e) =>
                    uploadImage(e.target.files[0])
                }
                    ref={fileRef}
                    required />
                <br /><br />

                {progress > 0 && (
                    <h1> file uploded : {progress}%</h1>
                )}

                <button onClick={accountCreation}
                    disabled={!fileName}
                >create account</button><br /><br />



                <h3>
                    যদি তোমার একাউন্ট থাকে তবে
                    <Link to={"/login"}> Login </Link>
                    করো
                </h3>

            </center>
        </>
    )
}

export default Register;
