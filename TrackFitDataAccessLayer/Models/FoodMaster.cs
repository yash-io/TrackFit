using System;
using System.Collections.Generic;

namespace TrackFitDataAccessLayer.Models;

public partial class FoodMaster
{
    public int FoodId { get; set; }

    public string FoodName { get; set; }

    public int? Calories { get; set; }

    public double? Protein { get; set; }

    public double? Carbs { get; set; }

    public double? Fats { get; set; }
}
