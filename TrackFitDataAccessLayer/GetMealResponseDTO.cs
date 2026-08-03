using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrackFitDataAccessLayer
{
    public class GetMealResponseDTO
    {
        public int MealId { get; set; }
        public int? UserId { get; set; }
        public string MealType { get; set; }
        public DateTime? MealDate { get; set; }   // ✅ only date

        public List<GetMealItemDTO> Items { get; set; }
    }

    public class GetMealItemDTO
    {
        public int ItemId { get; set; }      // needed for edit/delete
        public string FoodName { get; set; }
        public int? Calories { get; set; }

        public double? Quantity { get; set; }
        public string Unit { get; set; }
        public string Grams { get; set; }

    }
}
