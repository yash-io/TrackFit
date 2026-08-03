using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace TrackFitDataAccessLayer.Models;

public partial class TrackFitDbContext : DbContext
{
    public TrackFitDbContext()
    {
    }

    public TrackFitDbContext(DbContextOptions<TrackFitDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Achievement> Achievements { get; set; }

    public virtual DbSet<Bmihistory> Bmihistories { get; set; }

    public virtual DbSet<BodyMeasurement> BodyMeasurements { get; set; }

    public virtual DbSet<ChatHistory> ChatHistories { get; set; }

    public virtual DbSet<Feedback> Feedbacks { get; set; }

    public virtual DbSet<FoodMaster> FoodMasters { get; set; }

    public virtual DbSet<Goal> Goals { get; set; }

    public virtual DbSet<Leaderboard> Leaderboards { get; set; }

    public virtual DbSet<Meal> Meals { get; set; }

    public virtual DbSet<MealItem> MealItems { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<PredefinedAchievement> PredefinedAchievements { get; set; }

    public virtual DbSet<Reminder> Reminders { get; set; }

    public virtual DbSet<SleepTracking> SleepTrackings { get; set; }

    //public virtual DbSet<Step> Steps { get; set; }

    public virtual DbSet<Streak> Streaks { get; set; }

    public virtual DbSet<SupportRequest> SupportRequests { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserProfile> UserProfiles { get; set; }

    public virtual DbSet<WaterIntake> WaterIntakes { get; set; }

    public virtual DbSet<Workout> Workouts { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source =(localdb)\\MSSQLLocalDB;Initial Catalog=TrackFitDB;Integrated Security=true");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Achievement>(entity =>
        {
            entity.HasKey(e => e.AchievementId).HasName("PK__Achievem__276330C0F1365AFE");

            entity.Property(e => e.AchievedDate).HasColumnType("datetime");

            entity.HasOne(d => d.PidNavigation).WithMany(p => p.Achievements)
                .HasForeignKey(d => d.Pid)
                .HasConstraintName("FK__Achievement__PId__5812160E");

            entity.HasOne(d => d.User).WithMany(p => p.Achievements)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Achieveme__UserI__571DF1D5");
        });

        modelBuilder.Entity<Bmihistory>(entity =>
        {
            entity.HasKey(e => e.Bmiid).HasName("PK__BMIHisto__823F0A10E09A3F6B");

            entity.ToTable("BMIHistory");

            entity.Property(e => e.Bmiid).HasColumnName("BMIId");
            entity.Property(e => e.Bmivalue).HasColumnName("BMIValue");
            entity.Property(e => e.Category)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.RecordedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.User).WithMany(p => p.Bmihistories)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__BMIHistor__UserI__2D27B809");
        });

        modelBuilder.Entity<BodyMeasurement>(entity =>
        {
            entity.HasKey(e => e.Bmid).HasName("PK__BodyMeas__3834AD6747024198");

            entity.Property(e => e.Bmid).HasColumnName("BMId");
            entity.Property(e => e.RecordedDate).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.User).WithMany(p => p.BodyMeasurements)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__BodyMeasu__UserI__6D0D32F4");
        });

        modelBuilder.Entity<ChatHistory>(entity =>
        {
            entity.HasKey(e => e.ChatId).HasName("PK__ChatHist__A9FBE7C6DE2668B5");

            entity.ToTable("ChatHistory");

            entity.Property(e => e.BotResponse)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UserMessage)
                .HasMaxLength(500)
                .IsUnicode(false);

            entity.HasOne(d => d.User).WithMany(p => p.ChatHistories)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__ChatHisto__UserI__693CA210");
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__6A4BEDD6C5BCFF53");

            entity.ToTable("Feedback");

            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Message)
                .HasMaxLength(500)
                .IsUnicode(false);

            entity.HasOne(d => d.User).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Feedback__UserId__5EBF139D");
        });

        modelBuilder.Entity<FoodMaster>(entity =>
        {
            entity.HasKey(e => e.FoodId).HasName("PK__FoodMast__856DB3EB8A10F950");

            entity.ToTable("FoodMaster");

            entity.Property(e => e.FoodName)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Goal>(entity =>
        {
            entity.HasKey(e => e.GoalId).HasName("PK__Goals__8A4FFFD135023A69");

            entity.Property(e => e.GoalType)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false);

            entity.HasOne(d => d.User).WithMany(p => p.Goals)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Goals__UserId__30F848ED");
        });

        modelBuilder.Entity<Leaderboard>(entity =>
        {
            entity.HasKey(e => e.LeaderboardId).HasName("PK__Leaderbo__B358A0062C4355F3");

            entity.ToTable("Leaderboard");

            entity.HasOne(d => d.User).WithMany(p => p.Leaderboards)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Leaderboa__UserI__5AEE82B9");
        });

        modelBuilder.Entity<Meal>(entity =>
        {
            entity.HasKey(e => e.MealId).HasName("PK__Meals__ACF6A63D367B921F");

            entity.Property(e => e.MealTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.MealType)
                .HasMaxLength(20)
                .IsUnicode(false);

            entity.HasOne(d => d.User).WithMany(p => p.Meals)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Meals__UserId__35BCFE0A");
        });

        modelBuilder.Entity<MealItem>(entity =>
        {
            entity.HasKey(e => e.ItemId).HasName("PK__MealItem__727E838B4EECBD7A");

            entity.Property(e => e.FoodName)
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.HasOne(d => d.Meal).WithMany(p => p.MealItems)
                .HasForeignKey(d => d.MealId)
                .HasConstraintName("FK__MealItems__MealI__398D8EEE");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__20CF2E125483A4D5");

            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsRead).HasDefaultValue(false);
            entity.Property(e => e.Message)
                .HasMaxLength(200)
                .IsUnicode(false);

            entity.HasOne(d => d.User).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Notificat__UserI__4AB81AF0");
        });

        modelBuilder.Entity<PredefinedAchievement>(entity =>
        {
            entity.HasKey(e => e.Pid).HasName("PK__Predefin__C5775540104E2150");

            entity.Property(e => e.Pid).HasColumnName("PId");
            entity.Property(e => e.Description)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Title)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Reminder>(entity =>
        {
            entity.HasKey(e => e.ReminderId).HasName("PK__Reminder__01A830876A2FA586");

            entity.Property(e => e.ReminderText)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.ReminderTime).HasColumnType("datetime");

            entity.HasOne(d => d.User).WithMany(p => p.Reminders)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Reminders__UserI__47DBAE45");
        });

        modelBuilder.Entity<SleepTracking>(entity =>
        {
            entity.HasKey(e => e.SleepId).HasName("PK__SleepTra__54B08AE9340189B2");

            entity.ToTable("SleepTracking");

            entity.Property(e => e.SleepDate).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.User).WithMany(p => p.SleepTrackings)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__SleepTrac__UserI__656C112C");
        });

        //modelBuilder.Entity<Step>(entity =>
        //{
        //    entity.HasKey(e => e.StepId).HasName("PK__Steps__243433578ED178C5");

        //    entity.Property(e => e.StepDate).HasDefaultValueSql("(getdate())");

        //    entity.HasOne(d => d.User).WithMany(p => p.Steps)
        //        .HasForeignKey(d => d.UserId)
        //        .HasConstraintName("FK__Steps__UserId__403A8C7D");
        //}
        //);

        modelBuilder.Entity<Streak>(entity =>
        {
            entity.HasKey(e => e.StreakId).HasName("PK__Streaks__005C67C942C176CD");

            entity.Property(e => e.CurrentStreak).HasDefaultValue(0);
            entity.Property(e => e.LongestStreak).HasDefaultValue(0);
            entity.Property(e => e.TotalNumberOfDaysActive).HasDefaultValue(0);

            entity.HasOne(d => d.User).WithMany(p => p.Streaks)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Streaks__UserId__4F7CD00D");
        });

        modelBuilder.Entity<SupportRequest>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PK__SupportR__33A8517A4717519E");

            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Message)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4C4333E3C1");

            entity.HasIndex(e => e.EmailId, "UQ__Users__7ED91ACE9E452A09").IsUnique();

            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.EmailId)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.IsAdmin).HasDefaultValue(false);
            entity.Property(e => e.PasswordHash)
                .IsRequired()
                .HasMaxLength(256);
            entity.Property(e => e.Theme)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("Light");
            entity.Property(e => e.UserName)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.HasKey(e => e.ProfileId).HasName("PK__UserProf__290C88E41E76D5FB");

            entity.ToTable("UserProfile");

            entity.Property(e => e.Goal)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ProfileImage)
                .HasMaxLength(200)
                .IsUnicode(false);

            entity.HasOne(d => d.User).WithMany(p => p.UserProfiles)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__UserProfi__UserI__2A4B4B5E");
        });

        modelBuilder.Entity<WaterIntake>(entity =>
        {
            entity.HasKey(e => e.WaterId).HasName("PK__WaterInt__C4F18E8F8810635A");

            entity.ToTable("WaterIntake");

            entity.Property(e => e.IntakeTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.QuantityMl).HasColumnName("QuantityML");

            entity.HasOne(d => d.User).WithMany(p => p.WaterIntakes)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__WaterInta__UserI__3C69FB99");
        });

        modelBuilder.Entity<Workout>(entity =>
        {
            entity.HasKey(e => e.WorkoutId).HasName("PK__Workouts__E1C42A011EB92CD1");

            entity.Property(e => e.ExerciseName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.WorkoutDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.User).WithMany(p => p.Workouts)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Workouts__UserId__440B1D61");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
