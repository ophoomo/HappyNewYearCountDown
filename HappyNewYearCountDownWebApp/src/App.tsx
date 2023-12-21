import { useEffect, useRef, useState } from "react";
import { Fireworks } from "@fireworks-js/react";
import type { FireworksHandlers } from "@fireworks-js/react";
import CountDownComponent from "./components/countdown-component";
import HappyNewYearComponent from "./components/happy-new-year-component";
import Swal from "sweetalert2";
import Snowfall from "react-snowfall";

export default function App() {
  const ref = useRef<FireworksHandlers>(null);
  const [newYear, setNewYear] = useState(false);
  const [name, setName] = useState("ผู้ใช้งาน");

  const start = () => {
    if (!ref.current) return;
    ref.current.start();
    setNewYear(true);
    document.title = "Happy New Year 2024";
  };

  const stop = () => {
    if (!ref.current) return;
    ref.current.stop();
  };

  const getName = () => {
    const user_name = localStorage.getItem("name");
    if (user_name != null) setName(user_name);
    else {
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
          } else {
            location.reload();
          }
        }
      });
    }
  };

  useEffect(() => {
    getName();
    stop();
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
      </div>
    </div>
  );
}
