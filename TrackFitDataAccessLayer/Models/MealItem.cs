using System;
using System.Collections.Generic;

namespace TrackFitDataAccessLayer.Models;

public partial class MealItem
{
    public int ItemId { get; set; }

    public int? MealId { get; set; }

    public string FoodName { get; set; }

    public int? Calories { get; set; }

    public double? Quantity { get; set; }

    public virtual Meal Meal { get; set; }
}
