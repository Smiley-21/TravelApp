import "./register.css";
import {Room,HighlightOff} from "@mui/icons-material"
import React, {useState,useRef} from "react";
import axios from 'axios';




 export default function Register({setShowRegister}){

    const[pass, setSuccess]=useState(false);
    const[fail,setfail]=useState(false);
    const nameRef=useRef()
    const emailRef=useRef()
    const passwordRef=useRef()


    const handleSubmit=async(e)=>{
        e.preventDefault();
        const NewUser={
            username:nameRef.current.value,
            password:passwordRef.current.value,
            email:emailRef.current.value,
        }

        try{
            const res=await axios.post("/users/register",NewUser);
            setfail(false);
            setSuccess(true);
            

        }
        catch(err)
        {
            setfail(true);
            console.log(err);
        }
    }

    return (
        <div className="registersContainer">

            <div className="logo">
                <Room/>
                Locate yourself
            </div>
            <form onSubmit={handleSubmit}>

                <input className="username" type="text" placeholder="Username" ref={nameRef}/>
                <input type="emai" placeholder="Email" ref={emailRef}/>
                <input type="password" placeholder="Password" ref={passwordRef}/>
                <button type="submit" className="registerBtn">Register</button>
                {pass && 

                    <span className="success">Successfully Registered!!!  You can login now </span>
                }{fail && 

                    <span className="failure"> Incorrect details, Please try again</span>
                }
                <HighlightOff
                 className="closeRegister"
                  onClick={()=> setShowRegister(false)}/>
            </form>
        </div>
    )
}
