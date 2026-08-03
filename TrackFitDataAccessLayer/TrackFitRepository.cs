using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using TrackFitDataAccessLayer;
using TrackFitDataAccessLayer.Models;
using TrackFitWebServices.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

public class TrackFitRepostiory

{
    private TrackFitDbContext context;
    private DashBoardRepo dashBoardRepo;
    private FeedbackRepo feedbackRepo;
    private readonly string _connectionString;
    public TrackFitRepostiory(TrackFitDbContext context, DashBoardRepo dashBoardRepo, FeedbackRepo feedbackRepo,IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("TrackFitDBConnectionString");
        this.context = context;
        this.dashBoardRepo = dashBoardRepo;
        this.feedbackRepo = feedbackRepo;
    }

    public object GetHealthDashboard(int userId)
    {
        return dashBoardRepo.GetHealthDashboard(userId);
    }
    public HealthDashboardDTO GetCompleteHealthDashboard(int userId)
    {
        return dashBoardRepo.GetCompleteHealthDashboard(userId);
    }

    public int TriggerStreak(int userId)
    {
        return dashBoardRepo.TiggerStreak(userId);
    }

    public object GetAchievements(int userId)
    {
        return dashBoardRepo.GetAchievements(userId);
    }
    public Streak GetStreakDetails(int userId)
    {
        return dashBoardRepo.GetStreakDetails(userId);
    }

    public int SubmitFeedbackForm(int UserId, int Rating, string Message, DateTime CreatedDate)
    {
        return feedbackRepo.SubmitFeedbackForm(UserId, Rating, Message, CreatedDate);
    }

    public int UpdateFeedback(int feedBackId, int Rating, string Message, DateTime CreatedDate)
    {
        return feedbackRepo.UpdateFeedback(feedBackId, Rating, Message, CreatedDate);
    }

    public object GetRecords(int userId)
    {
        return dashBoardRepo.GetRecords(userId);
    }
    public int RegisterUser(string userName, string emailId, string password)
    {
        int returnResult = 0;

        SqlParameter prmUserName = new SqlParameter("@UserName", userName);
        SqlParameter prmEmailId = new SqlParameter("@EmailId", emailId);
        SqlParameter prmPassword = new SqlParameter("@Password", password);
        SqlParameter prmReturnResult = new SqlParameter("@ReturnResult", System.Data.SqlDbType.Int);
        prmReturnResult.Direction = System.Data.ParameterDirection.Output;
        try
        {
            context.Database.ExecuteSqlRaw("EXEC @ReturnResult = usp_RegisterUser @UserName, @EmailId, @Password",
                prmReturnResult, prmUserName, prmEmailId, prmPassword);
            returnResult = (int)prmReturnResult.Value;

        }
        catch (Exception)
        {
            returnResult = -99;
        }
        return returnResult;
    }

    public int LoginUser(string emailId, string password, out int userId, out bool isAdmin)

    {

        int returnResult = 0;
        userId = 0;
        isAdmin = false;

        SqlParameter prmEmailId = new SqlParameter("@EmailId", emailId);
        SqlParameter prmPassword = new SqlParameter("@Password", password);
        SqlParameter prmUserId = new SqlParameter("@UserId", System.Data.SqlDbType.Int);
        prmUserId.Direction = System.Data.ParameterDirection.Output;
        SqlParameter prmIsAdmin = new SqlParameter("@IsAdmin", System.Data.SqlDbType.Bit);
        prmIsAdmin.Direction = System.Data.ParameterDirection.Output;
        SqlParameter prmReturnResult = new SqlParameter("@ReturnResult", System.Data.SqlDbType.Int);
        prmReturnResult.Direction = System.Data.ParameterDirection.Output;

        try

        {

            context.Database.ExecuteSqlRaw(

                "EXEC @ReturnResult = usp_LoginUser @EmailId, @Password, @UserId OUTPUT, @IsAdmin OUTPUT",

                prmReturnResult, prmEmailId, prmPassword, prmUserId, prmIsAdmin

            );

            returnResult = (int)prmReturnResult.Value;

            if (returnResult == 1)

            {

                userId = (int)prmUserId.Value;

                isAdmin = (bool)prmIsAdmin.Value;

            }
        }
        catch (Exception)
        {
            returnResult = -99;
        }
        return returnResult;
    }


    public int AddUserProfile(int userId, int age, double? height, double? weight, string goal, string profileImage)
    {
        int result = 0;
        SqlParameter prmUserId = new SqlParameter("@UserId", userId);
        SqlParameter prmAge = new SqlParameter("@Age", age);
        SqlParameter prmWeight = new SqlParameter("@Weight", weight ?? (object)DBNull.Value);
        SqlParameter prmHeight = new SqlParameter("@Height", height ?? (object)DBNull.Value);
        SqlParameter prmGoal = new SqlParameter("@Goal", goal);
        SqlParameter prmImage = new SqlParameter("@ProfileImage", profileImage ?? (object)DBNull.Value);
        SqlParameter prmReturn = new SqlParameter("@ReturnVal", System.Data.SqlDbType.Int);
        prmReturn.Direction = System.Data.ParameterDirection.Output;

        try
        {
            context.Database.ExecuteSqlRaw("EXEC @ReturnVal = usp_AddUserProfile @UserId, @Age, @Height, @Weight, @Goal, @ProfileImage",
                prmReturn, prmUserId, prmAge, prmHeight, prmWeight, prmGoal, prmImage);
            result = Convert.ToInt32(prmReturn.Value);
            if (weight != null && height != null && height !=0)
            {
                decimal bm = Math.Round((decimal)weight * 10000 / ((decimal)height * (decimal)height), 2);
                double b = (double)bm;
                var bmi = new Bmihistory
                {
                    UserId = userId,
                    Bmivalue = b,
                    Category = b < 18.5 ? "Underweight" : b < 25 ? "Normal" : b < 30 ? "Overweight" : "Obese",
                    RecordedDate = DateTime.Now
                };
                context.Bmihistories.Add(bmi);
                context.SaveChanges();
            }

        }
        catch
        {
            result = -99;
        }
        return result;
    }

    public async Task<FoodMaster> GetFoodByName(string foodName)
    {
        return await context.FoodMasters.FirstOrDefaultAsync(x => x.FoodName.ToLower() == foodName.ToLower());
    }

    public bool AddSleep(int UserId, double SleepHours, DateOnly SleepDate)
    {
        bool status = false;
        SleepTracking sleep = new();
        sleep.UserId = UserId;
        sleep.SleepHours = SleepHours;
        sleep.SleepDate = SleepDate;
        try
        {
            context.SleepTrackings.Add(sleep);
            status = true;
            context.SaveChanges();
        }
        catch (Exception ex)
        {
            status = false;
        }
        return status;
    }

    public async Task SaveFood(FoodMaster food)
    {
        context.FoodMasters.Add(food);
        await context.SaveChangesAsync();
    }

    public UserProfileDTO GetUserProfile(int userId)
    {
        UserProfileDTO res = new UserProfileDTO();
        try
        {
            var user = context.Users.FirstOrDefault(x => x.UserId == userId);
            var profile = context.UserProfiles.FirstOrDefault(x => x.UserId == userId);

            if (user == null)
            {
                return null;
            }

            res.UserId = userId;
            res.UserName = user.UserName;
            res.EmailId = user.EmailId;

            if (profile != null)
            {
                res.Age = profile.Age;
                res.Height = profile.Height;
                res.Weight = profile.Weight;
                res.Goal = profile.Goal;
                res.ProfileImage = profile.ProfileImage;
                res.ProfileId = profile.ProfileId;
            }
        }
        catch (Exception)
        {
            res = null;
        }
        return res;
    }


    public int UpdateUserName(int userId, string userName)
    {
        int result = 0;
        try
        {
            var user = context.Users.FirstOrDefault(x => x.UserId == userId);
            if (user == null)
            {
                result = -1;
            }
            else
            {
                user.UserName = userName;
                context.SaveChanges();
                result = 1;
            }
        }
        catch (Exception)
        {
            result = -99;
        }
        return result;
    }

    public List<UserListDTO> GetActiveUsersToday()

    {

        try

        {

            var today = DateTime.Today;

            var users = (from u in context.Users
                         join s in context.Streaks on u.UserId equals s.UserId
                         join l in context.Leaderboards on u.UserId equals l.UserId into lb
                         from l in lb.DefaultIfEmpty()
                         where s.LastActiveDate == DateOnly.FromDateTime(today) && u.IsAdmin == false
                         select new UserListDTO
                         {
                             UserId = u.UserId,
                             UserName = u.UserName,
                             EmailId = u.EmailId,
                             Score = l != null ? (l.Score ?? 0) : 0,
                             CurrentStreak = s.CurrentStreak ?? 0,
                             LastActiveDate = s.LastActiveDate.HasValue ? s.LastActiveDate.Value.ToDateTime(TimeOnly.MinValue)

        : (DateTime?)null }).ToList();

            return users;

        }

        catch (Exception ex)
        {
            Console.WriteLine("Error in GetActiveUsersToday: " + ex.Message);
            return new List<UserListDTO>();
        }

    }



    public int ChangePassword(int userId, string currentPassword, string newPassword)
    {

        int result = 0;
        SqlParameter prUserId = new SqlParameter("@UserId", userId);
        SqlParameter prCurrentPassword = new SqlParameter("@CurrentPassword", currentPassword ?? (object)DBNull.Value);

        SqlParameter prNewPassword = new SqlParameter("@NewPassword", newPassword ?? (object)DBNull.Value);
        SqlParameter prReturn = new SqlParameter("@ReturnVal", System.Data.SqlDbType.Int);
        prReturn.Direction = System.Data.ParameterDirection.Output;
        try
        {
            context.Database.ExecuteSqlRaw(
                "EXEC @ReturnVal = sp_ChangePassword @UserId, @CurrentPassword, @NewPassword",
                prReturn,
                prUserId,
                prCurrentPassword,
                prNewPassword
            );
            result = Convert.ToInt32(prReturn.Value);
        }
        catch
        {
            result = -99;
        }
        return result;
    }

    public List<object> GetAllFeedbacks()
    {
        List<object> result = new List<object>();
        try
        {
            result = (from f in context.Feedbacks
                      join u in context.Users on f.UserId equals u.UserId
                      orderby f.CreatedDate descending
                      select new
                      {
                          f.FeedbackId,
                          f.Rating,
                          f.UserId,
                          u.UserName,
                          f.Message,
                          f.CreatedDate
                      }).ToList<object>();
        }
        catch
        {
           result = new List<object>();
        }
        return result;
    }

    public List<WeeklyActivityDTO> GetWeeklyActivity()
    {
        List<WeeklyActivityDTO> result = new List<WeeklyActivityDTO>();
        try
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            var last7Days = today.AddDays(-6);
            var dbData = context.Streaks
                .Where(s => s.LastActiveDate != null && s.LastActiveDate >= last7Days)
                .GroupBy(s => s.LastActiveDate)
                .Select(g => new
                {
                    Date = g.Key.Value,
                    Count = g.Count()
                })
                .ToDictionary(x => x.Date, x => x.Count);

            for (int i = 0; i < 7; i++)
            {
                var date = last7Days.AddDays(i);

                result.Add(new WeeklyActivityDTO
                {

                    Date = date,
                    ActiveUsers = dbData.ContainsKey(date) ? dbData[date] : 0

                });
            }

            result = result.OrderBy(x => x.Date).ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error: " + ex.Message);
        }
        return result;
    }


    public async Task<bool> UpdateLeaderboard()
    {
        try
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {

                string query = @"
                BEGIN TRY
                    DELETE FROM Leaderboard;
                    INSERT INTO Leaderboard (UserId, Score)
                    SELECT 
                        UserId,
                        ISNULL(SUM(CaloriesBurned), 0)
                    FROM Workouts
                    GROUP BY UserId;
                END TRY
                BEGIN CATCH
                    THROW;
                END CATCH
                ";

                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    await con.OpenAsync();
                    await cmd.ExecuteNonQueryAsync();
                }
            }
            return true;
        }

        catch (SqlException ex)
        {
           throw new Exception("Database error while updating leaderboard: " + ex.Message);
        }

        catch (Exception ex)
        {
            throw new Exception("Unexpected error in UpdateLeaderboard: " + ex.Message);
        }

    }

    public async Task<List<LeaderBoardDTO>> GetLeaderboard()
    {
        List<LeaderBoardDTO> leaderboard = new List<LeaderBoardDTO>();
        try
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string query = @"
                SELECT TOP 50
                    u.UserId,
                    u.UserName,
                    ISNULL(l.Score,0) AS Score,
                    ISNULL(s.CurrentStreak, 0) AS CurrentStreak,
                    s.LastActiveDate
                FROM Users u
                LEFT JOIN Leaderboard l ON l.UserId = u.UserId
                LEFT JOIN Streaks s ON u.UserId = s.UserId
                where u.IsAdmin = 0
                ORDER BY 
                    ISNULL(l.Score,0) DESC,
                    ISNULL(s.CurrentStreak,0) DESC,
                    s.LastActiveDate DESC
                ";

                using (SqlCommand cmd = new SqlCommand(query, con))
                {

                    await con.OpenAsync();
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())

                        {

                            leaderboard.Add(new LeaderBoardDTO
                            {
                                UserId = Convert.ToInt32(reader["UserId"]),
                                UserName = reader["UserName"].ToString(),
                                Score = reader["Score"] == DBNull.Value ? 0 : Convert.ToInt32(reader["Score"]),
                                CurrentStreak = reader["CurrentStreak"] == DBNull.Value ? 0 : Convert.ToInt32(reader["CurrentStreak"]),
                                LastActiveDate = reader["LastActiveDate"] == DBNull.Value
                                    ? null
                                    : Convert.ToDateTime(reader["LastActiveDate"])
                            });
                        }
                    }
                }
            }
            int rank = 1;
            foreach (var user in leaderboard)
            {
                user.Rank = rank++;
                            }
            return leaderboard;

        }
        catch (SqlException ex)
        {
            throw new Exception("Database error while fetching leaderboard: " + ex.Message);
                    }
        catch (Exception ex)
        {
            throw new Exception("Unexpected error in GetLeaderboard: " + ex.Message);
        }
    }
public async Task<List<UserListDTO>> GetAllUsers()
    {
        List<UserListDTO> users = new List<UserListDTO>();
        using (SqlConnection con = new SqlConnection(_connectionString))
        {
            await con.OpenAsync();
            string query = @"
            SELECT 
                u.UserId,
                u.UserName,
                u.EmailId,
                ISNULL(l.Score, 0) AS Score,
                ISNULL(s.CurrentStreak, 0) AS CurrentStreak,
                s.LastActiveDate
            FROM Users u
            LEFT JOIN Streaks s ON u.UserId = s.UserId
            LEFT JOIN Leaderboard l ON u.UserId = l.UserId
            WHERE u.IsAdmin = 0
        ";

            using (SqlCommand cmd = new SqlCommand(query, con))
            using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    users.Add(new UserListDTO
                    {
                        UserId = Convert.ToInt32(reader["UserId"]),
                        UserName = reader["UserName"].ToString(),
                        EmailId = reader["EmailId"].ToString(),
                        Score = Convert.ToInt32(reader["Score"]),
                        CurrentStreak = Convert.ToInt32(reader["CurrentStreak"]),
                        LastActiveDate = reader["LastActiveDate"] == DBNull.Value
                            ? (DateTime?)null
                            : Convert.ToDateTime(reader["LastActiveDate"])
                    });
                }
            }
        }
        return users;
    }


    public async Task<int> GetUserCount()
    {
        using (SqlConnection con = new SqlConnection(_connectionString))
        {
            await con.OpenAsync();
            string query = "SELECT COUNT(*) FROM Users WHERE IsAdmin = 0";
            using (SqlCommand cmd = new SqlCommand(query, con))
            {
                return (int)await cmd.ExecuteScalarAsync();
            }
        }
    }


  

    public List<Goal> GetGoalsByUser(int userId)
    {
        return context.Goals
            .Where(g => g.UserId == userId)
            .ToList();
    }

    public bool AddGoal(Goal goal)
    {
        bool result = false;
        try
        {
            goal.Status = "In Progress";
            context.Goals.Add(goal);
            context.SaveChanges();
            result = true;
        }
        catch (Exception) { result = false; }
        return result;
    }

    public int UpdateGoal(Goal goal)
    {
        int result = 0;
        try
        {
            var existing = context.Goals.Find(goal.GoalId);
            if (existing == null) return -1;

            existing.GoalType = goal.GoalType;
            existing.TargetValue = goal.TargetValue;
            existing.Deadline = goal.Deadline;
            existing.Status = goal.Status;

            context.SaveChanges();
            result = 1;
        }
        catch (Exception) { result = -99; }
        return result;
    }

    public int DeleteGoal(int goalId)
    {
        int result = 0;
        try
        {
            var goal = context.Goals.Find(goalId);
            if (goal == null) return -1;
            context.Goals.Remove(goal);
            context.SaveChanges();
            result = 1;
        }
        catch (Exception) { result = -99; }
        return result;
    }

    public int MarkGoalComplete(int goalId)
    {
        int result = 0;
        try
        {
            var goal = context.Goals.Find(goalId);
            if (goal == null) return -1;
            goal.Status = "Completed";
            context.SaveChanges();
            result = 1;
        }
        catch (Exception) { result = -99; }
        return result;
    }


    public List<Workout> GetWorkoutsByUser(int userId)
    {
        return context.Workouts
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.WorkoutDate)
            .ToList();
    }

    public List<Workout> GetWorkoutsByGoalType(int userId, string goalType)
    {

        List<string> exercises = GetExercisesForGoal(goalType);

        return context.Workouts
            .Where(w => w.UserId == userId &&
                   exercises.Contains(w.ExerciseName))
            .OrderByDescending(w => w.WorkoutDate)
            .ToList();
    }


    private List<string> GetExercisesForGoal(string goalType)
    {
        switch (goalType)
        {
            case "Weight Loss":
                return new List<string> {
                "Jogging", "Cycling", "Jump Rope",
                "Burpees", "Walking"
            };
            case "Weight Gain":
                return new List<string> {
                "Pull-ups", "Push-ups", "Deadlift",
                "Squats", "Bench Press"
            };
            case "Muscle Building":
                return new List<string> {
                "Bench Press", "Deadlift", "Pull-ups",
                "Squats", "Shoulder Press"
            };
           /* case "Flexibility & Mobility":
                return new List<string> {
                "Yoga", "Stretching", "Pilates",
                "Foam Rolling", "Meditation"
            };
           */
            case "Stamina Improvement":
                return new List<string> {
                "Running", "Swimming", "Cycling",
                "Jump Rope", "HIIT"
            };
         
            case "Daily Steps":
                return new List<string> {
                "Walking", "Hiking", "Jogging",
                "Stair Climbing", "Treadmill"
            };
            default:
                return new List<string>();
        }
    }

    public int AddWorkout(Workout workout)
    {
        int result = 0;
        try
        {

            workout.CaloriesBurned = CalculateCalories(
                workout.ExerciseName,
                workout.Duration ?? 0
            );
            workout.WorkoutDate = DateTime.Now;
            context.Workouts.Add(workout);
            context.SaveChanges();
            result = 1;
        }
        catch (Exception) { result = -99; }
        return result;
    }

    public int UpdateWorkout(Workout workout)
    {
        int result = 0;
        try
        {
            var existing = context.Workouts.Find(workout.WorkoutId);
            if (existing == null) return -1;

            existing.ExerciseName = workout.ExerciseName;
            existing.Duration = workout.Duration;
            existing.CaloriesBurned = CalculateCalories(
                workout.ExerciseName,
                workout.Duration ?? 0
            );

            context.SaveChanges();
            result = 1;
        }
        catch (Exception) { result = -99; }
        return result;
    }

    public int DeleteWorkout(int workoutId)
    {
        int result = 0;
        try
        {
            var workout = context.Workouts.Find(workoutId);
            if (workout == null) return -1;
            context.Workouts.Remove(workout);
            context.SaveChanges();
            result = 1;
        }
        catch (Exception) { result = -99; }
        return result;
    }


    private int CalculateCalories(string exerciseName, int durationMinutes)
    {

        double caloriesPerMinute;

        switch (exerciseName)
        {
            case "Running":
            case "Jogging": caloriesPerMinute = 10.0; break;
            case "Cycling": caloriesPerMinute = 8.0; break;
            case "Swimming": caloriesPerMinute = 9.0; break;
            case "Jump Rope": caloriesPerMinute = 12.0; break;
            case "HIIT": caloriesPerMinute = 13.0; break;
            case "Burpees": caloriesPerMinute = 11.0; break;
            case "Walking": caloriesPerMinute = 4.0; break;
            case "Hiking": caloriesPerMinute = 6.0; break;
            case "Push-ups": caloriesPerMinute = 7.0; break;
            case "Pull-ups": caloriesPerMinute = 8.0; break;
            case "Squats": caloriesPerMinute = 6.0; break;
            case "Deadlift": caloriesPerMinute = 7.0; break;
            case "Bench Press": caloriesPerMinute = 6.0; break;
            case "Shoulder Press": caloriesPerMinute = 6.0; break;
          //  case "Yoga": caloriesPerMinute = 3.0; break;
          //  case "Stretching": caloriesPerMinute = 2.5; break;
          //  case "Pilates": caloriesPerMinute = 4.0; break;
          //  case "Meditation": caloriesPerMinute = 1.5; break;
            case "Foam Rolling": caloriesPerMinute = 2.0; break;
            case "Treadmill": caloriesPerMinute = 9.0; break;
            case "Stair Climbing": caloriesPerMinute = 8.0; break;
            default: caloriesPerMinute = 5.0; break;
        }

        return (int)(caloriesPerMinute * durationMinutes);
    }



    public List<WorkoutPlanDay> GenerateWorkoutPlan(string goalType)
    {
        var plan = new List<WorkoutPlanDay>();
        var exercises = GetPlanExercises(goalType);

      
        var dayFocus = GetDayFocus(goalType);

        for (int day = 1; day <= 7; day++)
        {
            if (day == 7)
            {
                plan.Add(new WorkoutPlanDay
                {
                    Day = "Day 7",
                    DayName = "Sunday",
                    Focus = "Rest & Recovery",
                    IsRestDay = true,
                    Exercises = new List<PlanExercise>()
                });
                continue;
            }

            var dayExercises = exercises
                .Skip((day - 1) * 2 % exercises.Count)
                .Take(2)
                .ToList();

            plan.Add(new WorkoutPlanDay
            {
                Day = "Day " + day,
                DayName = GetDayName(day),
                Focus = dayFocus[day - 1],
                IsRestDay = false,
                Exercises = dayExercises
            });
        }

        return plan;
    }

    private List<string> GetDayFocus(string goalType)
    {
        switch (goalType)
        {
            case "Weight Loss":
                return new List<string> {
                "Morning Cardio",
                "HIIT Burn",
                "Lower Body",
                "Steady Cardio",
                "Upper Body Tone",
                "Active Recovery"
            };
            case "Weight Gain":
            case "Muscle Building":
                return new List<string> {
                "Push — Chest & Shoulders",
                "Pull — Back & Biceps",
                "Legs — Quads & Hamstrings",
                "Push — Shoulders & Triceps",
                "Pull — Back & Arms",
                "Legs — Glutes & Calves"
            };
          /*  case "Flexibility & Mobility":
                return new List<string> {
                "Morning Flow",
                "Hip Mobility",
                "Full Body Yoga",
                "Spine & Back",
                "Deep Stretch",
                "Mindful Recovery"
            };
          */
            case "Stamina Improvement":
                return new List<string> {
                "Base Building",
                "Interval Training",
                "Cross Training",
                "Tempo Run",
                "Long Distance",
                "Peak Conditioning"
            };
            case "Daily Steps":
                return new List<string> {
                "Morning Walk",
                "Nature Walk",
                "Active Commute",
                "Treadmill Day",
                "Social Walk",
                "Weekend Activity"
            };
            default:
                return new List<string> {
                "Day 1","Day 2","Day 3",
                "Day 4","Day 5","Day 6"
            };
        }
    }
    private string GetDayName(int day)
    {
        string[] days = {
        "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday", "Sunday"
    };
        return days[day - 1];
    }

    private List<PlanExercise> GetPlanExercises(string goalType)
    {
        switch (goalType)
        {
            
            case "Weight Loss":
                return new List<PlanExercise>
            {
                new PlanExercise {
                    Name       = "Brisk Walking",
                    Sets       = 1,
                    Reps       = "45 min",
                    RestTime   = "None",
                    BestTime   = "Morning 6-7 AM",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Burns fat steadily without stressing joints"
                },
                new PlanExercise {
                    Name       = "Jumping Jacks",
                    Sets       = 4,
                    Reps       = "30 reps",
                    RestTime   = "30 sec",
                    BestTime   = "Morning 7-8 AM",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Full body warm-up that raises heart rate quickly"
                },
                new PlanExercise {
                    Name       = "HIIT Intervals",
                    Sets       = 5,
                    Reps       = "40 sec on / 20 sec off",
                    RestTime   = "60 sec between rounds",
                    BestTime   = "Morning 7-9 AM",
                    Difficulty = "Intermediate",
                    WhyThisEx  = "Burns maximum calories in minimum time"
                },
                new PlanExercise {
                    Name       = "Burpees",
                    Sets       = 3,
                    Reps       = "12 reps",
                    RestTime   = "45 sec",
                    BestTime   = "Anytime",
                    Difficulty = "Intermediate",
                    WhyThisEx  = "Works entire body and boosts metabolism"
                },
                new PlanExercise {
                    Name       = "Bodyweight Squats",
                    Sets       = 4,
                    Reps       = "20 reps",
                    RestTime   = "30 sec",
                    BestTime   = "Evening 5-6 PM",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Strengthens legs while burning calories"
                },
                new PlanExercise {
                    Name       = "Jogging",
                    Sets       = 1,
                    Reps       = "30 min steady",
                    RestTime   = "None",
                    BestTime   = "Morning 6-7 AM",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Steady cardio targets fat as primary fuel"
                },
                new PlanExercise {
                    Name       = "Jump Rope",
                    Sets       = 3,
                    Reps       = "5 min",
                    RestTime   = "60 sec",
                    BestTime   = "Anytime",
                    Difficulty = "Beginner",
                    WhyThisEx  = "High calorie burn with minimal equipment"
                },
                new PlanExercise {
                    Name       = "Plank Hold",
                    Sets       = 3,
                    Reps       = "45 sec",
                    RestTime   = "30 sec",
                    BestTime   = "Evening 6-7 PM",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Tones core while supporting weight loss posture"
                },
                new PlanExercise {
                    Name       = "Cycling",
                    Sets       = 1,
                    Reps       = "40 min easy",
                    RestTime   = "None",
                    BestTime   = "Evening 5-6 PM",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Low impact cardio for active recovery days"
                }
            };

            case "Weight Gain":
                return new List<PlanExercise>
            {
                new PlanExercise {
                    Name       = "Bench Press",
                    Sets       = 4,
                    Reps       = "6-8 reps (heavy)",
                    RestTime   = "120 sec",
                    BestTime   = "Morning 8-10 AM",
                    Difficulty = "Intermediate",
                    WhyThisEx  = "Primary chest builder for upper body mass"
                },
                new PlanExercise {
                    Name       = "Deadlift",
                    Sets       = 4,
                    Reps       = "5 reps (max weight)",
                    RestTime   = "180 sec",
                    BestTime   = "Morning 8-10 AM",
                    Difficulty = "Advanced",
                    WhyThisEx  = "Most effective full body mass building exercise"
                },
                new PlanExercise {
                    Name       = "Barbell Squats",
                    Sets       = 5,
                    Reps       = "5 reps (heavy)",
                    RestTime   = "180 sec",
                    BestTime   = "Morning 8-10 AM",
                    Difficulty = "Advanced",
                    WhyThisEx  = "Triggers most testosterone for overall mass gain"
                },
                new PlanExercise {
                    Name       = "Pull-ups",
                    Sets       = 4,
                    Reps       = "8 reps",
                    RestTime   = "90 sec",
                    BestTime   = "Morning 9-11 AM",
                    Difficulty = "Intermediate",
                    WhyThisEx  = "Builds wide back and strong biceps"
                },
                new PlanExercise {
                    Name       = "Overhead Press",
                    Sets       = 4,
                    Reps       = "8 reps",
                    RestTime   = "120 sec",
                    BestTime   = "Morning 9-11 AM",
                    Difficulty = "Intermediate",
                    WhyThisEx  = "Builds shoulder width and upper body size"
                },
                new PlanExercise {
                    Name       = "Barbell Curl",
                    Sets       = 3,
                    Reps       = "10 reps",
                    RestTime   = "60 sec",
                    BestTime   = "Afternoon 4-6 PM",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Isolates and builds bicep peak"
                },
                new PlanExercise {
                    Name       = "Leg Press",
                    Sets       = 3,
                    Reps       = "12 reps",
                    RestTime   = "90 sec",
                    BestTime   = "Afternoon 4-6 PM",
                    Difficulty = "Intermediate",
                    WhyThisEx  = "Safely loads legs for maximum muscle growth"
                },
                new PlanExercise {
                    Name       = "Cable Rows",
                    Sets       = 4,
                    Reps       = "10 reps",
                    RestTime   = "75 sec",
                    BestTime   = "Afternoon 4-6 PM",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Builds thickness in mid back for fuller look"
                }
            };

          
            case "Muscle Building":
                return new List<PlanExercise>
            {
                new PlanExercise {
                    Name       = "Bench Press",
                    Sets       = 4,
                    Reps       = "8-10 reps",
                    RestTime   = "90 sec",
                    BestTime   = "Morning 8-10 AM",
                    Difficulty = "Intermediate",
                    WhyThisEx  = "Foundation of chest development"
                },
                new PlanExercise {
                    Name       = "Shoulder Press",
                    Sets       = 3,
                    Reps       = "10 reps",
                    RestTime   = "75 sec",
                    BestTime   = "Morning 8-10 AM",
                    Difficulty = "Intermediate",
                    WhyThisEx  = "Builds shoulder width and roundness"
                },
                new PlanExercise {
                    Name       = "Tricep Dips",
                    Sets       = 3,
                    Reps       = "12 reps",
                    RestTime   = "60 sec",
                    BestTime   = "Morning 9-10 AM",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Defines and builds the back of the arm"
                },
                new PlanExercise {
                    Name       = "Pull-ups",
                    Sets       = 4,
                    Reps       = "8 reps",
                    RestTime   = "90 sec",
                    BestTime   = "Morning 8-10 AM",
                    Difficulty = "Intermediate",
                    WhyThisEx  = "Best exercise for back width and V-taper"
                },
                new PlanExercise {
                    Name       = "Barbell Row",
                    Sets       = 4,
                    Reps       = "10 reps",
                    RestTime   = "75 sec",
                    BestTime   = "Morning 9-11 AM",
                    Difficulty = "Intermediate",
                    WhyThisEx  = "Adds thickness and density to back muscles"
                },
                new PlanExercise {
                    Name       = "Hammer Curls",
                    Sets       = 3,
                    Reps       = "12 reps",
                    RestTime   = "60 sec",
                    BestTime   = "Afternoon 5-6 PM",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Builds brachialis for arm thickness"
                },
                new PlanExercise {
                    Name       = "Squats",
                    Sets       = 4,
                    Reps       = "10 reps",
                    RestTime   = "90 sec",
                    BestTime   = "Afternoon 4-6 PM",
                    Difficulty = "Intermediate",
                    WhyThisEx  = "King of lower body exercises for leg mass"
                },
                new PlanExercise {
                    Name       = "Romanian Deadlift",
                    Sets       = 3,
                    Reps       = "10 reps",
                    RestTime   = "75 sec",
                    BestTime   = "Afternoon 4-6 PM",
                    Difficulty = "Intermediate",
                    WhyThisEx  = "Targets hamstrings and glutes for leg definition"
                },
                new PlanExercise {
                    Name       = "Calf Raises",
                    Sets       = 4,
                    Reps       = "15 reps",
                    RestTime   = "45 sec",
                    BestTime   = "Anytime",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Develops calf muscle for proportional legs"
                },
                new PlanExercise {
                    Name       = "Lat Pulldown",
                    Sets       = 4,
                    Reps       = "10 reps",
                    RestTime   = "75 sec",
                    BestTime   = "Morning 9-11 AM",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Great for beginners to build lat width"
                }
            };

       /*     case "Flexibility & Mobility":
                return new List<PlanExercise>
            {
                new PlanExercise {
                    Name       = "Sun Salutation",
                    Sets       = 3,
                    Reps       = "5 rounds",
                    RestTime   = "30 sec",
                    BestTime   = "Morning 6-7 AM",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Warms up entire body and improves morning energy"
                },
                new PlanExercise {
                    Name       = "Cat-Cow Stretch",
                    Sets       = 1,
                    Reps       = "10 min",
                    RestTime   = "None",
                    BestTime   = "Morning 6-7 AM",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Relieves spine stiffness and improves posture"
                },
                new PlanExercise {
                    Name       = "Hip Flexor Stretch",
                    Sets       = 3,
                    Reps       = "60 sec each side",
                    RestTime   = "30 sec",
                    BestTime   = "Morning or Evening",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Opens tight hips from prolonged sitting"
                },
                new PlanExercise {
                    Name       = "Pigeon Pose",
                    Sets       = 2,
                    Reps       = "90 sec each side",
                    RestTime   = "30 sec",
                    BestTime   = "Evening 6-7 PM",
                    Difficulty = "Intermediate",
                    WhyThisEx  = "Deep hip opener for full range of motion"
                },
                new PlanExercise {
                    Name       = "Vinyasa Flow Yoga",
                    Sets       = 1,
                    Reps       = "45 min session",
                    RestTime   = "None",
                    BestTime   = "Morning 7-8 AM",
                    Difficulty = "Intermediate",
                    WhyThisEx  = "Links breath with movement for total flexibility"
                },
                new PlanExercise {
                    Name       = "Spinal Twist",
                    Sets       = 2,
                    Reps       = "90 sec each side",
                    RestTime   = "30 sec",
                    BestTime   = "Evening 7-8 PM",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Releases lower back tension and improves rotation"
                },
                new PlanExercise {
                    Name       = "Forward Fold",
                    Sets       = 3,
                    Reps       = "60 sec hold",
                    RestTime   = "30 sec",
                    BestTime   = "Evening 6-7 PM",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Lengthens hamstrings and decompresses spine"
                },
                new PlanExercise {
                    Name       = "Guided Meditation",
                    Sets       = 1,
                    Reps       = "20 min",
                    RestTime   = "None",
                    BestTime   = "Night 9-10 PM",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Improves mind-body connection and recovery"
                },
                new PlanExercise {
                    Name       = "Foam Rolling",
                    Sets       = 1,
                    Reps       = "15 min full body",
                    RestTime   = "None",
                    BestTime   = "Post workout",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Releases muscle knots and improves tissue quality"
                }
            };
       */
          
            case "Stamina Improvement":
                return new List<PlanExercise>
            {
                new PlanExercise {
                    Name       = "Easy Jog",
                    Sets       = 1,
                    Reps       = "20 min at 60% effort",
                    RestTime   = "None",
                    BestTime   = "Morning 6-7 AM",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Builds aerobic base without overloading body"
                },
                new PlanExercise {
                    Name       = "Sprint Intervals",
                    Sets       = 6,
                    Reps       = "30 sec sprint",
                    RestTime   = "90 sec walk",
                    BestTime   = "Morning 7-9 AM",
                    Difficulty = "Intermediate",
                    WhyThisEx  = "Trains fast-twitch muscles and boosts VO2 max"
                },
                new PlanExercise {
                    Name       = "Jump Rope",
                    Sets       = 3,
                    Reps       = "3 min continuous",
                    RestTime   = "60 sec",
                    BestTime   = "Anytime",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Improves coordination and cardiovascular fitness"
                },
                new PlanExercise {
                    Name       = "Swimming",
                    Sets       = 1,
                    Reps       = "20 min continuous",
                    RestTime   = "None",
                    BestTime   = "Morning 7-9 AM",
                    Difficulty = "Intermediate",
                    WhyThisEx  = "Full body low impact cardio for lung capacity"
                },
                new PlanExercise {
                    Name       = "Tempo Run",
                    Sets       = 1,
                    Reps       = "25 min at 75% effort",
                    RestTime   = "None",
                    BestTime   = "Morning 6-8 AM",
                    Difficulty = "Intermediate",
                    WhyThisEx  = "Raises lactate threshold for longer endurance"
                },
                new PlanExercise {
                    Name       = "Long Distance Jog",
                    Sets       = 1,
                    Reps       = "40 min easy pace",
                    RestTime   = "None",
                    BestTime   = "Weekend Morning",
                    Difficulty = "Intermediate",
                    WhyThisEx  = "Builds mental toughness and aerobic endurance"
                },
                new PlanExercise {
                    Name       = "HIIT Circuit",
                    Sets       = 4,
                    Reps       = "45 sec work / 15 sec rest",
                    RestTime   = "90 sec between rounds",
                    BestTime   = "Afternoon 5-7 PM",
                    Difficulty = "Advanced",
                    WhyThisEx  = "Peak conditioning workout for serious stamina"
                }
            };

           
            case "Daily Steps":
                return new List<PlanExercise>
            {
                new PlanExercise {
                    Name       = "Brisk Morning Walk",
                    Sets       = 1,
                    Reps       = "30 min (3500 steps)",
                    RestTime   = "None",
                    BestTime   = "Morning 6-7 AM",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Morning walks boost metabolism for the whole day"
                },
                new PlanExercise {
                    Name       = "Evening Stroll",
                    Sets       = 1,
                    Reps       = "20 min (2000 steps)",
                    RestTime   = "None",
                    BestTime   = "Evening 6-7 PM",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Aids digestion and reduces evening stress"
                },
                new PlanExercise {
                    Name       = "Nature Hike",
                    Sets       = 1,
                    Reps       = "60 min trail walk",
                    RestTime   = "As needed",
                    BestTime   = "Weekend Morning",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Combines steps with mental health benefits"
                },
                new PlanExercise {
                    Name       = "Stair Climbing",
                    Sets       = 5,
                    Reps       = "3 floors up and down",
                    RestTime   = "60 sec",
                    BestTime   = "Anytime during day",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Replaces elevator habit with calorie burning"
                },
                new PlanExercise {
                    Name       = "Treadmill Walk",
                    Sets       = 1,
                    Reps       = "45 min at 3% incline",
                    RestTime   = "None",
                    BestTime   = "Afternoon 4-6 PM",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Incline increases calorie burn without running"
                },
                new PlanExercise {
                    Name       = "Walking Lunges",
                    Sets       = 3,
                    Reps       = "20 meters",
                    RestTime   = "45 sec",
                    BestTime   = "Morning or Evening",
                    Difficulty = "Beginner",
                    WhyThisEx  = "Adds strength training to your daily steps"
                }
            };

            default:
                return new List<PlanExercise>();
        }
    }

    public bool DeleteUser(int userId)
    {
        //var profile = context.UserProfiles.FirstOrDefault(p => p.UserId == userId);
        //if (profile != null)
        //{
        //    context.UserProfiles.Remove(profile);
        //}
        var user = context.Users.FirstOrDefault(p => p.UserId == userId);
        if (user == null)
        {
            return false;
        }
        context.Users.Remove(user);
        context.SaveChanges();

        return true;
    }


    public async Task<bool> AddSupportRequestAsync(SupportRequest request)
    {
        request.CreatedDate = DateTime.Now;

        await context.SupportRequests.AddAsync(request);
        await context.SaveChangesAsync();

        return true;
    }


    public async Task<List<Notification>> GetNotificationsAsync(int userId)
    {
        return await context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedDate)
            .ToListAsync();
    }

    public async Task<bool> AddNotificationAsync(Notification notification)
    {
        notification.CreatedDate = DateTime.Now;
        notification.IsRead = false;

        await context.Notifications.AddAsync(notification);
        await context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> MarkAsReadAsync(int id)
    {
        var notification = await context.Notifications.FindAsync(id);
        if (notification == null) return false;

        notification.IsRead = true;
        await context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteNotificationAsync(int id)
    {
        var notification = await context.Notifications.FindAsync(id);
        if (notification == null) return false;

        context.Notifications.Remove(notification);
        await context.SaveChangesAsync();

        return true;
    }



    public List<CalendarDayDTO> GetCalendarData(
        int userId, int month, int year)
    {
        var result = new List<CalendarDayDTO>();
        var startDate = new DateTime(year, month, 1);
        var endDate = startDate.AddMonths(1).AddDays(-1);

        
        var workouts = context.Workouts
            .Where(w => w.UserId == userId &&
                   w.WorkoutDate.HasValue &&
                   w.WorkoutDate.Value.Month == month &&
                   w.WorkoutDate.Value.Year == year)
            .ToList();

        var waterList = context.WaterIntakes
            .Where(w => w.UserId == userId &&
                   w.IntakeTime.HasValue &&
                   w.IntakeTime.Value.Month == month &&
                   w.IntakeTime.Value.Year == year)
            .ToList();

        var goals = context.Goals
            .Where(g => g.UserId == userId &&
                   g.Deadline.HasValue &&
                   g.Deadline.Value.Month == month &&
                   g.Deadline.Value.Year == year)
            .ToList();

        var sleepList = context.SleepTrackings
            .Where(s => s.UserId == userId &&
                   s.SleepDate.HasValue &&
                   s.SleepDate.Value.Month == month &&
                   s.SleepDate.Value.Year == year)
            .ToList();

        var streak = context.Streaks
            .FirstOrDefault(s => s.UserId == userId);

       

        for (var date = startDate;
             date <= endDate;
             date = date.AddDays(1))
        {
            var dateOnly = date.Date;

          
            var dayWorkouts = workouts
                .Where(w => w.WorkoutDate.Value.Date == dateOnly)
                .ToList();

            
            var dayWater = waterList
                .Where(w => w.IntakeTime.Value.Date == dateOnly)
                .ToList();

            
            var dayGoals = goals
                .Where(g => g.Deadline.Value ==
                       DateOnly.FromDateTime(dateOnly))
                .ToList();

           
            var daySleep = sleepList
                .Where(s => s.SleepDate.Value ==
                       DateOnly.FromDateTime(dateOnly))
                .FirstOrDefault();

            
            bool hasStreak = false;
            int currentStreak = 0;
            if (streak != null)
            {
                currentStreak = streak.CurrentStreak ?? 0;
                if (streak.LastActiveDate.HasValue)
                {
                    var diff = Math.Abs(
                        (dateOnly -
                         streak.LastActiveDate.Value
                         .ToDateTime(TimeOnly.MinValue).Date)
                        .Days
                    );
                    hasStreak = diff <= 1 && dayWorkouts.Any();
                }
            }

            result.Add(new CalendarDayDTO
            {
                Date = date.ToString("yyyy-MM-dd"),
                HasWorkout = dayWorkouts.Any(),
                HasWaterIntake = dayWater.Any(),
                HasGoalDeadline = dayGoals.Any(),
                HasStreak = hasStreak,
                HasSleep = daySleep != null,
                TotalWaterMl = dayWater
                    .Sum(w => w.QuantityMl ?? 0),
                TotalCalories = dayWorkouts
                    .Sum(w => w.CaloriesBurned ?? 0),
                WorkoutCount = dayWorkouts.Count,
                SleepHours = daySleep?.SleepHours ?? 0,
                CurrentStreak = currentStreak,
                Exercises = dayWorkouts
                    .Select(w => w.ExerciseName)
                    .Where(n => n != null)
                    .ToList(),
                GoalTypes = dayGoals
                    .Select(g => g.GoalType)
                    .Where(n => n != null)
                    .ToList()
            });
        }

        return result;
    }
   
    
  
    
    public List<Reminder> GetRemindersByUser(int userId)
    {
        return context.Reminders
            .Where(r => r.UserId == userId)
            .OrderBy(r => r.ReminderTime)
            .ToList();
    }

    public int AddReminder(Reminder reminder)
    {
        int result = 0;
        try
        {
            reminder.IsActive = true;
            reminder.IsCompleted = false;
            context.Reminders.Add(reminder);
            context.SaveChanges();
            result = 1;
        }
        catch (Exception) { result = -99; }
        return result;
    }

    public int UpdateReminder(Reminder reminder)
    {
        int result = 0;
        try
        {
            var existing = context.Reminders.Find(reminder.ReminderId);
            if (existing == null) return -1;

            existing.Title = reminder.Title;
            existing.ReminderText = reminder.ReminderText;
            existing.ReminderTime = reminder.ReminderTime;
            existing.ReminderType = reminder.ReminderType;
            existing.IsActive = reminder.IsActive;
            existing.IsCompleted = reminder.IsCompleted;

            context.SaveChanges();
            result = 1;
        }
        catch (Exception) { result = -99; }
        return result;
    }

    public int DeleteReminder(int reminderId)
    {
        int result = 0;
        try
        {
            var reminder = context.Reminders.Find(reminderId);
            if (reminder == null) return -1;
            context.Reminders.Remove(reminder);
            context.SaveChanges();
            result = 1;
        }
        catch (Exception) { result = -99; }
        return result;
    }

    public int MarkReminderComplete(int reminderId)
    {
        int result = 0;
        try
        {
            var reminder = context.Reminders.Find(reminderId);
            if (reminder == null) return -1;
            reminder.IsCompleted = true;
            reminder.IsActive = false;
            context.SaveChanges();
            result = 1;
        }
        catch (Exception) { result = -99; }
        return result;
    }

    public int AddMeal(int userId, string mealType, DateTime mealTime, List<MealItem> items)
    {
        var meal = new Meal
        {
            UserId = userId,
            MealType = mealType,
            MealTime = mealTime
        };

        context.Meals.Add(meal);
        context.SaveChanges();


        foreach (var item in items)
        {
            item.MealId = meal.MealId;
            context.MealItems.Add(item);
        }

        context.SaveChanges();

        return 1;
    }

    
    public object GetTodayCaloriesByMealType(int userId)
    {
        var today = DateTime.Today;

        var result = (from m in context.Meals
                      join mi in context.MealItems on m.MealId equals mi.MealId
                      where m.UserId == userId
                            && m.MealTime >= today
                            && m.MealTime < today.AddDays(1)
                      group mi by m.MealType into g
                      select new
                      {
                          MealType = g.Key,
                          TotalCalories = g.Sum(x => x.Calories * x.Quantity)
                      }).ToList();

        return result;
    }
    public List<GetMealResponseDTO> GetMeals(int userId)
    {
        return context.Meals
            .Where(m => m.UserId == userId)
            .Select(m => new GetMealResponseDTO
            {
                MealId = m.MealId,
                UserId = m.UserId,
                MealType = m.MealType,

              
                MealDate = m.MealTime.HasValue
                    ? m.MealTime.Value.Date
                    : null,

                Items = context.MealItems
                    .Where(i => i.MealId == m.MealId)
                    .Select(i => new GetMealItemDTO
                    {
                        ItemId = i.ItemId,
                        FoodName = i.FoodName,
                        Calories = i.Calories,
                        Quantity = i.Quantity
                    }).ToList()
            })
            .ToList();
    }
    public int UpdateMeal(UpdateMealRequestDTO request)
    {
        var meal = context.Meals.FirstOrDefault(m => m.MealId == request.MealId);
        if (meal == null) return 0;

        meal.MealType = request.MealType;
        meal.MealTime = request.MealTime;

        
        var oldItems = context.MealItems.Where(i => i.MealId == request.MealId).ToList();
        context.MealItems.RemoveRange(oldItems);
        context.SaveChanges();

        foreach (var item in request.MealItems)
        {
            context.MealItems.Add(new MealItem
            {
                MealId = request.MealId,
                FoodName = item.FoodName,
                Calories = item.Calories,
                Quantity = item.Quantity
            });
        }

        context.SaveChanges();
        return 1;
    }

    public int DeleteMeal(int mealId)
    {
        var meal = context.Meals.FirstOrDefault(m => m.MealId == mealId);
        if (meal == null) return 0;

        var items = context.MealItems.Where(i => i.MealId == mealId).ToList();
        context.MealItems.RemoveRange(items);

        context.Meals.Remove(meal);
        context.SaveChanges();
        return 1;
    }
   

    public List<SleepTracking> GetSleepHistory(int userId)
    {
        List<SleepTracking> result = new List<SleepTracking>();
        try
        {
            result = context.SleepTrackings
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.SleepDate)
                .ToList();
        }
        catch (Exception)
        {
            result = new List<SleepTracking>();
        }
        return result;
    }

    public List<SleepTracking> GetSleepByWeek(int userId)
    {
        List<SleepTracking> result = new List<SleepTracking>();
        try
        {
            var sevenDaysAgo = DateOnly.FromDateTime(DateTime.Today.AddDays(-6));
            result = context.SleepTrackings
                .Where(s => s.UserId == userId && s.SleepDate >= sevenDaysAgo)
                .OrderBy(s => s.SleepDate)
                .ToList();
        }
        catch (Exception)
        {
            result = new List<SleepTracking>();
        }
        return result;
    }

    public int UpdateSleep(int sleepId, double sleepHours)
    {
        int result = 0;
        try
        {
            var existing = context.SleepTrackings.Find(sleepId);
            if (existing == null) return -1;
            existing.SleepHours = sleepHours;
            context.SaveChanges();
            result = 1;
        }
        catch (Exception) { result = -99; }
        return result;
    }

    public int DeleteSleep(int sleepId)
    {
        int result = 0;
        try
        {
            var sleep = context.SleepTrackings.Find(sleepId);
            if (sleep == null) return -1;
            context.SleepTrackings.Remove(sleep);
            context.SaveChanges();
            result = 1;
        }
        catch (Exception) { result = -99; }
        return result;
    }



}
