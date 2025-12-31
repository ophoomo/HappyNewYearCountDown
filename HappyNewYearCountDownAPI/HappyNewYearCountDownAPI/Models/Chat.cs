namespace HappyNewYearCountDownAPI.Models
{
    public class Chat
    {
        public string UserName { get; set; } = "ไม่ระบุตัวตน";
        public string? Message { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
