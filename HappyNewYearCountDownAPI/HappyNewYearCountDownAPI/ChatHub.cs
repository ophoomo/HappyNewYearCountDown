using HappyNewYearCountDownAPI.Handlers;
using HappyNewYearCountDownAPI.Models;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json;

namespace HappyNewYearCountDownAPI
{
    public class ChatHub : Hub
    {
        private readonly ILogger _logger;

        public ChatHub(ILogger<ChatHub> logger)
        {
            _logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            var player = new Player { Id = Context.ConnectionId };
            UserHandler.Players.Add(player);

            var chats = UserHandler.Chats
                .OrderByDescending(x => x.CreatedAt)
                .Take(6)
                .OrderBy(x => x.CreatedAt)
                .ToList();

            var json = JsonSerializer.Serialize(chats);

            await Clients.Client(Context.ConnectionId).SendAsync("ReceiveMessage", json);
        }

        public async Task SendMessage(string username, string message)
        {
            var chat = new Chat
            {
                UserName = username,
                Message = message,
                CreatedAt = DateTime.UtcNow
            };

            UserHandler.Chats.Add(chat);

            await Clients.All.SendAsync("Message", username, message);
        }

        public async Task SetName(string username)
        {
            var player = UserHandler.Players.FirstOrDefault(x => x.Id == Context.ConnectionId);
            if (player != null)
            {
                player.Name = username;
            }

            var jsonPlayer = JsonSerializer.Serialize(UserHandler.Players.ToList());
            await Clients.All.SendAsync("Online", jsonPlayer);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            UserHandler.Players.RemoveWhere(x => x.Id == Context.ConnectionId);
            var jsonPlayer = JsonSerializer.Serialize(UserHandler.Players.ToList());
            await Clients.All.SendAsync("Online", jsonPlayer);
        }
    }
}
