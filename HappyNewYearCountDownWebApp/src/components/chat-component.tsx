import { motion } from "framer-motion";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import Connector from "../signalr-connection";

interface ChatComponentProps {
  username: string;
  status: boolean;
}

interface ChatMessage {
  UserName: string;
  Message: string;
}

interface Player {
  Id: string;
  Name: string;
}

const MAX_CHAT = 6;

export default function ChatComponent({
  username,
  status,
}: ChatComponentProps) {
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [message, setMessage] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const { SendMessage, GetID, events } = Connector();

  /* ------------------ Handlers ------------------ */

  const sendMessage = () => {
    if (!message.trim()) return;

    SendMessage(username, message);
    setMessage("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const addChat = (chat: ChatMessage) => {
    setChats((prev) =>
      prev.length >= MAX_CHAT ? [...prev.slice(1), chat] : [...prev, chat]
    );
  };

  /* ------------------ SignalR Events ------------------ */

  const handleOnlineReceived = (data: string) => {
    setPlayers(JSON.parse(data));
  };

  const handleGetMessageReceived = (data: string) => {
    setChats(JSON.parse(data));
  };

  const handleMessageReceived = (username: string, message: string) => {
    addChat({ UserName: username, Message: message });
  };

  useEffect(() => {
    events(
      handleOnlineReceived,
      handleMessageReceived,
      handleGetMessageReceived
    );
  }, []);

  /* ------------------ Utils ------------------ */

  const isMyID = (player: Player) =>
    GetID() === player.Id ? "bg-green-900 text-white" : "";

  /* ------------------ Render ------------------ */

  return (
    <>
      {/* Modal */}
      <dialog id="online_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle absolute right-2 top-2">
              ✕
            </button>
          </form>

          <h3 className="font-bold text-lg">
            รายชื่อผู้ใช้งานทั้งหมด ({players.length})
          </h3>

          <div className="overflow-x-auto mt-2">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>ชื่อผู้ใช้</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p) => (
                  <tr key={p.Id} className={`hover ${isMyID(p)}`}>
                    <td>{p.Id}</td>
                    <td>{p.Name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </dialog>

      {/* Chat Box */}
      <motion.div
        className="fixed bottom-10"
        initial={{ opacity: 0, left: -300 }}
        animate={{ opacity: status ? 1 : 0, left: status ? 20 : -300 }}
        transition={{ duration: 0.5 }}
      >
        {chats.map((chat, i) => (
          <div key={i} className="chat chat-start">
            <div className="chat-header">{chat.UserName}</div>
            <div className="chat-bubble">{chat.Message}</div>
          </div>
        ))}

        <div className="mt-5">
          <p
            onClick={() =>
              (
                document.getElementById("online_modal") as HTMLDialogElement
              )?.showModal()
            }
            className="text-green-400 text-sm cursor-pointer"
          >
            ขณะนี้กำลังมีคนออนไลน์อยู่ {players.length} คน
          </p>

          <div className="flex gap-2 mt-1">
            <input
              ref={inputRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="คุณอยากเขียนอะไร?"
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
