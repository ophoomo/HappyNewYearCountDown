using HappyNewYearCountDownAPI.Models;

namespace HappyNewYearCountDownAPI.Handlers
{
    public class UserHandler
    {
        private static readonly object _locker = new();
    
        public static HashSet<Player> Players { get; } = new();
        public static List<Chat> Chats { get; } = new();

        public static void AddChat(Chat chat)
        {
            lock (_locker)
                Chats.Add(chat);
        }

        public static List<Chat> GetLatestChats(int count = 6)
        {
            lock (_locker)
                return Chats
                    .OrderByDescending(x => x.CreatedAt)
                    .Take(count)
                    .OrderBy(x => x.CreatedAt)
                    .ToList();
        }
    }
}
