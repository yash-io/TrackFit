using System;
using System.Collections.Generic;

namespace TrackFitDataAccessLayer.Models;

public partial class PredefinedAchievement
{
    public int Pid { get; set; }

    public string Title { get; set; }

    public string Description { get; set; }

    public virtual ICollection<Achievement> Achievements { get; set; } = new List<Achievement>();
}
