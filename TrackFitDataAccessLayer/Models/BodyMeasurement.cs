using System;
using System.Collections.Generic;

namespace TrackFitDataAccessLayer.Models;

public partial class BodyMeasurement
{
    public int Bmid { get; set; }

    public int? UserId { get; set; }

    public double? Waist { get; set; }

    public double? Chest { get; set; }

    public double? Hips { get; set; }

    public DateOnly? RecordedDate { get; set; }

    public virtual User User { get; set; }
}
