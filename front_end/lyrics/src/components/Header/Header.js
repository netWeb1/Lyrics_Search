import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import "../../pages/LoginPage/LoginPage";
import HomeImg from "./letter-l.png";

function Header() {
  const navigate = useNavigate();
  return (
    <div className="Header">
      <div className="homeTitle">
        <img
          className="homeImg"
          src={HomeImg}
          alt=""
          onClick={() => navigate("/")}
        ></img>
        <h1 className="Title">lyrics search!</h1>
      </div>
      <div className="Btn">
        <button className="signInBtn" onClick={() => navigate("/login")}>
          sign in
        </button>
        <button className="signUpBtn" onClick={() => navigate("/register")}>
          sign up
        </button>
      </div>
    </div>
  );
}

export default Header;
