import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backIcon from "../../assets/back.svg";
import ChatPopover from "../../components/chat/ChatPopover";
let apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? "https://polling-application-5lt2.onrender.com"
    : "https://polling-application-5lt2.onrender.com";
const socket = io(apiUrl);

const PollHistoryPage = () => {
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getPolls = async () => {
      const username = sessionStorage.getItem("username");

      try {
        const response = await axios.get(`${apiUrl}/polls/${username}`);
        setPolls(response.data.data);
      } catch (error) {
        console.error("Error fetching polls:", error);
        if (error.response?.status === 403) {
          setError("Unauthorized: Only teachers can access poll history");
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          setError("Error fetching polls. Please try again later.");
        }
      }
    };

    getPolls();
  }, [navigate]);

  const calculatePercentage = (count, totalVotes) => {
    if (totalVotes === 0) return 0;
    return (count / totalVotes) * 100;
  };

  const handleBack = () => {
    navigate("/teacher-home-page");
  };

  let questionCount = 0;

  if (error) {
    return (
      <div className="container mt-5 w-50">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mr-[30px] mt-[40px]">
        <button
          className="bg-[#8F64E1] w-[180px] h-[45px] appearance-none border-none outline-none text-[16px] font-[500] rounded-[34px] py-[10px] px-[20px] text-white flex items-center justify-center gap-[10px] cursor-pointer"
          onClick={() => navigate("/teacher-home-page")}
        >
          Back to Home
        </button>
      </div>
      <div className="mx-auto w-[727px] py-[70px]">
        <h2 className="text-[40px] font-[400] mb-[40px]">
          View <span className="font-[600]">Poll History</span>
        </h2>

        {polls.length > 0 ? (
          polls.map((poll, index) => {
            const totalVotes = poll.options.reduce(
              (sum, option) => sum + option.votes,
              0
            );

            return (
              <div key={poll._id} className="mb-[30px]">
                <div className="text-[19px] font-[600] mb-[16px]">
                  Question {index + 1}
                </div>
                <div className="border border-[#AF8FF1] rounded-[10px] bg-white max-w-[727px] mx-auto">
                  <div className="p-3 rounded-b-0 rounded-t-[10px] text-white bg-[linear-gradient(90deg,_#343434_0%,_#6E6E6E_100%)] text-[17px] font-[600] mb-[30px]">
                    {poll.question}
                  </div>

                  <div className="mt-4">
                    {poll.options.map((option, index) => {
                      const percentage = calculatePercentage(
                        option.votes,
                        totalVotes
                      );
                      return (
                        <div
                          key={option._id}
                          className="option-item mb-3 px-[18px]"
                        >
                          <div className="relative rounded-[6px] overflow-hidden">
                            <div className="progress h-[48px] bg-[#F5F5F5] rounded-[6px] m-0">
                              <div
                                className="progress-bar bg-[#6766D5]"
                                role="progressbar"
                                style={{
                                  width: `${percentage}%`,
                                  transition: "width 0.3s ease",
                                }}
                              ></div>
                            </div>
                            <div
                              className="absolute top-1/2 left-[12px] flex items-center gap-[12px] z-10"
                              style={{ transform: "translateY(-50%)" }}
                            >
                              <span className="bg-[#7C6BFF] text-white w-[24px] h-[24px] rounded-full flex items-center justify-center text-[11px]">
                                {index + 1}
                              </span>
                              <span
                                className="text-[16px] font-[500]"
                                style={{
                                  color: percentage > 10 ? "#fff" : "#000",
                                }}
                              >
                                {option.text}
                              </span>
                            </div>
                            <div
                              className="absolute right-[16px] top-1/2 font-[600] z-10 text-[16px]"
                              style={{ transform: "translateY(-50%)" }}
                            >
                              {Math.round(percentage)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-muted">No polls found in history.</div>
        )}
        <ChatPopover />
      </div>
    </>
  );
};

export default PollHistoryPage;
