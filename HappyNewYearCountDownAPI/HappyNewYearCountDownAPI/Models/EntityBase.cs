namespace HappyNewYearCountDownAPI.Models {
    public class EntityBase {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Boolean IsActive { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime DeletedAt { get; set; } = DateTime.UtcNow;
    }
}
