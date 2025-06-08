import React, { useState } from "react";
import stars from "../../assets/spark.svg";
import "./TeacherLandingPage.css";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import eyeIcon from "../../assets/eye.svg";
let apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? "https://polling-application-5lt2.onrender.com"
    : "https://polling-application-5lt2.onrender.com";
const socket = io(apiUrl);
const TeacherLandingPage = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{ id: 1, text: "", correct: null }]);
  const [timer, setTimer] = useState("60");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const username = sessionStorage.getItem("username");
  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleTimerChange = (e) => {
    setTimer(e.target.value);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index].text = value;
    setOptions(updatedOptions);
  };

  const handleCorrectToggle = (index, isCorrect) => {
    const updatedOptions = [...options];
    updatedOptions[index].correct = isCorrect;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([
      ...options,
      { id: options.length + 1, text: "", correct: null },
    ]);
  };

  const validateForm = () => {
    if (question.trim() === "") {
      setError("Question cannot be empty");
      return false;
    }

    if (options.length < 2) {
      setError("At least two options are required");
      return false;
    }

    const optionTexts = options.map((option) => option.text.trim());
    if (optionTexts.some((text) => text === "")) {
      setError("All options must have text");
      return false;
    }

    const correctOptionExists = options.some(
      (option) => option.correct === true
    );
    if (!correctOptionExists) {
      setError("At least one correct option must be selected");
      return false;
    }

    setError("");
    return true;
  };

  const askQuestion = () => {
    if (validateForm()) {
      let teacherUsername = sessionStorage.getItem("username");
      let pollData = { question, options, timer, teacherUsername };
      socket.emit("createPoll", pollData);
      navigate("/teacher-poll");
    }
  };
  const handleViewPollHistory = () => {
    navigate("/teacher-poll-history");
  };

  return (
    <>
      {/* <button
        className="btn rounded-pill ask-question px-4 m-2"
        onClick={handleViewPollHistory}
      >
        <img src={eyeIcon} alt="" />
        View Poll history
      </button> */}
      <div className="w-[1195px] mx-auto mb-[10px]">
        <div className="">
          <div
            className="w-[134px] h-[31px] rounded-[24px] p-[9px] gap-[7px] flex items-center justify-center mb-6 mt-[40px]"
            style={{
              background: "linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)",
            }}
          >
            <img src={stars} className="" alt="" />
            <div className="text-[#ffffff] text-[14px] font-[500]">
              Intervue Poll
            </div>
          </div>

          <h2 className="text-[40px] font-[400]">
            Let's <span className="font-[600]">Get Started</span>
          </h2>

          <p className="text-[#00000080] font-[400] text-[19px] w-[737px]">
            you'll have the ability to create and manage polls, ask questions,
            and monitor your students' responses in real-time.
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="flex flex-col justify-between max-w-[845px] gap-[20px] mt-[40px]">
          <div className="flex justify-between items-center">
            <label htmlFor="question" className="text-[20px] font-[600]">
              Enter your question
            </label>
            <select
              className="form-select w-[170px] h-[43px] rounded-[7px] bg-[#F1F1F1] font-[400] focus:outline-none focus:ring-0 focus:border-none"
              value={timer}
              onChange={handleTimerChange}
            >
              <option value="60">60 seconds</option>
              <option value="30">90 seconds</option>
              <option value="90">30 seconds</option>
            </select>
          </div>
          <textarea
            type="text"
            id="question"
            className="form-control w-full h-[154px] bg-[#F2F2F2] focus:bg-[#F2F2F2] px-4 outline-none focus:outline-none focus:ring-0 border-none focus:border-none pt-3 resize-none"
            onChange={handleQuestionChange}
            maxLength="100"
            placeholder="Type your question..."
          ></textarea>
        </div>

        <div className="mb-4 mt-[20px] ">
          <div className="d-flex justify-content-between pb-3 max-w-[685px]">
            <label className="font-[600] text-[18px]">Edit Options</label>
            <label className="font-[600] text-[18px] ml-[40px]">
              Is it correct?
            </label>
          </div>
          {options.map((option, index) => (
            <div
              key={option.id}
              className="d-flex align-items-center mb-[12px]"
            >
              <span
                className="w-[24px] h-[24px] gap-[10px] rounded-[22px] pt-[9px] pr-[10px] pb-[10px] pl-[10px] flex items-center justify-center text-white text-[11px] mr-[11px]"
                style={{
                  background:
                    "linear-gradient(243.94deg, #8F64E1 -50.82%, #4E377B 216.33%)",
                }}
              >
                {index + 1}
              </span>
              <input
                type="text"
                className="w-[507px] h-[60px] bg-[#F2F2F2] px-3 py-0 outline-none focus:outline-none focus:ring-0 border-none focus:border-none"
                placeholder="Option text..."
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              <div className="form-check form-check-inline ml-[26px]">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`correct-${index}`}
                  checked={option.correct === true}
                  onChange={() => handleCorrectToggle(index, true)}
                  required="required"
                />
                <label className="form-check-label">Yes</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input appearance-none"
                  type="radio"
                  name={`correct-${index}`}
                  checked={option.correct === false}
                  onChange={() => handleCorrectToggle(index, false)}
                  required="required"
                />
                <label className="form-check-label">No</label>
              </div>
            </div>
          ))}
        </div>
        <button
          className="w-[169px] h-[45px] rounded-[11px] py-[10px] px-[10px] text-[14px] font-[400] text-[#7C57C2] flex outline-none appearance-none items-center justify-center border-[1px] border-[#7451B6]"
          onClick={addOption}
        >
          + Add More option
        </button>
      </div>
      <div
        className="border mt-[30px]"
        style={{ borderColor: "#B6B6B6" }}
      ></div>
      <button
        className="border-none outline-none appearance-none w-[234px] h-[58px] rounded-[34px] py-[17px] px-[40px] text-[18px] font-[600] text-white flex items-center justify-center float-right mt-[15px] mr-[30px] mb-[20px]"
        style={{
          background:
            "linear-gradient(99.18deg, #8F64E1 -46.89%, #1D68BD 223.45%)",
        }}
        onClick={askQuestion}
      >
        Ask Question
      </button>
    </>
  );
};

export default TeacherLandingPage;
