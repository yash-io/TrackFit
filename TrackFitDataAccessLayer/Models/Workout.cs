using System;
using System.Collections.Generic;

namespace TrackFitDataAccessLayer.Models;

public partial class Workout
{
    public int WorkoutId { get; set; }

    public int? UserId { get; set; }

    public string ExerciseName { get; set; }

    public int? Duration { get; set; }

    public int? CaloriesBurned { get; set; }

    public DateTime? WorkoutDate { get; set; }

    public virtual User User { get; set; }
}
