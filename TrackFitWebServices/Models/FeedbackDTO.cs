namespace TrackFitWebServices.Models
{
    public class FeedbackDTO
    {
        public int UserId { get; set; }
        public int Rating { get; set; }
        public string Message { get; set; } = null!;
        public DateTime CreatedDate { get; set; }
    }
}
