// src/pages/Chatbot.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hi, I am Noela TravelBot. Let's create your personalized itinerary!", sender: "bot" }
  ]);
  const [step, setStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [travelDates, setTravelDates] = useState({ start: "", end: "" });
  const [userResponses, setUserResponses] = useState({
    destination: "",
    departure: "",
    travelDates: { start: "", end: "" },
    travelType: "",
    budget: "",
    transportation: "",
    interests: [],
    healthConditions: "",
  });

  const chatWindowRef = useRef(null);
  const navigate = useNavigate();

  const questions = [
    "What is your destination?",
    "What is your departure point?",
    "What are your travel dates?",
    "Are you traveling solo, with family, with kids, or in a group?",
    "What is your budget range?",
    "What is your preferred mode of transportation?",
    "What are your main interests?",
    "Do you have any health problems or medical conditions?"
  ];

  const options = {
    0: ["Delhi", "Jaipur", "Goa", "Kerala", "Manali", "Varanasi", "Mysore", "Bengaluru", "No Preferred Destination"],
    3: ["Solo", "Family", "With Kids", "Group"],
    4: ["Low", "Medium", "High", "Luxury"],
    5: ["Flight", "Train", "Car", "Bus"],
    6: ["Nature", "Culture", "Adventure", "Relaxation", "Food", "Shopping"],
    7: ["Asthma", "Heart Conditions", "Allergies", "Mobility Issues", "No Issues"]
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const validateInput = (answer) => {
    if (!answer.trim()) {
      return "Input cannot be empty!";
    }
    if (step === 0) { // Destination
      if (!/^[A-Za-z\s]+$/.test(answer.trim())) {
        return "Please enter a valid Destination.";
      }
    }
    if (step === 1) { // Departure
      if (!/^[A-Za-z\s]+$/.test(answer.trim())) {
        return "Please enter a valid Departure (max 50 characters).";
      }
    }
    if (step === 2) { // Travel Dates Validation
      if (!travelDates.start || !travelDates.end) {
        return "Please select both start and end dates!";
      }
      if (new Date(travelDates.start) > new Date(travelDates.end)) {
        return "End date must be after the start date!";
      }
    }
    if (step === 3) { // travel with
      if (!/^[A-Za-z\s]+$/.test(answer.trim())) {
        return "Please enter a valid option.";
      }
    }
    if (step === 4) { // Budget Validation
      const validBudgets = ["Low", "Medium", "High", "Luxury"];
      if (validBudgets.includes(answer)) {
        return null; // Valid if selected from dropdown
      }
      if (!/^\d+k?$/.test(answer)) {
        return "Please enter a valid budget (e.g., Low, Medium, High, Luxury, 5000, or 5k)!";
      }
      let budgetValue;
      if (answer.toLowerCase().endsWith("k")) {
        budgetValue = parseInt(answer.toLowerCase().replace("k", ""), 10) * 1000;
      } else {
        budgetValue = parseInt(answer, 10);
      }
    }
    if (step === 5) { // Transportation Validation
      if (!/^[A-Za-z\s]+$/.test(answer)) {
        return "Please enter a valid transportation mode (only letters allowed, no numbers or symbols)!";
      }
    }
    if (step === 6) { // interest
      if (!/^[A-Za-z\s]+$/.test(answer.trim())) {
        return "Please enter a valid interest (max 50 characters).";
      }
    }
    if (step === 7) { // Health Conditions Validation
      if (!/^[A-Za-z\s]+$/.test(answer.trim())) {
        return "Please enter a valid health condition (max 50 characters).";
      }
    }
    return null; // Input is valid
  };

  const handleNextStep = (answer) => {
    const validationError = validateInput(answer);
    if (validationError) {
      alert(validationError);
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: questions[step], sender: "bot" },
      { text: answer, sender: "user" }
    ]);

    const updatedResponses = { ...userResponses };
    switch (step) {
      case 0:
        updatedResponses.destination = answer;
        break;
      case 1:
        updatedResponses.departure = answer;
        break;
      case 2:
        updatedResponses.travelDates = { start: travelDates.start, end: travelDates.end };
        break;
      case 3:
        updatedResponses.travelType = answer;
        break;
      case 4:
        updatedResponses.budget = answer;
        break;
      case 5:
        updatedResponses.transportation = answer;
        break;
      case 6:
        updatedResponses.interests = [...updatedResponses.interests, answer];
        break;
      case 7:
        updatedResponses.healthConditions = answer;
        break;
      default:
        break;
    }
    setUserResponses(updatedResponses);
    setInputValue("");

    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 500);
    } else {
      console.log("Last question answered, calling sendDataToBackend...");
      sendDataToBackend(updatedResponses);
    }
  };

  const sendDataToBackend = async (data) => {
    try {
      const formattedData = {
        ...data,
        start_date: data.travelDates.start,
        end_date: data.travelDates.end
      };
      delete formattedData.travelDates;

      console.log("Sending data to backend:", formattedData);

      // Simulate a backend response since the backend is not ready
      const mockResponse = {
        id: 1,
        destination: formattedData.destination,
        departure: formattedData.departure,
        start_date: formattedData.start_date,
        end_date: formattedData.end_date,
        travelType: formattedData.travelType,
        budget: formattedData.budget,
        transportation: formattedData.transportation,
        interests: formattedData.interests,
        healthConditions: formattedData.healthConditions,
        itinerary: [
          { day: 1, activity: "Visit a famous landmark", location: formattedData.destination },
          { day: 2, activity: "Explore local culture", location: formattedData.destination }
        ]
      };

      console.log("Mock backend response:", mockResponse);

      const result = mockResponse;

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Your personalized itinerary has been created! Redirecting to your itinerary...", sender: "bot" }
      ]);
      setTimeout(() => {
        console.log("Redirecting to /itinerary...");
        navigate('/itinerary', { state: { itinerary: result } });
      }, 1000);
    } catch (error) {
      console.error("Error sending data:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "There was an error creating your itinerary. Please try again.", sender: "bot" }
      ]);
      setTimeout(() => {
        console.log("Redirecting to /itinerary despite error...");
        navigate('/itinerary');
      }, 1000);
    }
  };

  const handleViewPastItineraries = () => {
    navigate('/past-itineraries');
  };

  return (
    <div className="chatbot-container">
      <h2>TravelBot</h2>
      <div className="chatbot-actions">
        <button onClick={handleViewPastItineraries} className="past-itineraries-btn">
          View Past Itineraries
        </button>
      </div>
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === "user" ? "user-message" : "bot-message"}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="question">
        <h3>
          <span>{step < questions.length ? questions[step] : "Your itinerary is being created..."}</span>
        </h3>
        {step < questions.length && (
          <>
            {step === 2 ? (
              <div className="input-container">
                <label>Start Date:</label>
                <input
                  type="date"
                  value={travelDates.start}
                  onChange={(e) => setTravelDates({ ...travelDates, start: e.target.value })}
                />
                <label>End Date:</label>
                <input
                  type="date"
                  value={travelDates.end}
                  onChange={(e) => setTravelDates({ ...travelDates, end: e.target.value })}
                />
                <button onClick={() => handleNextStep(`From ${travelDates.start} to ${travelDates.end}`)}>
                  Confirm
                </button>
              </div>
            ) : (
              <>
                <div className="options">
                  {options[step]?.map((option) => (
                    <button key={option} onClick={() => handleNextStep(option)}>
                      {option}
                    </button>
                  ))}
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleNextStep(inputValue);
                    }}
                    placeholder="Or type your answer..."
                  />
                  <button className="send-btn" onClick={() => handleNextStep(inputValue)}>Send</button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Chatbot;