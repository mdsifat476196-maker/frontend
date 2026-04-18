import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Nav from "./nav";
import { io } from "socket.io-client";

function Chat() {

    const socketRef = useRef(null);
    const { id } = useParams();

    const [userData, setUserData] = useState(null);
    const [userName] = useState(localStorage.getItem("name"));
    const [friendName, setFriendName] = useState("");
    const [msg, setMsg] = useState("");
    const [messages, setMessages] = useState([]);

    const myId = localStorage.getItem("id");
    const myProfile = localStorage.getItem("profilePic");

    // ✅ socket connect (ONLY ONCE)
    useEffect(() => {
        socketRef.current = io(import.meta.env.VITE_BACKEND_URI);

        // add user
        if (myId) {
            socketRef.current.emit("add-user", myId);
        }

        // receive message
        socketRef.current.on("recive-msg", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    // ✅ get friend data
    useEffect(() => {
        async function datafetch() {
            let res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/get-user-data`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id })
            });

            let data = await res.json();
            setUserData(data);
            setFriendName(data.name);
        }

        datafetch();
    }, [id]);

    // ✅ get old messages
    useEffect(() => {
        async function getOldMessages() {
            let res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/get-messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    senderId: myId,
                    reciverId: id
                })
            });

            let data = await res.json();
            setMessages(data);
        }

        getOldMessages();
    }, [id]);

    // ✅ auto scroll
    useEffect(() => {
        let chatDiv = document.getElementById("chatdiv");
        if (chatDiv) {
            chatDiv.scrollTop = chatDiv.scrollHeight;
        }
    }, [messages]);

    // ✅ send message
    const handleMessage = () => {
        if (!msg.trim()) return;

        let messageData = {
            senderId: myId,
            reciverId: id,
            text: msg
        };

        socketRef.current.emit("send-message", messageData);
        setMessages((prev) => [...prev, messageData]);
        setMsg("");
    };

    return (
        <div style={{ height: "100vh", width: "100vw" }}>
            <Nav />

            <div style={{
                height: "90%",
                width: "100%",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }}>

                <h4 style={{ textAlign: "center", color: "white" }}>
                    {userName} chat with {friendName}
                </h4>

                {/* CHAT AREA */}
                <div id="chatdiv" style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "10px"
                }}>
                    {
                        messages.map((m, index) => (
                            <div key={index} style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: m.senderId === myId ? "flex-end" : "flex-start",
                                gap: "8px"
                            }}>

                                {/* Friend Image */}
                                {m.senderId !== myId && (
                                    <img
                                        src={userData?.profilePic}
                                        alt=""
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            borderRadius: "50%"
                                        }}
                                    />
                                )}

                                {/* Message */}
                                <div style={{
                                    background: m.senderId === myId ? "#4CAF50" : "#444",
                                    color: "white",
                                    padding: "10px 14px",
                                    borderRadius: "18px",
                                    maxWidth: "40%"
                                }}>
                                    {m.text}
                                </div>

                                {/* My Image */}
                                {m.senderId === myId && (
                                    <img
                                        src={myProfile}
                                        alt=""
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            borderRadius: "50%"
                                        }}
                                    />
                                )}
                            </div>
                        ))
                    }
                </div>

                {/* INPUT */}
                <div style={{
                    display: "flex",
                    padding: "10px",
                    gap: "10px"
                }}>
                    <textarea
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        style={{
                            flex: 1,
                            borderRadius: "10px",
                            padding: "10px"
                        }}
                    />
                    <button
                        onClick={handleMessage}
                        style={{
                            padding: "10px 20px",
                            borderRadius: "10px",
                            background: "#4CAF50",
                            color: "white",
                            border: "none"
                        }}
                    >
                        Send
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Chat;
