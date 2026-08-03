using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System;
using TrackFitDataAccessLayer.Models;

namespace TrackFitDataAccessLayer
{
    public class DashBoardRepo
    {
        private TrackFitDbContext context;
        public DashBoardRepo(TrackFitDbContext _context) { 
            this.context = _context;
        }


        public object GetHealthDashboard(int userId)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            var todayTime = DateTime.Today;

            //user data
            var caloriesBurned = context.Workouts
                .Where(w => w.UserId == userId && w.WorkoutDate.Value.Date == todayTime)
                .Sum(w => (int?)w.CaloriesBurned) ?? 0;

            var water = context.WaterIntakes
                .Where(w => w.UserId == userId && w.IntakeTime.Value.Date == todayTime)
                .Sum(w => (int?)w.QuantityMl) ?? 0;

            var sleep = context.SleepTrackings
                .Where(s => s.UserId == userId && s.SleepDate == today)
                .Select(s => s.SleepHours)
                .FirstOrDefault();

            var bmi = context.Bmihistories
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.RecordedDate)
                .Select(b => b.Bmivalue)
                .FirstOrDefault();


            //max values
            var leaderboardCaloriesBurned = context.Workouts
                .Where(w => w.WorkoutDate.Value.Date == todayTime)
                .GroupBy(w => w.UserId)
                .Select(g => g.Sum(x => x.CaloriesBurned))
                .Max() ?? 0;

            var leaderboardWaterIntake = context.WaterIntakes
                .Where(w => w.IntakeTime.Value.Date == todayTime)
                .GroupBy(w => w.UserId)
                .Select(g => g.Sum(x => x.QuantityMl))
                .Max() ?? 0;

            var leaderboardSleepHours = context.SleepTrackings
                .Where(s => s.SleepDate == today)
                .Max(s => (double?)s.SleepHours) ?? 0;

            var leaderboardBMI = context.Bmihistories
                .GroupBy(b => b.UserId)
                .Select(g => g.OrderByDescending(x => x.RecordedDate)
                              .Select(x => x.Bmivalue)
                              .FirstOrDefault())
                .Max() ?? 0;


            return new
            {
                User = new 
                {
                    CaloriesBurned = caloriesBurned,
                    WaterIntake = water,
                    SleepHours = sleep,
                    BMI = bmi,
                },

               Leaderboard = new {
                   LeaderboardCaloriesBurned = leaderboardCaloriesBurned,
                   LeaderboardWaterIntake = leaderboardWaterIntake,
                   LeaderboardSleepHours = leaderboardSleepHours,
                   LeaderboardBMI = leaderboardBMI
               }

            };
        }

        public HealthDashboardDTO GetCompleteHealthDashboard(int userId)
        {

            var workouts =  context.Workouts
        .Where(x => x.UserId == userId)
        .ToList();

            var water =  context.WaterIntakes
                .Where(x => x.UserId == userId)
                .ToList();

            var sleep =  context.SleepTrackings
                .Where(x => x.UserId == userId)
                .ToList();

            var bmi =  context.Bmihistories
                .Where(x => x.UserId == userId)
                .ToList();

            var result = new HealthDashboardDTO();

            if (workouts.Any())
            {
                result.AvgCaloriesPerWorkout = workouts.Average(x => x.CaloriesBurned ?? 0);

                var best = workouts
                    .OrderByDescending(x => x.CaloriesBurned ?? 0)
                    .FirstOrDefault();

                result.BestWorkout = best?.ExerciseName;
            }

            if (water.Any())
            {
                result.AvgWaterPerDrink = water.Average(x => x.QuantityMl ?? 0);
                result.WaterEntries = water.Count;
            }

            if (sleep.Any())
            {
                result.AvgSleep = sleep.Average(x => x.SleepHours ?? 0);

                result.SleepConsistency = sleep.All(x => (x.SleepHours ?? 0) >= 7)
                    ? "Consistent"
                    : "Irregular";
            }

            if (bmi.Any())
            {
                var last = bmi.OrderBy(x => x.Bmiid).LastOrDefault();
                result.LatestBMI = last?.Bmivalue ?? 0;

                if (bmi.Count > 1)
                {
                    var lastVal = bmi[bmi.Count - 1].Bmivalue ?? 0;
                    var prevVal = bmi[bmi.Count - 2].Bmivalue ?? 0;

                    result.BmiChange = lastVal - prevVal;
                }
            }

            return result;
        }



        public Streak GetStreakDetails(int userId)
        {
            Streak streakObj = new();
            try
            {
                streakObj = (from streak in context.Streaks where streak.UserId == userId select streak).FirstOrDefault();
            }
            catch (Exception)
            {
                streakObj = null;
            }
            return streakObj;
        }


        public int TiggerStreak(int userId)
        {
            int status = 0;
            DateOnly today =  DateOnly.FromDateTime(DateTime.Now);
            DateOnly yesterday = today.AddDays(-1);
            try
            {
                var userStreak = context.Streaks.Find(userId);
                this.CheckAndUnlockAchievements(userId);
                
                if (userStreak != null)
                {
                    if (userStreak.LastActiveDate == today)
                    {
                        return status;
                    }
                    else if (userStreak.LastActiveDate == yesterday)
                    {
                        userStreak.CurrentStreak = userStreak.CurrentStreak + 1;
                    }
                    else
                    {
                        userStreak.CurrentStreak = 1;
                    }
                    userStreak.LastActiveDate = today;
                    userStreak.TotalNumberOfDaysActive = userStreak.TotalNumberOfDaysActive + 1;

                    context.SaveChanges();
                    status = 1;
                }
            }
            catch (Exception e)
            {
                status = -1;
            }
            return status;
        }

        public object GetAchievements(int userId)
        {
            object res = null;
            try
            {
                res = (from a in context.Achievements
                       join pa in context.PredefinedAchievements
                       on a.Pid equals pa.Pid
                       where a.UserId == userId
                       select new { pa.Title,pa.Description,a.AchievedDate }).ToList();
            }
            catch (Exception)
            {
                res = null;
            }
            return res;
        }


        public object GetRecords(int userId)
        {
            var workouts = (from w in context.Workouts where w.UserId == userId select w).ToList();
            var sleep = (from s in context.SleepTrackings where s.UserId == userId select s).ToList();
            var bmi = (from b in context.Bmihistories where b.UserId == userId select b).ToList();
            var waterIntake = (from w in context.WaterIntakes where w.UserId == userId select w).ToList();
            return new
            {
                Workouts = workouts,
                Sleep = sleep,
                Bmi = bmi,
                WaterIntakes = waterIntake
            };
        }

        public void CheckAndUnlockAchievements(int userId)
        {
            using (var db = this.context)
            {
                var totalCalories = db.Workouts
                    .Where(x => x.UserId == userId)
                    .Sum(x => (int?)x.CaloriesBurned) ?? 0;

                var totalWater = db.WaterIntakes
                    .Where(x => x.UserId == userId)
                    .Sum(x => (int?)x.QuantityMl) ?? 0;

                var totalWaterLiters = totalWater / 1000.0;

                var currentStreak = db.Streaks
                    .Where(x => x.UserId == userId)
                    .Select(x => x.CurrentStreak)
                    .FirstOrDefault();

                var unlockedIds = db.Achievements
                    .Where(x => x.UserId == userId)
                    .Select(x => x.Pid)
                    .ToList();
                var allAchievements = db.PredefinedAchievements.ToList();


                foreach (var ach in allAchievements)
                {
                    if (unlockedIds.Contains(ach.Pid))
                        continue;

                    var parts = ach.Title.Split('_');
                    int target = int.Parse(parts[0]);
                    string type = parts[1];

                    bool unlock = false;

                    switch (type)
                    {
                        case "days":
                            unlock = currentStreak >= target;
                            break;

                        case "k":
                            unlock = totalCalories >= target;
                            break;

                        case "l":
                            unlock = totalWaterLiters >= target;
                            break;
                    }

                    if (unlock)
                    {
                        db.Achievements.Add(new Achievement
                        {
                            UserId = userId,
                            Pid = ach.Pid,
                            AchievedDate = DateTime.Now
                        });
                    }
                }

                db.SaveChanges();
            }
        }

    }
}
