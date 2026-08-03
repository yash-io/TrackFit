using System;
using System.Collections.Generic;

namespace TrackFitDataAccessLayer.Models;

public partial class Leaderboard
{
    public int LeaderboardId { get; set; }

    public int? UserId { get; set; }

    public int? Score { get; set; }

    public virtual User User { get; set; }
}
