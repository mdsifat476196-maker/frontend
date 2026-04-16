import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import "./index.css"
function Nav() {

    let navigate = useNavigate();

    let logoutUser = () => {
        let confirmPopup = confirm("Are you really log out this account");
        if (confirmPopup) {
            localStorage.removeItem("token");
            localStorage.removeItem("name");
            navigate('/login');
        }
    }

    return (
        <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                <button onClick={() => navigate(-1)}>Back</button>
                <div style={{ display: "flex", width: "70%", alignItems: "center", justifyContent: "space-between" }}>
                    <button onClick={(e) => navigate("/login")}>Login</button>
                    <button onClick={(e) => navigate("/register")}>Register</button>
                    <button onClick={(e) => navigate("/")}>All Friend</button>
                </div>
                <div>
                    <button onClick={logoutUser}
                    >Log out</button>
                </div>

            </div>
        </>
    )
}

export default Nav;
