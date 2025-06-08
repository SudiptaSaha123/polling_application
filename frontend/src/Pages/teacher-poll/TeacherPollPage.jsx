import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import io from "socket.io-client";
import ChatPopover from "../../components/chat/ChatPopover";
import { useNavigate } from "react-router-dom";
import eyeIcon from "../../assets/eye.svg";
let apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? "https://polling-application-nopu.onrender.com"
    : "https://polling-application-nopu.onrender.com";
const socket = io(apiUrl);

const TeacherPollPage = () => {
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([]);
  const [votes, setVotes] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);
  const navigate = new useNavigate();
  useEffect(() => {
    socket.on("pollCreated", (pollData) => {
      setPollQuestion(pollData.question);
      setPollOptions(pollData.options);
      setVotes({});
    });

    socket.on("pollResults", (updatedVotes) => {
      setVotes(updatedVotes);
      setTotalVotes(Object.values(updatedVotes).reduce((a, b) => a + b, 0));
    });

    return () => {
      socket.off("pollCreated");
      socket.off("pollResults");
    };
  }, []);

  const calculatePercentage = (count) => {
    if (totalVotes === 0) return 0;
    return (count / totalVotes) * 100;
  };
  const askNewQuestion = () => {
    navigate("/teacher-home-page");
  };
  const handleViewPollHistory = () => {
    navigate("/teacher-poll-history");
  };

  return (
    <>
      <div className="flex justify-end mr-[30px] mt-[40px]">
        <button
          className="bg-[#8F64E1] w-[267px] h-[53px] appearance-none border-none outline-none text-[18px] font-[500] rounded-[34px] py-[17px] px-[20px] text-white flex items-center justify-center gap-[10px]"
          onClick={handleViewPollHistory}
        >
          <img src={eyeIcon} alt="" style={{ width: "30px", height: "30px" }} />
          View Poll history
        </button>
      </div>

      <div className="mx-auto w-[727px] py-[70px]">
        <h2 className="text-[22px] font-[600] mb-[30px]">Question</h2>

        {pollQuestion && (
          <div>
            <div className="border border-[#AF8FF1] rounded-[10px] bg-white max-w-[727px] mx-auto">
              <div className="p-3 rounded-b-0 rounded-t-[10px] text-white bg-[linear-gradient(90deg,_#343434_0%,_#6E6E6E_100%)] text-[17px] font-[600] mb-[30px]">
                {pollQuestion}
              </div>

              <div className="mt-4">
                {pollOptions.map((option, index) => {
                  const percentage = calculatePercentage(votes[option.text] || 0);
                  return (
                    <div key={option.id} className="option-item mb-3 px-[18px]">
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
                            style={{ color: percentage > 10 ? "#fff" : "#000" }}
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
            <div className="flex justify-end mt-[24px]">
              <button
                className="btn rounded-pill bg-[linear-gradient(99.18deg,#8F64E1_-46.89%,#1D68BD_223.45%)] text-white text-[18px] font-[600] px-[40px] py-[13px]"
                onClick={askNewQuestion}
              >
                + Ask a new question
              </button>
            </div>
          </div>
        )}

        {!pollQuestion && (
          <div className="text-muted">
            Waiting for the teacher to start a new poll...
          </div>
        )}
        <ChatPopover />
      </div>
    </>
  );
};

export default TeacherPollPage;
