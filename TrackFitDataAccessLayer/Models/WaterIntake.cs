using System;
using System.Collections.Generic;

namespace TrackFitDataAccessLayer.Models;

public partial class WaterIntake
{
    public int WaterId { get; set; }

    public int? UserId { get; set; }

    public int? QuantityMl { get; set; }

    public DateTime? IntakeTime { get; set; }

    public virtual User User { get; set; }
}
