using System.ComponentModel.DataAnnotations;

namespace HappyNewYearCountDownAPI.Models {
    public class Chat : EntityBase {
        [StringLength(60)]
        public String? UserName { get; set; }
        public String? Message { get; set; }
    }
}
