namespace TrackFitDataAccessLayer
{
    public class AddMealRequestDTO
    {
        public int UserId { get; set; }
        public string MealType { get; set; }
        public DateTime MealTime { get; set; }
        public List<MealItemRequest> MealItems { get; set; }
    }

    public class MealItemRequest
    {
        public string FoodName { get; set; }
        public int Calories { get; set; }
        public double Quantity { get; set; }
        public string Unit { get; set; }
        public string Grams { get; set; }
    }
}