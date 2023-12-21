using AutoMapper;
using HappyNewYearCountDownAPI.Database;
using HappyNewYearCountDownAPI.Dto;
using HappyNewYearCountDownAPI.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace HappyNewYearCountDownAPI {

    public static class UserHandler {
        public static HashSet<string> ConnectedIds = new HashSet<string>();
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
            UserHandler.ConnectedIds.Add(Context.ConnectionId);
            await Clients.All.SendAsync("Online", UserHandler.ConnectedIds.Count);
            var chats = await _databaseContext.Chat.OrderByDescending(x => x.Id).Take(6).ToListAsync();
            var chatsResult = _mapper.Map<List<ChatDto>>(chats);
            var json = JsonSerializer.Serialize(chatsResult);
            await Clients.Client(Context.ConnectionId).SendAsync("ReceiveMessage", json);
        }

        public async Task SendMessage(string username, string message) {
            Chat chat = new Chat();
            chat.UserName = username;
            chat.Message = message;
            _databaseContext.Chat.Add(chat);
            await _databaseContext.SaveChangesAsync();
            await Clients.All.SendAsync("Message", username, message);
        }

        public override async Task OnDisconnectedAsync(Exception? exception) {
            UserHandler.ConnectedIds.Remove(Context.ConnectionId);
            await Clients.All.SendAsync("Online", UserHandler.ConnectedIds.Count);
        }

    }
}
