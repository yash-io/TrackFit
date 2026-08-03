using System;
using System.Collections.Generic;

namespace TrackFitDataAccessLayer.Models;

public partial class UserProfile
{
    public int ProfileId { get; set; }

    public int? UserId { get; set; }

    public int Age { get; set; }

    public double? Height { get; set; }

    public double? Weight { get; set; }

    public string Goal { get; set; }

    public string ProfileImage { get; set; }

    public virtual User User { get; set; }
}
