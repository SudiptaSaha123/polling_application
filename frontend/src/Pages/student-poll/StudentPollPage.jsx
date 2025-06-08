import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import socket from "../../utils/socket.js";
import "./StudentPollPage.css";
import stopwatch from "../../assets/stopwatch.svg";
import ChatPopover from "../../components/chat/ChatPopover";
import { useNavigate } from "react-router-dom";
import stars from "../../assets/spark.svg";

const StudentPollPage = () => {
  const [votes, setVotes] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => {
    const storedEndTime = localStorage.getItem("pollEndTime");
    if (storedEndTime) {
      const remainingTime = Math.max(
        0,
        Math.floor((parseInt(storedEndTime) - Date.now()) / 1000)
      );
      return remainingTime;
    }
    return 0;
  });
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([]);
  const [pollId, setPollId] = useState("");
  const [kickedOut, setKickedOut] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      const username = sessionStorage.getItem("username");
      if (username) {
        socket.emit("submitAnswer", {
          username: username,
          option: selectedOption,
          pollId: pollId,
        });
        setSubmitted(true);
      } else {
        console.error("No username found in session storage!");
      }
    }
  };

  useEffect(() => {
    const handleKickedOut = () => {
      console.log("Received kickout event");
      setKickedOut(true);
      sessionStorage.removeItem("username");
      socket.disconnect();
      navigate("/kicked-out");
    };

    socket.on("kickedOut", handleKickedOut);

    return () => {
      socket.off("kickedOut", handleKickedOut);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [navigate]);

  useEffect(() => {
    socket.on("pollCreated", (pollData) => {
      setPollQuestion(pollData.question);
      setPollOptions(pollData.options);
      setVotes({});
      setSubmitted(false);
      setSelectedOption(null);
      const endTime = Date.now() + pollData.timer * 1000;
      localStorage.setItem("pollEndTime", endTime.toString());
      setTimeLeft(pollData.timer);
      setPollId(pollData._id);
    });

    socket.on("pollResults", (updatedVotes) => {
      setVotes(updatedVotes);
    });

    return () => {
      socket.off("pollCreated");
      socket.off("pollResults");
    };
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        const storedEndTime = localStorage.getItem("pollEndTime");
        if (storedEndTime) {
          const remainingTime = Math.max(
            0,
            Math.floor((parseInt(storedEndTime) - Date.now()) / 1000)
          );

          if (remainingTime <= 0) {
            clearInterval(timerRef.current);
            localStorage.removeItem("pollEndTime");
            setTimeLeft(0);
            setSubmitted(true);
          } else {
            setTimeLeft(remainingTime);
          }
        } else {
          clearInterval(timerRef.current);
          setTimeLeft(0);
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, submitted]);

  const calculatePercentage = (count) => {
    if (totalVotes === 0) return 0;
    return (count / totalVotes) * 100;
  };

  return (
    <>
      <ChatPopover />
      {!kickedOut && (
        <>
          {pollQuestion === "" && timeLeft === 0 && (
            <div className="flex flex-col items-center justify-center min-h-screen">
              <div className="flex flex-col items-center">
                <div
                  className="w-[134px] h-[31px] rounded-[24px] p-[9px] gap-[7px] flex items-center justify-center mb-6"
                  style={{
                    background:
                      "linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)",
                  }}
                >
                  <img src={stars} alt="" />
                  <div className="text-[#ffffff] text-[14px] font-[500]">
                    Intervue Poll
                  </div>
                </div>
                <div
                  className="spinner-border text-center spinner mt-[13px] mb-[35px]"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h3 className="font-[500] text-[33px] text-center">
                  <b>Wait for the teacher to ask questions..</b>
                </h3>
              </div>
            </div>
          )}

          {pollQuestion !== "" && (
            <div className="mx-auto w-[727px] py-[100px]">
              <div className="flex items-center gap-[40px] mb-[17px]">
                <h2 className="text-[22px] font-[600] mt-[6px]">Question</h2>
                <div className="flex items-center gap-2 justify-center">
                  <img
                    src={stopwatch}
                    width="15px"
                    height="auto"
                    alt="Stopwatch"
                  />
                  <span className="text-[16px] font-[500] text-[#FF4B4B]">
                    {`00:${String(timeLeft).padStart(2, "0")}`}
                  </span>
                </div>
              </div>

              <div className="border border-[#AF8FF1] rounded-[10px] bg-white max-w-[727px] mx-auto">
                <div className="p-3 rounded-b-0 rounded-t-[10px] text-white bg-[linear-gradient(90deg,_#343434_0%,_#6E6E6E_100%)] text-[17px] font-[600] mb-[30px]">
                  {pollQuestion}
                </div>

                <div className="mt-4">
                  {pollOptions.map((option, index) => {
                    const percentage = calculatePercentage(
                      votes[option.text] || 0
                    );
                    const isSelected =
                      !submitted && selectedOption === option.text;

                    return (
                      <div
                        key={option.id}
                        className="option-item mb-3 px-[18px]"
                      >
                        <div
                          className={`relative rounded-[6px] overflow-hidden ${
                            isSelected
                              ? "border-2 border-[#8F64E1] bg-[rgba(117,101,217,0.1)]"
                              : "border border-[#8F64E1]"
                          }`}
                          style={{
                            cursor:
                              submitted || timeLeft === 0
                                ? "not-allowed"
                                : "pointer",
                            boxShadow: isSelected
                              ? "0 0 0 2px #8F64E1"
                              : "none",
                          }}
                          onClick={() => {
                            if (!submitted && timeLeft > 0) {
                              handleOptionSelect(option.text);
                            }
                          }}
                        >
                          <div className="progress h-[48px] bg-[#F5F5F5] rounded-[6px] m-0">
                            {submitted && (
                              <div
                                className="progress-bar bg-[#6766D5]"
                                role="progressbar"
                                style={{
                                  width: `${percentage}%`,
                                  transition: "width 0.3s ease",
                                }}
                              ></div>
                            )}
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
                                color:
                                  submitted && percentage > 10
                                    ? "#fff"
                                    : "#000",
                              }}
                            >
                              {option.text}
                            </span>
                          </div>
                          {submitted && (
                            <div
                              className="absolute right-[16px] top-1/2 font-[600] z-10 text-[16px]"
                              style={{ transform: "translateY(-50%)" }}
                            >
                              {Math.round(percentage)}%
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {!submitted && selectedOption && timeLeft > 0 && (
                <div className="flex justify-end mt-[24px]">
                  <button
                    className="btn rounded-pill bg-[linear-gradient(99.18deg,#8F64E1_-46.89%,#1D68BD_223.45%)] text-white text-[18px] font-[600] px-[40px] py-[13px]"
                    onClick={handleSubmit}
                  >
                    Submit Answer
                  </button>
                </div>
              )}

              {submitted && (
                <div className="mt-[40px] text-center">
                  <h6 className="font-[600] text-[24px]">
                    Wait for the teacher to ask a new question...
                  </h6>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default StudentPollPage;
