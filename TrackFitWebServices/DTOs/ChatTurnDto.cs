namespace TrackFitWebServices.DTOs
{
    public class ChatTurnDto
    {
        public string Role { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }

    public class ChatRequestDto
    {
        public string Message { get; set; } = string.Empty;
        public List<ChatTurnDto> History { get; set; } = new();
    }
}