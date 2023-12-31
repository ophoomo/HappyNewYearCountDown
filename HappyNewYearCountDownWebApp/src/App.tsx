import { useEffect, useRef, useState } from "react";
import { Fireworks } from "@fireworks-js/react";
import type { FireworksHandlers } from "@fireworks-js/react";
import CountDownComponent from "./components/countdown-component";
import HappyNewYearComponent from "./components/happy-new-year-component";
import Swal from "sweetalert2";
import Snowfall from "react-snowfall";
import ChatComponent from "./components/chat-component";
import moment from "moment-timezone";

export default function App() {
  const ref = useRef<FireworksHandlers>(null);
  const [newYear, setNewYear] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [name, setName] = useState("ไม่ระบุตัวตน");

  const start = () => {
    if (!ref.current) return;
    ref.current.start();
    setNewYear(true);
    setOpenChat(false);
    document.title = "Happy New Year 2024";
  };

  const stop = () => {
    if (!ref.current) return;
    ref.current.stop();
  };

  const getName = () => {
    const user_name = localStorage.getItem("name");
    if (user_name != null) {
      setName(user_name);
    } else {
      Swal.fire({
        icon: "question",
        title: "คำถาม?",
        text: "กรุณากรอกชื่อของคุณ",
        input: "text",
        inputAttributes: {
          autocapitalize: "off",
        },
        showCancelButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: "ยืนยัน",
      }).then((result) => {
        if (result.isConfirmed) {
          if (result.value != "") {
            localStorage.setItem("name", result.value);
            setName(result.value);
          }
          location.reload();
        }
      });
    }
  };

  const setBGTime = () => {
    let op = 0.1;
    const bg = document.getElementById("overlay") as HTMLElement;
    bg.style.transition = "4s ease-in-out";
    const time = moment.tz("Asia/Bangkok");
    if (time.hour() >= 22 || time.hour() <= 4) op = 0.8;
    else if (time.hour() >= 18 || time.hour() >= 6) op = 0.7;
    else if (time.hour() >= 14) op = 0.3;
    bg.style.opacity = op.toString();
  };

  useEffect(() => {
    getName();
    stop();
    setBGTime();
  }, []);

  return (
    <div>
      <Snowfall snowflakeCount={100} />
      <Fireworks
        ref={ref}
        options={{
          opacity: 0.5,
          sound: {
            enabled: true,
            files: [
              "/assets/sounds/explosion0.mp3",
              "/assets/sounds/explosion1.mp3",
              "/assets/sounds/explosion2.mp3",
            ],
            volume: {
              min: 6,
              max: 10,
            },
          },
        }}
        style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          position: "fixed",
        }}
      />
      <div className="flex h-screen w-full items-center justify-center flex-col z-50 fixed">
        <HappyNewYearComponent name={name} status={newYear} />
        <CountDownComponent status={!newYear} callback={() => start()} />
        <button
          className={`btn btn-sm fixed top-5 right-5 ${
            openChat ? "btn-error" : "btn-primary"
          }`}
          onClick={() => setOpenChat((prev) => !prev)}
        >
          {openChat ? "ปิด" : "แชท"}
        </button>
        <ChatComponent username={name} status={openChat} />
      </div>
    </div>
  );
}
