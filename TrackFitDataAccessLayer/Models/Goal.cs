using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace TrackFitDataAccessLayer.Models;

public partial class Goal
{
    public int GoalId { get; set; }

    public int? UserId { get; set; }

    public string GoalType { get; set; }

    public double? TargetValue { get; set; }

    public DateOnly? Deadline { get; set; }

    public string Status { get; set; }
    [JsonIgnore]

    public virtual User User { get; set; }
}
