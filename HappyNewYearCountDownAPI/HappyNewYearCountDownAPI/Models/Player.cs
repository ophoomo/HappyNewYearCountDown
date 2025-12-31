namespace HappyNewYearCountDownAPI.Models
{
    public class Player
    {
        public string Id { get; set; } = new Guid().ToString();
        public string Name { get; set; } = "ไม่ระบุตัวตน";
    }
}
