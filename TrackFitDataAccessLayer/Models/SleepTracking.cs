using System;
using System.Collections.Generic;

namespace TrackFitDataAccessLayer.Models;

public partial class SleepTracking
{
    public int SleepId { get; set; }

    public int? UserId { get; set; }

    public double? SleepHours { get; set; }

    public DateOnly? SleepDate { get; set; }

    public virtual User User { get; set; }
}
