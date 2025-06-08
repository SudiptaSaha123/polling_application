"use client"

import { useState, useEffect } from "react"
import io from "socket.io-client"
import { useParams } from "react-router-dom"
import Button from "@mui/material/Button"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"

let socket

const StudentPollPage = () => {
  const { roomCode } = useParams()
  const [isConnected, setIsConnected] = useState(false)
  const [pollQuestion, setPollQuestion] = useState("")
  const [pollOptions, setPollOptions] = useState([])
  const [votes, setVotes] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [pollId, setPollId] = useState(null)

  useEffect(() => {
    socket = io(process.env.REACT_APP_SERVER_URL)

    socket.on("connect", () => {
      console.log("Connected to server")
      setIsConnected(true)
      socket.emit("joinRoom", roomCode)

      // Clear any stale poll data on component mount
      localStorage.removeItem("pollEndTime")
      setPollQuestion("")
      setPollOptions([])
      setVotes({})
      setSubmitted(false)
      setSelectedOption(null)
      setTimeLeft(0)
    })

    socket.on("disconnect", () => {
      console.log("Disconnected from server")
      setIsConnected(false)
    })

    socket.on("pollCreated", (pollData) => {
      // Reset all state for new poll
      setPollQuestion(pollData.question)
      setPollOptions(pollData.options)
      setVotes({})
      setSubmitted(false)
      setSelectedOption(null)

      // Use the server-provided timer value directly
      setTimeLeft(pollData.timer)

      // Only set new end time if timer is greater than 0
      if (pollData.timer > 0) {
        const endTime = Date.now() + pollData.timer * 1000
        localStorage.setItem("pollEndTime", endTime.toString())
      } else {
        localStorage.removeItem("pollEndTime")
        setSubmitted(true)
      }

      setPollId(pollData._id)
    })

    socket.on("pollResults", (results) => {
      setVotes(results)
    })

    socket.on("timerUpdate", (newTime) => {
      setTimeLeft(newTime)
      if (newTime <= 0) {
        localStorage.removeItem("pollEndTime")
        setSubmitted(true)
      }
    })

    const storedEndTime = localStorage.getItem("pollEndTime")
    if (storedEndTime) {
      const parsedEndTime = Number.parseInt(storedEndTime, 10)
      if (parsedEndTime > Date.now()) {
        setTimeLeft(Math.ceil((parsedEndTime - Date.now()) / 1000))
      } else {
        localStorage.removeItem("pollEndTime")
        setSubmitted(true)
        setTimeLeft(0)
      }
    }

    return () => {
      socket.disconnect()
    }
  }, [roomCode])

  useEffect(() => {
    let intervalId

    if (timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          const newTimeLeft = prevTimeLeft - 1
          if (newTimeLeft <= 0) {
            clearInterval(intervalId)
            localStorage.removeItem("pollEndTime")
            setSubmitted(true)
            return 0
          }
          localStorage.setItem("pollEndTime", (Date.now() + newTimeLeft * 1000).toString())
          return newTimeLeft
        })
      }, 1000)
    }

    return () => clearInterval(intervalId)
  }, [timeLeft])

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value)
  }

  const handleSubmit = () => {
    if (selectedOption) {
      socket.emit("submitVote", {
        pollId: pollId,
        option: selectedOption,
        roomCode: roomCode,
      })
      setSubmitted(true)
      localStorage.removeItem("pollEndTime")
    }
  }

  const calculatePercentage = (option) => {
    if (Object.keys(votes).length === 0) return 0

    let totalVotes = 0
    for (const key in votes) {
      totalVotes += votes[key]
    }

    if (totalVotes === 0) return 0

    return ((votes[option] || 0) / totalVotes) * 100
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        padding: 3,
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Student Poll
      </Typography>
      <Typography variant="h6" component="h2" gutterBottom>
        Room Code: {roomCode}
      </Typography>

      {(!isConnected || pollQuestion === "") && (
        <Box>
          {isConnected ? (
            <Typography>Waiting for a poll to be created...</Typography>
          ) : (
            <Typography>Connecting to the server...</Typography>
          )}
          <CircularProgress />
        </Box>
      )}

      {isConnected && pollQuestion !== "" && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h5" component="h3">
            {pollQuestion}
          </Typography>

          {timeLeft > 0 && !submitted ? (
            <Box>
              <Typography>Time remaining: {timeLeft} seconds</Typography>
              <FormControl component="fieldset">
                <RadioGroup name="pollOptions" value={selectedOption} onChange={handleOptionChange}>
                  {pollOptions.map((option, index) => (
                    <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
                  ))}
                </RadioGroup>
              </FormControl>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" component="h4" gutterBottom>
                Poll Results:
              </Typography>
              {pollOptions.map((option, index) => (
                <Typography key={index}>
                  {option}: {calculatePercentage(option).toFixed(2)}% ({votes[option] || 0} votes)
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default StudentPollPage