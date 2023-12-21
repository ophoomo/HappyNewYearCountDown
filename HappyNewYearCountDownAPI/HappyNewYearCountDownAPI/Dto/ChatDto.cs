using System.Text.Json.Serialization;

namespace HappyNewYearCountDownAPI.Dto {
    public class ChatDto {

        [JsonPropertyName("username")]
        public String? UserName {  get; set; }

        [JsonPropertyName("message")]
        public String? Message {  get; set; }
    }
}
