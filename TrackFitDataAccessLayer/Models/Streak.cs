using System;
using System.Collections.Generic;

namespace TrackFitDataAccessLayer.Models;

public partial class Streak
{
    public int StreakId { get; set; }

    public int? UserId { get; set; }

    public int? TotalNumberOfDaysActive { get; set; }

    public int? CurrentStreak { get; set; }

    public int? LongestStreak { get; set; }

    public DateOnly? LastActiveDate { get; set; }

    public virtual User User { get; set; }
}
