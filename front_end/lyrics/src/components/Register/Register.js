import React, { useState } from "react";
import "../../pages/LandingPage/LandingPage";
import "./Register.css";

function Register() {
    const [Email, setEmail] = useState(""); 
    const [Nickname, setNickname] = useState("");
    const [Password, setPassword] = useState("");
    const [PasswordCheck, setPasswordCheck] = useState("");

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
      };
    
    const onNicknameHandler = (event) => {
        setNickname(event.currentTarget.value)
    };

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    };

    const onPasswordCheckHandler = (event) => {
        setPasswordCheck(event.currentTarget.value)
    };

    const onSubmitHandler = (event) => { // button 누를 때 페이지 refresh 방지
        event.preventDefault();
    };

    return (
        <div>
          <h1>회원가입</h1>
          <div className="signupMain" onSubmit={onSubmitHandler}>
            <form className="signupForm">
              <div className="formInputBlock"> 
                <label> 이메일 </label>
                <input type="email" placeholder="example@xxx.com" value={Email} onChange={onEmailHandler} />
                <label> 닉네임 </label>
                <input type="nickname" placeholder="nickname" value={Nickname} onChange={onNicknameHandler} />
                <label> 비밀번호 </label>
                <input type="password" placeholder="******" value={Password} onChange={onPasswordHandler} />
                <label> 비밀번호 확인 </label>
                <input type="passwordCheck" placeholder="******" value={PasswordCheck} onChange={onPasswordCheckHandler} />
              </div>
            </form>
            
            <button className="signInBtn" type="submit">
              가입하기
            </button>
          
          </div>
      
        </div>
  );
}

export default Register;

