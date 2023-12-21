import { motion } from "framer-motion";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import Connector from "../signalr-connection";

interface IChatComponent {
  username: string;
  status: boolean;
}

export default function ChatComponent({ username, status }: IChatComponent) {
  interface IChat {
    username: string;
    message: string;
  }

  const count = useRef(0);
  const [chat, setChat] = useState<IChat[]>([]);
  const [online, setOnline] = useState<number>(0);
  const mymessage = useRef<string>("");
  const { SendMessage, events } = Connector();

  const onEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      sendMessage();
    }
  };

  const onInputMessage = (e: ChangeEvent<HTMLInputElement>) => {
    mymessage.current = e.target.value;
  };

  const sendMessage = () => {
    if (mymessage.current.length > 0) {
      SendMessage(username, mymessage.current);
      (document.getElementById("myinput") as HTMLInputElement).value = "";
      mymessage.current = "";
    }
  };

  const addChat = (data: IChat) => {
    if (count.current >= 6) {
      setChat((prevArray) => [...prevArray.slice(1), data]);
    } else {
      setChat((prevArray) => [...prevArray, data]);
      count.current++;
    }
  };

  const handleOnlineReceived = (user: number) => setOnline(user);
  const handleGetMessageReceived = (message: string) => {
    const datas: IChat[] = JSON.parse(message);
    setChat(datas);
    count.current = datas.length;
  };
  const handleMessageReceived = (username: string, message: string) => {
    addChat({
      username: username,
      message: message,
    });
  };

  useEffect(() => {
    events(
      handleOnlineReceived,
      handleMessageReceived,
      handleGetMessageReceived
    );
  }, []);

  return (
    <motion.div
      className="fixed bottom-10"
      initial={{ opacity: 0, left: -300 }}
      transition={{ duration: 0.5 }}
      animate={{ opacity: status ? 1 : 0, left: status ? 20 : -300 }}
    >
      {chat.map((item, i) => (
        <div key={i} className="chat chat-start">
          <div className="chat-header">{item.username}</div>
          <div className="chat-bubble">{item.message}</div>
        </div>
      ))}
      <div className="mt-5">
        <p className="text-green-400 text-sm">
          ขณะนี้กำลังมีคนออนไลน์อยู่ {online} คน
        </p>
        <div className="flex gap-2 mt-1">
          <input
            onKeyDown={onEnter}
            onChange={onInputMessage}
            placeholder="คุณอยากเขียนอะไร?"
            id="myinput"
            className="input input-bordered"
          />
          <button onClick={sendMessage} className="btn btn-primary">
            ส่ง
          </button>
        </div>
      </div>
    </motion.div>
  );
}
