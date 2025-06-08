import React, { useState } from "react";
import stars from "../../assets/spark.svg";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

let apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? "https://polling-application-5lt2.onrender.com"
    : "https://polling-application-5lt2.onrender.com";

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();
  const selectRole = (role) => {
    setSelectedRole(role);
  };

  const continueToPoll = async () => {
    if (selectedRole === "teacher") {
      let teacherlogin = await axios.post(`${apiUrl}/teacher-login`);
      sessionStorage.setItem("username", teacherlogin.data.username);
      navigate("/teacher-home-page");
    } else if (selectedRole === "student") {
      navigate("/student-home-page");
    } else {
      alert("Please select a role.");
    }
  };

  return (
    <div className="flex bg-[#ffffff] vh-100 items-center justify-center px-4 sm:px-6 md:px-10">
      <div className="text-center flex flex-col items-center justify-center w-full max-w-[1000px]">
        <div
          className="w-[134px] h-[31px] rounded-[24px] p-[9px] gap-[7px] flex items-center justify-center mb-6"
          style={{
            background: "linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)",
          }}
        >
          <img src={stars} className="" alt="" />
          <div className="text-[#ffffff] text-[14px] font-[500]">
            Intervue Poll
          </div>
        </div>

        <h3 className="text-[32px] sm:text-[36px] md:text-[40px] font-[400] flex flex-wrap mt-[16px] text-center justify-center px-2">
          Welcome to the&nbsp;
          <span className="font-[600]">Live Polling System</span>
        </h3>

        <p className="text-[16px] sm:text-[18px] md:text-[19px] max-w-[737px] font-[400] text-[#00000080] mb-[52px] px-2">
          Please select the role that best describes you to begin using the live
          polling system
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-[20px] sm:gap-[33px] mb-[53px] w-full px-2">
          <div
            className={`role-btn text-left w-full sm:max-w-[430px] max-h-[143px] rounded-[10px] border-[3px] py-[15px] px-[17px] flex-col gap-[17px] ${
              selectedRole === "student" ? "active" : ""
            }`}
            onClick={() => selectRole("student")}
          >
            <p className="font-[600] text-[20px] sm:text-[23px] text-black">
              I'm a Student
            </p>
            <span className="text-[14px] sm:text-[16px] font-[400] text-[#454545]">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry
            </span>
          </div>

          <div
            className={`role-btn text-left w-full sm:max-w-[430px] max-h-[143px] rounded-[10px] border-[3px] py-[15px] px-[17px] flex-col gap-[17px] ${
              selectedRole === "teacher" ? "active" : ""
            }`}
            onClick={() => selectRole("teacher")}
          >
            <p className="font-[600] text-[20px] sm:text-[23px] text-black">
              I'm a Teacher
            </p>
            <span className="text-[14px] sm:text-[16px] font-[400] text-[#454545]">
              Submit answers and view live poll results in real-time.
            </span>
          </div>
        </div>

        <div
          className="bg-[linear-gradient(99.18deg,_#8F64E1_-46.89%,_#1D68BD_223.45%)] cursor-pointer py-[17px] px-[40px] sm:px-[70px] rounded-[34px] text-white w-full max-w-[234px] h-[58px] font-[500] text-[18px] flex items-center justify-center"
          onClick={continueToPoll}
        >
          Continue
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
