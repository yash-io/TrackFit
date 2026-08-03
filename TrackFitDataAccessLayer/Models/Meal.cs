using System;
using System.Collections.Generic;

namespace TrackFitDataAccessLayer.Models;

public partial class Meal
{
    public int MealId { get; set; }

    public int? UserId { get; set; }

    public string MealType { get; set; }

    public DateTime? MealTime { get; set; }

    public virtual ICollection<MealItem> MealItems { get; set; } = new List<MealItem>();

    public virtual User User { get; set; }
}
