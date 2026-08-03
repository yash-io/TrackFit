using System;
using System.Collections.Generic;

namespace TrackFitDataAccessLayer.Models;

public partial class Achievement
{
    public int AchievementId { get; set; }

    public int? UserId { get; set; }

    public int? Pid { get; set; }

    public DateTime? AchievedDate { get; set; }

    public virtual PredefinedAchievement PidNavigation { get; set; }

    public virtual User User { get; set; }
}
