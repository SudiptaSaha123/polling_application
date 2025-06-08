import React, { useState } from "react";
import stars from "../../assets/spark.svg";
import { useNavigate } from "react-router-dom";

const StudentLandingPage = () => {
  let navigate = new useNavigate();

  const [name, setName] = useState(null);
  const handleStudentLogin = async (e) => {
    e.preventDefault();

    if (name?.trim()) {
      try {
        sessionStorage.setItem("username", name);
        navigate("/poll-question");
      } catch (error) {
        console.error("Error logging in student:", error);
        alert("Error connecting to the server. Please try again.");
      }
    } else {
      alert("Please enter your name");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center justify-center w-full max-w-[800px]">
        <div
          className="w-[134px] h-[31px] rounded-[24px] p-[9px] gap-[7px] flex items-center justify-center"
          style={{
            background: "linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)",
          }}
        >
          <img src={stars} className="" alt="" />
          <div className="text-[#ffffff] text-[14px] font-[500]">
            Intervue Poll
          </div>
        </div>

        <div className="text-center">
          <h3 className="font-[400] text-[40px] mt-[29px]">
            Let's <span className="font-[600]">Get Started</span>
          </h3>
          <p className="max-w-[762px] text-[#5C5B5B] text-[19px] font-[400] leading-[25px] mt-3">
            If you're a student, you'll be able to{" "}
            <span className="font-[600] text-black">submit your answers</span>,
            participate in live polls, and see how your responses compare with
            your classmates
          </p>
        </div>

        <form
          onSubmit={handleStudentLogin}
          className="w-full flex flex-col items-center mt-[30px]"
        >
          <div className="max-w-[507px] w-full">
            <p className="text-[18px] font-[400] text-black mb-[11px]">
              Enter your Name
            </p>
            <input
              type="text"
              className="w-full h-[60px] bg-[#F2F2F2] px-4 outline-none focus:outline-none focus:ring-0 border-none focus:border-none"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="appearance-none border-none outline-none bg-[linear-gradient(99.18deg,_#8F64E1_-46.89%,_#1D68BD_223.45%)] cursor-pointer py-[17px] px-[40px] sm:px-[70px] rounded-[34px] text-white w-[234px] h-[58px] font-[500] text-[18px] flex items-center justify-center mt-[46px]"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentLandingPage;
