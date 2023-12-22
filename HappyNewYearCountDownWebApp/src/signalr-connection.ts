import * as signalR from "@microsoft/signalr";
const URL = import.meta.env.VITE_HOST_API || "http://localhost:5210/";
class Connector {
  private connection: signalR.HubConnection;
  public events: (
    onOnlineReceived: (user: number) => void,
    onMessageReceived: (username: string, message: string) => void,
    onGetMessageReceived: (message: string) => void
  ) => void;
  static instance: Connector;
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(URL + "chat-hub")
      .withAutomaticReconnect()
      .build();
    this.connection.start().catch((err) => document.write(err));
    this.events = (onOnlineReceived, onMessageReceived, onGetMessageReceived) => {
      this.connection.on("Online", (user) => {
        onOnlineReceived(user);
      });
      this.connection.on("Message", (username, messages) => {
        onMessageReceived(username, messages);
      });
      this.connection.on("ReceiveMessage", (messages) => {
        onGetMessageReceived(messages);
      });
    };
  }
  public SendMessage = (username: string, messages: string) => {
    this.connection.send("SendMessage", username, messages);
  };
  public static getInstance(): Connector {
    if (!Connector.instance) Connector.instance = new Connector();
    return Connector.instance;
  }
}
export default Connector.getInstance;
