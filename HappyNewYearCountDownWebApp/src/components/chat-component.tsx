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
  interface IPlayer {
    Id: string;
    Name: string;
  }

  const count = useRef(0);
  const [chat, setChat] = useState<IChat[]>([]);
  const [player, setPlayer] = useState<IPlayer[]>([]);
  const mymessage = useRef<string>("");
  const { SendMessage, GetID, events } = Connector();

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

  const handleOnlineReceived = (user: string) => {
    const datas: IPlayer[] = JSON.parse(user);
    setPlayer(datas);
  };
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

  const CheckYourID = (item: IPlayer) => {
    const id = GetID();
    if (id == item.Id) return "bg-green-900 text-white";
    return "";
  };

  useEffect(() => {
    events(
      handleOnlineReceived,
      handleMessageReceived,
      handleGetMessageReceived
    );
  }, []);

  return (
    <>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">
            รายชื่อผู้ใช้งานทั้งหมด ({player.length})
          </h3>
          <div className="overflow-x-auto mt-2">
            <table className="table">
              <thead>
                <tr>
                  <th>รหัสประจำตัว</th>
                  <th>ชื่อผู้ใช้งาน</th>
                </tr>
              </thead>
              <tbody>
                {player.map((item, i) => (
                  <tr className={`hover ${CheckYourID(item)}`} key={i}>
                    <td>{item.Id}</td>
                    <td>{item.Name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </dialog>
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
          <p
            onClick={() =>
              (document.getElementById("my_modal_3") as any).showModal()
            }
            className="text-green-400 text-sm cursor-pointer"
          >
            ขณะนี้กำลังมีคนออนไลน์อยู่ {player.length} คน
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
    </>
  );
}
