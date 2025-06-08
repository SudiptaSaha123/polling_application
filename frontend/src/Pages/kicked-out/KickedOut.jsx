import React from "react";
import { useNavigate } from "react-router-dom";
import stars from "../../assets/spark.svg";
import "./KickedOut.css";
import "bootstrap/dist/css/bootstrap.min.css";

const KickedOut = () => {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    // Clear any remaining session data
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center vh-100 mx-auto">
      <div className="text-center">
        <div
          className="w-[134px] h-[31px] rounded-[24px] p-[9px] gap-[7px] flex items-center justify-center mb-6 mx-auto"
          style={{
            background: "linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)",
          }}
        >
          <img src={stars} className="" alt="" />
          <div className="text-[#ffffff] text-[14px] font-[500]">
            Intervue Poll
          </div>
        </div>
        <h2 className="font-[400] text-[40px]">You've been Kicked out !</h2>
        <div className="text-[19px] font-[400] w-[737px] text-[#00000080] mt-[20px]">
          Looks like the teacher had removed you from the poll system.
          <br /> Please Try again sometime.
        </div>
      </div>
    </div>
  );
};

export default KickedOut;
