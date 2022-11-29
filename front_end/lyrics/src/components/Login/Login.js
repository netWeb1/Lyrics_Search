import React, { useState } from "react";
import "../../pages/LandingPage/LandingPage";
import "./Login.css";

function Login() {
  const [inputId, setInputId] = useState("");
  const [inputPassWord, setInputPassWord] = useState("");

  const handleId = (e) => {
    setInputId(e.target.value);
  };

  const handlePassWord = (e) => {
    setInputPassWord(e.target.value);
  };

  const onClickLoginBtn = () => {
    console.log("로그인 되었습니다.");
  };
  return (
    <div className="Login">
      <h1>로그인</h1>
      <div className="IdPwBtn">
        <input
          type="text"
          name="userId"
          placeholder="아이디"
          value={inputId}
          onChange={handleId}
        ></input>
        <input
          type="password"
          name="userPassWord"
          placeholder="비밀번호"
          value={inputPassWord}
          onChange={handlePassWord}
        ></input>
        <button className="loginBtn" onClick={onClickLoginBtn}>
          로그인
        </button>
      </div>
      <div className="manageBtns">
        <button className="registerBtn">회원가입</button>
        <button className="findIdBtn">아이디 찾기</button>
        <button className="findPwBtn">비밀번호 찾기</button>
      </div>
    </div>
  );
}

export default Login;
