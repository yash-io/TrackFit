namespace TrackFitWebServices.Models
{
    public class TotalCaloriesDTO
    {
        public List<FoodCaloriesDTO> Foods { get; set; }

        public double TotalCalories { get; set; }
    }
}
