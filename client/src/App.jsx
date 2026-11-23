
import { useState } from "react";
import "./App.css";

const places = [
  { name: "Dinner 🍝", description: "Romantic dinner", emoji: "🍽️" },
  { name: "Coffee ☕", description: "Coffee together", emoji: "☕" },
  { name: "Cinema 🎬", description: "Movie night", emoji: "🎬" },
  { name: "Walk 🌆", description: "Evening walk", emoji: "🌆" },
];

function App() {
  const [step, setStep] = useState(0);
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [time, setTime] = useState("");

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  const minutes = Array.from({ length: 6 }, (_, i) =>
    String(i * 10).padStart(2, "0")
  );


  async function handleSubmit() {
    if (!place || !date || !time) {
      alert("Please choose a place, date and time ❤️");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/send-date`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          place,
          date,
          time,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSubmitted(true);

    } catch (error) {
      console.error("Error:", error);
      alert("Couldn't send your answer. Please try again ❤️");
    }
  }


  if (submitted) {
    if (step === 0) {
      return (
        <div className="container">
          <div className="card opening-screen">
            <div className="envelope">💌</div>

            <h1>You have a special invitation</h1>

            <p>
              Someone has something special to ask you...
            </p>

            <button
              className="submit"
              onClick={() => setStep(1)}
            >
              Open my invitation ❤️
            </button>
          </div>
        </div>
      );
    }

    if (submitted) {
      return (
        <div className="container">
          <div className="card">
            <h1>It's a date! ❤️</h1>
            <p>I'm so excited to spend time with you!</p>

            <div className="result">
              <p>📍 {place}</p>
              <p>📅 {date}</p>
              <p>🕒 {time}</p>
              <p>💌 {message}</p>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div className="heart">❤️</div>

        <h1>Let's go
          <br />
          on a date!</h1>
        <p>I have a little question for you...</p>

        <h3>Where would you like to go?</h3>

        <div className="places">
          {places.map((item) => (
            <button
              key={item.name}
              className={`place ${place === item.name ? "active" : ""}`}
              onClick={() => setPlace(item.name)}
            >
              <span>{item.emoji}</span>
              <strong>{item.name}</strong>
              <small>{item.description}</small>
            </button>
          ))}
        </div>

        <h3>Choose a date 📅</h3>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <h3>Choose a time 🕒</h3>
        <div className="time-picker">
          <select
            value={time.split(":")[0] || ""}
            onChange={(e) =>
              setTime(`${e.target.value}:${time.split(":")[1] || "00"}`)
            }
          >
            <option value="">Hour</option>

            {hours.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>

          <span>:</span>

          <select
            value={time.split(":")[1] || ""}
            onChange={(e) =>
              setTime(`${time.split(":")[0] || "00"}:${e.target.value}`)
            }
          >
            <option value="">Min</option>

            {minutes.map((minute) => (
              <option key={minute} value={minute}>
                {minute}
              </option>
            ))}
          </select>
        </div>

        <h3>Something you'd like to tell me? 💌</h3>
        <textarea
          placeholder="Write something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button className="submit" onClick={handleSubmit}>
          Send my answer ❤️
        </button>
      </div>
    </div>
  );
}

export default App;
