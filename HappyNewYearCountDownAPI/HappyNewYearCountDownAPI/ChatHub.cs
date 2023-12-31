using AutoMapper;
using HappyNewYearCountDownAPI.Database;
using HappyNewYearCountDownAPI.Dto;
using HappyNewYearCountDownAPI.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace HappyNewYearCountDownAPI {

    public class Player {
        public string Id { get; set; }
        public string Name { get; set; } = "ไม่ระบุตัวตน";
    }

    public static class UserHandler {
        public static HashSet<Player> player = new HashSet<Player>();
    }

    public class ChatHub : Hub {

        private readonly ILogger _logger;
        private readonly Mapper _mapper;
        private readonly DatabaseContext _databaseContext;

        public ChatHub(ILogger<ChatHub> logger, DatabaseContext databaseContext) {
            var config = new MapperConfiguration(cfg =>
                cfg.CreateMap<Chat, ChatDto>()
            );
            _mapper = new Mapper(config);
            _logger = logger;
            _databaseContext = databaseContext;
        }

        public override async Task OnConnectedAsync() {
            Player player = new Player();
            player.Id = Context.ConnectionId;
            UserHandler.player.Add(player);
            var chats = await _databaseContext.Chat.OrderByDescending(x => x.CreatedAt).Take(6).ToListAsync();
            chats = chats.OrderBy(x => x.CreatedAt).ToList();
            var chatsResult = _mapper.Map<List<ChatDto>>(chats);
            var json = JsonSerializer.Serialize(chatsResult);
            await Clients.Client(Context.ConnectionId).SendAsync("ReceiveMessage", json);
        }

        public async Task SendMessage(string username, string message) {
            Chat chat = new Chat();
            chat.UserName = username;
            chat.Message = message;
            chat.IsActive = true;
            _databaseContext.Chat.Add(chat);
            await _databaseContext.SaveChangesAsync();
            await Clients.All.SendAsync("Message", username, message);
        }

        public async Task SetName(string username) {
            var player = UserHandler.player.Where(x => x.Id == Context.ConnectionId).FirstOrDefault();
            if (player != null) {
                player.Name = username;
            }
            var jsonPlayer = JsonSerializer.Serialize(UserHandler.player.ToList());
            await Clients.All.SendAsync("Online", jsonPlayer);
        }

        public override async Task OnDisconnectedAsync(Exception? exception) {
            UserHandler.player.RemoveWhere(x => x.Id == Context.ConnectionId);
            var jsonPlayer = JsonSerializer.Serialize(UserHandler.player.ToList());
            await Clients.All.SendAsync("Online", jsonPlayer);
        }

    }
}
