using System;
using System.Collections.Generic;

namespace TrackFitDataAccessLayer.Models;

public partial class Bmihistory
{
    public int Bmiid { get; set; }

    public int? UserId { get; set; }

    public double? Bmivalue { get; set; }

    public string Category { get; set; }

    public DateTime? RecordedDate { get; set; }

    public virtual User User { get; set; }
}
