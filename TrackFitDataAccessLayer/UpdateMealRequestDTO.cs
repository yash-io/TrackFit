namespace TrackFitDataAccessLayer
{
    public class UpdateMealRequestDTO
    {
        public int MealId { get; set; }
        public int UserId { get; set; }
        public string MealType { get; set; }
        public DateTime MealTime { get; set; }
        public List<UpdateMealItemDTO> MealItems { get; set; }
    }

    public class UpdateMealItemDTO
    {
        public int ItemId { get; set; }
        public string FoodName { get; set; }
        public int Calories { get; set; }
        public double Quantity { get; set; }
    }
}