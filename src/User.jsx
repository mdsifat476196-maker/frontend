import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./nav";

function User() {


    let navigate = useNavigate();
    let [allUser, setAllUser] = useState([]);
    let token = localStorage.getItem("token") || false;

    useEffect(() => {
        if (!token) {
            alert("register or login first.");
            navigate("/register");
            return;
        }
    }, []);

    useEffect(() => {
        async function datafetch() {
            let getUserData = await fetch(`${import.meta.env.VITE_BACKEND_URI}/get-all-users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token: token
                })
            });
            let data = await getUserData.json();
            // console.log(data);
            setAllUser(data);
        }
        datafetch();
    }, []);


    return (
        <>
            <Nav />
            <h3>মামা ভাগিনা চ্যাট নোট</h3>

            <center>
                {
                    allUser.map((item) => {
                        return (
                            <div key={item._id} onClick={(e) => navigate(`/chatpage/${item._id}`)}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", gap: "50px", backgroundColor: "#00bfff", padding: "5px", width: "70%", height: "100%", borderRadius: "25px", cursor: "pointer" }}>
                                    <img src={item.profilePic || "https://res.cloudinary.com/dh5ymy9fa/image/upload/v1776269042/wlaz7lmuywcxyuhuznfv.png"} style={{ height: "30px" }} />
                                    <h3 style={{ color: "black" }}>{item.name}</h3>
                                </div><br />
                            </div>
                        )
                    })
                }
            </center>
        </>
    )
}

export default User;
