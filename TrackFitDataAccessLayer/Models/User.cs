using System;
using System.Collections.Generic;

namespace TrackFitDataAccessLayer.Models;

public partial class User
{
    public int UserId { get; set; }

    public bool? IsAdmin { get; set; }

    public string UserName { get; set; }

    public string EmailId { get; set; }

    public byte[] PasswordHash { get; set; }

    public string Theme { get; set; }

    public DateTime? CreatedDate { get; set; }

    public virtual ICollection<Achievement> Achievements { get; set; } = new List<Achievement>();

    public virtual ICollection<Bmihistory> Bmihistories { get; set; } = new List<Bmihistory>();

    public virtual ICollection<BodyMeasurement> BodyMeasurements { get; set; } = new List<BodyMeasurement>();

    public virtual ICollection<ChatHistory> ChatHistories { get; set; } = new List<ChatHistory>();

    public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

    public virtual ICollection<Goal> Goals { get; set; } = new List<Goal>();

    public virtual ICollection<Leaderboard> Leaderboards { get; set; } = new List<Leaderboard>();

    public virtual ICollection<Meal> Meals { get; set; } = new List<Meal>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<Reminder> Reminders { get; set; } = new List<Reminder>();

    public virtual ICollection<SleepTracking> SleepTrackings { get; set; } = new List<SleepTracking>();

    //public virtual ICollection<Step> Steps { get; set; } = new List<Step>();

    public virtual ICollection<Streak> Streaks { get; set; } = new List<Streak>();

    public virtual ICollection<UserProfile> UserProfiles { get; set; } = new List<UserProfile>();

    public virtual ICollection<WaterIntake> WaterIntakes { get; set; } = new List<WaterIntake>();

    public virtual ICollection<Workout> Workouts { get; set; } = new List<Workout>();
}
