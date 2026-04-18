import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Nav from "./nav";
import { io } from "socket.io-client";

function Chat() {


    let socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(import.meta.env.VITE_BACKEND_URI);

        return () => {
            socketRef.current.disconnect(); // cleanup
        };
    }, []);

    socketRef.current = io(`${import.meta.env.VITE_BACKEND_URI}`);

    let { id } = useParams();
    let [userData, setUserData] = useState(null);
    let [userName, setUserName] = useState(localStorage.getItem("name"));
    let [friendName, setFriendName] = useState("");
    let [msg, setMsg] = useState();
    let [messages, setMessages] = useState([]);


    useEffect(() => {
        async function datafetch() {
            let getUserData = await fetch(`${import.meta.env.VITE_BACKEND_URI}/get-user-data`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id
                })
            });
            let data = await getUserData.json();
            setUserData(data);
            console.log(data);
            setFriendName(data.name);
        }
        datafetch();
    }, []);

    // আপনার বর্তমান কোডের সাথে এটি যোগ করুন
    useEffect(() => {
        const userId = localStorage.getItem("id");
        if (userId) {
            // সার্ভারে জানানো যে এই ইউজারটি অনলাইনে এসেছে
            socketRef.current.emit("add-user", userId);
        }
    }, []);

    let handleMessage = () => {
        let messageData = {
            senderId: localStorage.getItem("id"),
            reciverId: id,
            text: msg
        }
        socketRef.current.emit("send-message", messageData);
        setMessages((prev) => [...prev, messageData]);
        setMsg("");
    };

    useEffect(() => {
        socketRef.current.on("recive-msg", (data) => {
            console.log(data);
            setMessages((prev) => [...prev, data]);
        });
    }, []);

    useEffect(() => {
        let chatDiv = document.getElementById("chatdiv");

        if (chatDiv) {
            chatDiv.scrollTop = chatDiv.scrollHeight;
        }
    }, [messages]);


    useEffect(() => {
        async function getOldMessages() {
            let res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/get-messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    senderId: localStorage.getItem("id"),
                    reciverId: id
                })
            });

            let data = await res.json();
            setMessages(data); // ✅ পুরানো message বসবে
        }

        getOldMessages();
    }, []);


    return (
        <>
            <div style={{ height: "100vh", width: "100vw" }}>
                <Nav />
                <div style={{ height: "90%", width: "100%", backgroundColor: "blue", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <h6>{userName} chat with {friendName}</h6>
                    <div className="chatdiv" id="chatdiv" style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "10px"
                    }}>
                        {
                            messages.map((m, index) => {
                                let myId = localStorage.getItem("id");

                                return (
                                    <div key={index} style={{
    display: "flex",
    alignItems: "center",
    justifyContent: m.senderId === myId ? "flex-end" : "flex-start",
    gap: "8px"
}}>

    {/* Friend image */}
    {m.senderId !== myId && (
        <img
            src={userData?.profilePic}
            style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%"
            }}
        />
    )}

    {/* Message bubble */}
    <div style={{
        background: m.senderId === myId ? "#4CAF50" : "#555",
        color: "white",
        padding: "10px 14px",
        borderRadius: "18px",
        maxWidth: "40%"
    }}>
        {m.text}
    </div>

    {/* My image */}
    {m.senderId === myId && (
        <img
            src={localStorage.getItem("profilePic")}
            style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%"
            }}
        />
    )}

</div>
                                )
                            })
                        }
                    </div>
                    <div className="inputdiv" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <textarea type="text" name="message" id="message" value={msg} onChange={(e) => setMsg(e.target.value)} />
                        <button onClick={handleMessage}>send</button>
                    </div>
                </div>
            </div>
        </>
    )
}


export default Chat;
