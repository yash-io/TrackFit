namespace TrackFitWebServices.Models
{
    public class AddProfileDTO
    {
        public int UserId { get; set; }
        public int Age { get; set; } = 0;                                                                                                                                                                                                       
        public double? Height { get; set; }
        public double? Weight { get; set; }
        public string Goal { get; set; }
        public string? ProfileImage { get; set; }
        public int ProfileId { get; set; }
    }
}
