import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Nav from "./nav";
import { io } from "socket.io-client";

function Chat() {
    let socketRef = useRef(null);
    let { id } = useParams();
    let [userData, setUserData] = useState(null);
    let [friendName, setFriendName] = useState("");
    let [friendPic, setFriendPic] = useState("");
    let [msg, setMsg] = useState("");
    let [messages, setMessages] = useState([]);

    // LocalStorage থেকে নিজের তথ্য
    const myId = localStorage.getItem("id");
    const myPic = localStorage.getItem("profilePic") || "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAlAMBEQACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAAAgUGAQQHA//EADwQAAEDAwAGBwcCBAcBAAAAAAEAAgMEBREGEiExQVETImFxgZGhBxQyQlLB0bHhI3KCwjNDYpKisvA0/8QAGgEBAAMBAQEAAAAAAAAAAAAAAAEEBQMCBv/EAC4RAAICAgAFAwMDBQEBAAAAAAABAgMEEQUSITFBEzJRImGRcYGxI0Kh0fFDFf/aAAwDAQACEQMRAD8A7igBACAEBjKAjrhe6Ghy2WXWkH+WwZP7LvVjW2dkV7Mmuvuyv1ellQ/IpYGRN4F51ir8OHxXueylPPk/aiInvNxnz0lZLt+k6o9FajjUx7RKssi2XeRpSTyyH+JLI7+ZxK6qEV2Rycm+7PPWI2tcR3L1ojZ6x19ZCcxVc7ccpCvDqrl3ij2rbI9pM36bSi6wfHM2ZvKRo/UYKrzwaZeNfodoZt0fOycoNM6WUhtdC6A/U3rt/Kp2cOnHrB7LlfEIPpNaLJTVMFTE2WnlZJG7c5hyFRlGUHqS0XozjNbi9nsvJ6BACAEAIAQAgBAa1dWwUMJlqZAxvAcSeQHFe4VysfLE8WWRrXNIp910hqazLKcmCE/Ses7vP4WtRhwh1l1Zk3Zk7Okei/yQhV0pikoBCVJApKAUqQKSgFJUgUoQe1FXVVBN0tJM6N3HG53eOK8WVQsWpI912Tre4su1h0sgri2nrdWCoOwHPUf+D2LIycGVf1Q6r/JrY+bGzpPoyzDcqBeMoAQAgBACA0Ltc4bdT68nWedjGDe4/hdqaZXS0jhffGqO2USurp66YzVDsngBuaOQW3VVGuOomLbbKyW5GqSupzEJQCkqSBSeKA9oKKrqhmnpZ5RzZGSPPcvEra4e6SPca5y9sWeslmubBl1BUeDM/ovKyaX2kj26LV/ayPka5ji17XNcN4cMELsmmto5NNPTEJUnkQlSBSUAp3KSC2aLaVGncyiubyYcgRzOO1nIHs7eCzMvCUvrr7/BpYuY4/RPt8l9BBGQsc1jKAEAIDWr6yKhpX1Exw1o3DeTyXuut2S5YniyxVx5pHPrhWy11U6ec9Y7hwaOAC3qqo1x5UYNtjslzM1SV1OYpKAQlSQNBDLUzshgYXyPOA0DevMpxguaXY9Ri5Plj3LtZtGaaka2Wsa2efiHbWN7hx7z6LHvzZz6R6I16MOEOsurLAGgAADAG4BUi7oMBAatfb6Svj1KuBkg4EjaO47wvdds63uL0c7KoWLUkULSPR2W0npoS6WkJ+I/Ew9vZ2raxctXfTLuZGTiOr6l2K+SrpTFJUgUlCBSdgQF20H0hLi211kmTup3uO//AEfhZOfi6/qw/c1MHJ/85/sXgLKNQEBg7kBR9J7l75WGCM5hhJGz5ncT9ls4dHJDmfdmNmXepPlXZfyQhKulMQlAKSpIFJQF20NtjYKT32Ro6WcdXPyt/ff5LGzrnKfIuyNfBo5Yc77ssqol8EAIAQHnPFHNE+KVgfG8Yc08QpTcXtdyJJSWmcovlvNruc1KSS0HLCeLTu/HgvpMe31a1M+evq9KxwI4ldjiKSgFKkGA9zHNexxa5pyHDYQexGk1phNrqjrOi93F4tcc7iOnZ1Jmj6hx8d6+byqPRs5fHg38a71Yb8+SYVcskbf673G2ySNP8R3UZjmf/ZXfGq9S1Ir5Nnp1tnPScbMrfMIUlAISpIFJQGGtMr2xt2F5DR3nYjelslLb0dYhY2JjY2DDWNDQOQC+Zb29n0iWlo9FBIIAQAgA7kBR/aRTgGhqRvOtG7t3Efda3DJe6P7mVxKPWMv2KSStUzBCVIMEoQKSpBYNBbp7he2RPOIar+G7kHfKfPZ4qln0+pVtd0XMK307deGdTByvnjdKdppVF9XDTA9WNmsR2n9h6rX4fDUXP5MrPnuSj8FaJWgZ4pKkgUlAKSpBmGQRTxSO3Me1x8DleZLcWj1F6kmdbbt2hfMn0hlACAEAIAQFK9pUzRT0EOdrnvf5AD+5anDF9UmZnEn0iiiFbBlCkoQKSpAhKkGA9zXB0ZLXtOWuHAo0mtMba6o7ZaaxtwtlNVt2dNG12ORxt9V8rbB12OHwfS1T54KXyUO+zdPd6uTP+YWjuGz7Lbxo8tMUYmRLmukyOJVg4CkoBSVIFJQCE89ylA6TorcRX2qPWcOmhHRyDPLcfEL5/Lp9K1/D7G7iW+pWm+6JlViyCAEAIDB3IDlmmVzFyvL+iIMEA6JhHHG8+f6L6DCp9Orr3ZgZlvqW9OyIElXCqKSpAhKkCkoBSUB072eVzDo6IpHf4Mz2juJ1v7lg8Rg/X38o2uHzXo6+GVeof0k8jz8z3HzK1YLUUjKk9ybPElejyKSpApKAUlSBChBu2a6z2mtE8I1mHZJHnY4flcb6I3R5X+TtRdKmXMjpVsudLc6cTUkgcPmafiaeRCwLaZ1S5ZI3aroWrcWbq5nQEBgnCApel2lTGRyUFrkDpXdWWZhyGjiGnif0Wnh4Tb9SxdDMy8xJclb6lCJ7FsmSKSpAhKkCkoBSUApKkgmbFdzQUskYcRrSF3oB9lVyKPUkmWse704tfc2ndVxbyOF6RyYhKkgUlAKSpApKEG1bbbV3OUx0cRfj4nE4a3vK5W3QqW5M6VUzteoo97lo5c7dCZpoQ+Mb3RHW1e9eKsymx8qfU6W4tta20RlPVT0sonpZnxPG5zDhWJQjNcsls4RnKD5osn6XTe5wtDZmQVAHEgtd5jZ6KjPh1Un0bRdhxC2K+pbPeTT6q1cR0MIPNzyfwvC4ZDzJnp8Sl4iQd00julzYWVFRqRHfHCNVvjxPiVbqxKauqXX7lW3Kts6N/gjqSkqK2dtPSROlldua39TyC7znGC5pvRxhCU3yxW2TFVodeaeAzGGOTAyWRP1neXHwVWHEKJPW9FqWDdGO9FcdkHB4HG1XimKSgFJQCkqSBSUB6wQSTNLmZwDheZSS7nuMXLsWW5M6G4VUZGNWVw9VWqfNXF/Y62rlskvuapK6HMUlSBSdiEG9ZbXLd60QRZbG3bLJj4R+VwyL40Q5mdqKJXS0jplBRQUFMynpWBkbfMnmTxKwLLJWS5pPqb1dca48sexsEZXg9kBdNEbbXOdIxpppT80WMHvG5XKs66tafVFO3Cqse10ZXqjQSta4+71lPI3hrgtP3V2PE4P3RaKkuGz/ALWeDdBrq49aWlaP53H7L2+JUrwzx/8APt+USVDoBEHB1fWvkH0RN1fU5XCfE2/ZH8neHDV/fL8Fqt1so7bF0dFAyJp3kDa7vO8rNstnY9zey/XVCtaijbIyvB0KbppouKuN9wtzAKlu2WNo/wAUc/5v1Wlg5nI1XZ2/gzszF5/rh3Ob5yMhbhjbFJUgUlAISpBetBLQKy0TTPbnNQ4DuDWrJz7nC1JfBqYNSlW2/kbS+n6C+TP3NmaHjywfUL1gz5qUvg5ZsOW5/chCVcKgpKkgw0Oe5rGAlzjgAcSm0lthLb0jqGj1rbareyHAMrhrSu5u/ZfO5FztscvHg+gx6VVWo+SUXA7ggBAGEAYQAgBACAwdyA5Xp9ZRbLkKuBmrTVZJxwY/iPHf5rf4ff6lfI+6/gw86j058y7MqpK0CiISpBgnmgOyaD0bqHRiiY8YfI0yu/qJI9CF8znWepkSf7fg+hw6+SlJ/r+TV07oukoYqxo2wO1XY+l2PvjzXbh1nLNwfk4cQr3BTXgopWyZApKkE5oVRCrvbZHjLKZvSdmtub9z4Kln28lWl5LeFXz27fg6SsI3AQAgBACAEAIAQAgBAQmmNuFy0fqog3Wkjb0sWN+s3aPPaPFWcS30roy/YrZdXqVNHGMg4I3L6c+eMEoDas1A663aloW5xM/Duxo2uPkCud9qqrlP4PdVfqzUfk7sxoYwNYAGtGAOQXye99T6ZISrgjqaaSCVuWSNLSOwr1GThJSXgicVOLi/Jyi40klBWy0s3xxuxn6hwPiF9JVYrIKS8nztlbrm4s1CV0PBa/Z9VRR1dTTSECSVoczPHG8eqzeJwbjGXhGhw+aUnH5L7lY5rggBACAEAIAQAgBACA1LnWQUNBPVVLg2KJhc7PHs7yvdcHZNRj3ZzsmoQcmcHc7WJdjGTnHJfWnzLexCVJB0b2XWbo4pbvO3bKDHBkfL8zvE7PBYnFL9tVLx1Zr8Op0na/Pb9DoCyTUAoCsaZ2Y11MKumbmpgG1oHxs5d44eKv4OR6cuSXZ/yUc3H9SPOu6OeFbiMUGSPikbJG4tewhzXDYQQoaTWmSm09o6JovpRHcmtpqwtjrAMchL2jt7Fh5WHKp80fb/AAbOLlqxcsvcWYKiXgQAgBACAEAIAQGtX1tNQUr6ismbFEwbXOPoOZXqFcrJcsVtnmc4wW5Pocj0t0mmv1RqR60VDG7McZ3uP1O7ezgvo8TEVC2+svP+jAysp3v4S7FeJVwqkrozZJb9c20zMthb1p5B8rPyeH7KvlZCor5n38HfHod8+Xx5O2U8EdNDHDA0MijaGsaNwAXy7k5Pb7s+jUVFaR6qCQQGMDkgKFpjo4adz7jQRnoTtmiaPgP1AcufJa+Dl7/pz7+DJzMXT54dinkrUM0XJByCQRtBG8KQWyx6bTUobBdA6eIbBK3429/P9e9ZuRw5S+qvo/jwaFGe49LOqLvbrnRXKPpKKpjlHEA7W943hZNlU63qS0aldsLFuL2bmQuZ0MoAQGMhADnAAkkADeUGyrXzTe2W5rmUr/fajcGwu6gPa78ZV6jh9tvWXRFK7Orr6R6s5ve75X3ufpa6XLR8ETdjGdw+63KMeFEdRX+zHuvna9zf+iLJXc4mza7dV3euZR0MevK7eTuYPqPILnbbGqPNI911ytlyxO0aO2OmsVvbTU7Q552yykbZHc+7kF8zkZEr580v+H0VFEaYcqJVcDsCAEAIDBAIwUBSNJtDy4vq7Q0ZO19ONmf5fwtXFz9fRb+TLycH++v8FGka6NzmPaWuacFrhggrXWmtoyn0emISpBiOSSJ4fFI9jxucxxBHiEcVJaZKeuqJqk0xvdIA33ps7RwnZreuw+qqTwMefjX6FmGZdHzv9SUh9ola0YmoKd54uZI5vptVd8Lh4kzuuJT8xR6P9pE2OpbI/GY/hQuFR8zPT4m/Ef8AJH1ftBu8uRBFSwA8Q0vI8Scei6x4XSu7bOUuI3Pskiv3G83K5f8A21s8rT8mthn+0bFcqoqq9kdFWy6yz3S2R5K7HLsISpIJXR/R+uv1RqUjNWFpxJO8dRv5PYPRV8jKroW5d/g70Y8739Pb5OuaPWGjsVGIKRuXu2yyu+KQ9vZ2L53IyJ3y5pf8N6iiFMdRJVcDsCAEAIAQAgBAQ970doLyNaoj6OfGBNHsd48/FWKMqyl/S+nwVrsaF3fv8lDu+h11oMvhZ75CPmi+IDtbv8srYpz6rOj6P7mXbhW19uqK28FryxwLXjYWkYIV5NNbRTfR6YhKAUqSBSgEJ7VIME7MoDattpuN1fq2+kknH1NGGj+o7Fzsvrq970e66Z2+1bLzYfZ1HGWzXuUSnf7vESG+Lt58MLJv4o30qWvuzTp4cl1te/sXungipoWwwRMjjYMNYwYACypNye31ZpxSitI9VBIIAQAgBACAEAIAQGCMoDUrrZRV7dWtpYph/raCfNe67bK3uD0c51Qn7lsr1w0Fspjc+FtRB2MlJH/LKu18Rv316lSfD6ddOhSL1ZoKBzhFLM7B+cj7ALUoyJWd0Z11Ea+zZE08LZpdRxIHYrMpaWzhGO3ouVk0Mt1YGunnqzngHtA/6rMuz7YPSSNGrBrl1bZaaHQ+w0Tg6OgZI8fNO4yeh2DwWfZnZFneX46F2GHTDql+epOMY1jQ1jQ1o3ADACqvq+pYQ6EggBACAEAID//Z";

    useEffect(() => {
        socketRef.current = io(import.meta.env.VITE_BACKEND_URI);

        if (myId) {
            socketRef.current.emit("add-user", myId);
        }

        // অন্য কেউ মেসেজ পাঠালে সেটা রিসিভ করা
        socketRef.current.on("recive-msg", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [myId]);

    useEffect(() => {
        async function datafetch() {
            let getUserData = await fetch(`${import.meta.env.VITE_BACKEND_URI}/get-user-data`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: id })
            });
            let data = await getUserData.json();
            setUserData(data);
            setFriendName(data.name);
            setFriendPic(data.profilePic || "data:image/jpeg;base64,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");
        }

        async function getOldMessages() {
            let res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/get-messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    senderId: myId,
                    reciverId: id
                })
            });
            let data = await res.json();
            setMessages(data);
        }

        datafetch();
        getOldMessages();
    }, [id, myId]);

    useEffect(() => {
        let chatDiv = document.getElementById("chatdiv");
        if (chatDiv) {
            chatDiv.scrollTop = chatDiv.scrollHeight;
        }
    }, [messages]);

    let handleMessage = () => {
        if (!msg.trim()) return;

        let messageData = {
            senderId: myId,
            reciverId: id,
            text: msg,
            senderPic: myPic // এখানে নিজের প্রোফাইল পিকচার পাঠানো হচ্ছে
        };

        // সার্ভারে পাঠানো
        socketRef.current.emit("send-message", messageData);

        // নিজের স্ক্রিনে আপডেট করা
        setMessages((prev) => [...prev, messageData]);
        setMsg("");
    };

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;500;700&display=swap');

        .chat-container {
            font-family: 'Hind Siliguri', sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #020617 100%);
            height: 100vh;
            display: flex;
            flex-direction: column;
            color: white;
        }

        .chat-header {
            background: rgba(30, 41, 59, 0.8);
            backdrop-filter: blur(10px);
            padding: 10px 20px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 10;
        }

        .header-pic {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            border: 2px solid #ffcc00;
            margin-right: 12px;
            object-fit: cover;
        }

        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .message-row {
            display: flex;
            align-items: flex-end;
            gap: 10px;
            max-width: 85%;
        }

        .my-row {
            align-self: flex-end;
            flex-direction: row-reverse; /* নিজের মেসেজ ডান দিকে দেখাবে */
        }

        .friend-row {
            align-self: flex-start; /* বন্ধুর মেসেজ বাম দিকে দেখাবে */
        }

        .bubble-pic {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
            border: 1.5px solid #ffcc00;
            flex-shrink: 0;
        }

        .msg-bubble {
            padding: 10px 16px;
            border-radius: 18px;
            font-size: 15px;
            line-height: 1.4;
            word-wrap: break-word;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .my-msg {
            background: #ffcc00;
            color: #020617;
            border-bottom-right-radius: 4px;
        }

        .friend-msg {
            background: rgba(51, 65, 85, 0.9);
            color: white;
            border-bottom-left-radius: 4px;
        }

        .chat-input-area {
            background: rgba(30, 41, 59, 0.9);
            padding: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chat-input {
            flex: 1;
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid #334155;
            border-radius: 25px;
            padding: 12px 20px;
            color: white;
            outline: none;
        }
    `;

    return (
        <div className="chat-container">
            <style>{styles}</style>
            <Nav />

            <div className="chat-header">
                <img
                    src={friendPic}
                    className="header-pic"
                    alt="friend"
                />
                <div>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>{friendName}</h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#4ade80' }}></p>
                </div>
            </div>

            <div className="chat-messages" id="chatdiv">
                {messages.map((m, index) => {
                    const isMine = m.senderId === myId;

                    // ফটো লজিক: 
                    // যদি নিজের হয় তবে myPic, 
                    // আর যদি অন্যের হয় তবে মেসেজের সাথে আসা senderPic অথবা ডিফল্ট friendPic
                    const displayPic = isMine ? myPic : (m.senderPic || friendPic);

                    return (
                        <div key={index} className={`message-row ${isMine ? 'my-row' : 'friend-row'}`}>
                            <img
                                src={displayPic}
                                className="bubble-pic"
                                alt="user"
                            />
                            <div className={`msg-bubble ${isMine ? 'my-msg' : 'friend-msg'}`}>
                                {m.text}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="chat-input-area">
                <input
                    className="chat-input"
                    placeholder="মেসেজ লিখুন..."
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleMessage()}
                />
                <button
                    style={{
                        background: '#ffcc00', border: 'none', width: '45px', height: '45px',
                        borderRadius: '50%', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                    }}
                    onClick={handleMessage}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default Chat;
