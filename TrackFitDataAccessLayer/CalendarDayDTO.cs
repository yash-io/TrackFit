using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrackFitDataAccessLayer
{
    public class CalendarDayDTO
    {
        public string Date { get; set; }
        public bool HasWorkout { get; set; }
        public bool HasWaterIntake { get; set; }
        public bool HasGoalDeadline { get; set; }
        public bool HasStreak { get; set; }
        public bool HasSleep { get; set; }
        public int TotalWaterMl { get; set; }
        public int TotalCalories { get; set; }
        public int WorkoutCount { get; set; }
        public double SleepHours { get; set; }
        public int CurrentStreak { get; set; }
        public List<string> Exercises { get; set; }
        public List<string> GoalTypes { get; set; }
    }
}
