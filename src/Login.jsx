import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "./nav";
function Login() {


    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let navigate = useNavigate();

    let accountLogin = async (e) => {
        console.log(name, email, password);

        let loginData = await fetch(`${import.meta.env.VITE_BACKEND_URI}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        let data = await loginData.json();
        console.log(data);
        console.log(data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("id", data.user._id);
        setEmail("");
        setPassword("");
        if (data.successCode) {
            navigate("/")
        }
    }

    return (
        <>
            <center>
                <Nav />
                <h2>Login account</h2>
                <input type="email" name="email" id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} /><br /><br />
                <input type="password" name="password" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} /><br /><br />

                <button onClick={accountLogin}>login account</button><br /><br /><br />

                <h3>
                    যদি তোমার একাউন্ট না থাকে তবে
                    <Link to={"/register"}> Register </Link>
                    করো
                </h3>

            </center>
        </>
    )
}

export default Login;