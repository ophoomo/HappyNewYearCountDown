namespace HappyNewYearCountDownAPI {
    public interface IChatClient {
        Task ReceiveMessage(string message);
    }
}
