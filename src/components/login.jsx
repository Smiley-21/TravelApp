import "./login.css";
import { Room, HighlightOff } from "@mui/icons-material";
import React, { useState, useRef } from "react";
import axios from "axios";

export default function Login({setShowLogin,myStorage,setCurrentUsername}) {



  const [fail, setfail] = useState(false);
  const nameRef = useRef();
  const passwordRef = useRef();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e);
    const User = {
      username: nameRef.current.value,
      password:passwordRef.current.value,
    };

    try {
      const res = await axios.post("/users/login", User);
      setCurrentUsername(res.data.username);
      myStorage.setItem("user",res.data.username);
      console.log(res.data)
      setShowLogin(false);
    } catch (err) {
     setfail(true);
      console.log(err);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <Room />
        Locate yourself
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className="username"
          type="text"
          placeholder="Username"
          ref={nameRef}
        />
        <input type="password" placeholder="Password" ref={passwordRef} />
        <button type="submit" className="LoginBtn"   >
          Login
        </button>
        {fail && (
          <span className="failure"> Incorrect details, Please try again</span>
        )}
        <HighlightOff
          className="closeLogin"
          onClick={() => setShowLogin(false)  }
        />
      </form>
    </div>
  );
}
