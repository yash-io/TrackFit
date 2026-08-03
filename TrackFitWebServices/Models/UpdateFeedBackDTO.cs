namespace TrackFitWebServices.Models
{
    public class UpdateFeedBackDTO
    {
        public int feedbackId { get; set; }
        public int Rating { get; set; }
        public string Message { get; set; } = null!;
        public DateTime CreatedDate { get; set; }
    }
}
