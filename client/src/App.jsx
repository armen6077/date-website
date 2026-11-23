import { useState, useEffect } from "react";
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
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(false);

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [step]);

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


  if (step === 0) {
    return (
      <div className="container">
        <div
          className={`card opening-screen ${isVisible ? "slide-visible" : "slide-hidden"
            }`}
        >
          <div className="envelope">💌</div>
          <h1>Милюсь, это приглашение для тебя!</h1>

          <p>Я кое-что особенное приготовил именно для тебя…</p>

          <button
            className="submit"
            onClick={() => setStep(1)}
          >
            Открывай, любимая ❤️
          </button>
        </div>
      </div>
    );
  }
  if (step === 1) {
    return (
      <div className="container">
        <div
          className={`card question-screen ${isVisible ? "slide-visible" : "slide-hidden"
            }`}
        >
          <div className="heart">❤️</div>

          <h1>Милюсь, у меня есть один вопрос…</h1>

          <p>
            Жизнь становится прекраснее, когда рядом есть особенный человек.
          </p>

          <p>
            И мне бы очень хотелось провести с тобой немного времени.
          </p>

          <button
            className="submit"
            onClick={() => setStep(2)}
          >
            Продолжить ❤️
          </button>

        </div>
      </div >
    );
  }
  if (step === 2) {
    return (
      <div className="container">
        <div
          className={`card ${isVisible ? "slide-visible" : "slide-hidden"
            }`}
        >
          <div className="heart">❤️</div>

          <h1>Куда отправимся?</h1>

          <p>Выбирай, как мы проведём этот вечер...</p>

          <div className="places">
            {places.map((item) => (
              <button
                key={item.name}
                className={`place ${place === item.name ? "active" : ""}`}
                onClick={() => setPlace(item.name)}
              >
                <span>{item.emoji}</span>
                <strong>{item.name === "Dinner 🍝" ? "Романтический ужин" :
                  item.name === "Coffee ☕" ? "Выпить кофе" :
                    item.name === "Cinema 🎬" ? "Сходить в кино" :
                      "Прогулка"}
                </strong>
                <small>{item.description}</small>
              </button>
            ))}
          </div>

          <button
            className="submit"
            disabled={!place}
            onClick={() => setStep(3)}
          >
            Далее ❤️
          </button>
        </div>
      </div>
    );
  }
  if (step === 3) {
    return (
      <div className="container">
        <div
          className={`card ${isVisible ? "slide-visible" : "slide-hidden"
            }`}
        >
          <div className="heart">🌹</div>

          <h1>Когда встретимся?</h1>

          <p>Выбери удобную для тебя дату и время ❤️</p>

          <h3>Дата нашей встречи 📅</h3>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <h3>Во сколько? 🕒</h3>

          <div className="time-picker">
            <select
              value={time.split(":")[0] || ""}
              onChange={(e) =>
                setTime(`${e.target.value}:${time.split(":")[1] || "00"}`)
              }
            >
              <option value="">Часы</option>

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
              <option value="">Минуты</option>

              {minutes.map((minute) => (
                <option key={minute} value={minute}>
                  {minute}
                </option>
              ))}
            </select>
          </div>

          <button
            className="submit"
            disabled={!date || !time || time.startsWith("00:00")}
            onClick={() => setStep(4)}
          >
            Далее ❤️
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {

    return (
      <div className="container">
        <div className="card final-screen">
          <div className="heart">❤️</div>

          <h1>У нас будет свидание!</h1>

          <p>Милюсь, я уже с нетерпением жду нашей встречи! ❤️</p>

          <div className="result">
            <p>📍 {place}</p>
            <p>📅 {date}</p>
            <p>🕒 {time}</p>
            {message && <p>💌 {message}</p>}
          </div>

          <p>До скорой встречи! ❤️</p>
        </div>
      </div>
    );
  }
  if (step === 4) {
    return (
      <div className="container">
        <div className="card">
          <div className="heart">💌</div>

          <h1>Несколько слов от тебя...</h1>

          <p>
            Может быть, ты хочешь что-нибудь сказать мне?
          </p>

          <textarea
            placeholder="Напиши что-нибудь приятное..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            className="submit"
            onClick={handleSubmit}
          >
            Отправить ответ ❤️
          </button>
        </div>
      </div>
    );
  }


}

export default App;
