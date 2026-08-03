
-- DATABASE


IF DB_ID('TrackFitDB') IS NOT NULL

DROP DATABASE TrackFitDB

GO

CREATE DATABASE TrackFitDB

GO

USE TrackFitDB

GO

-- USERS

CREATE TABLE Users

(

    UserId INT PRIMARY KEY IDENTITY,
    IsAdmin BIT DEFAULT 0,

    UserName VARCHAR(50) NOT NULL,

    EmailId VARCHAR(50) UNIQUE NOT NULL,

    PasswordHash VARBINARY(256) NOT NULL,

    Theme VARCHAR(20) DEFAULT 'Light',

    CreatedDate DATETIME DEFAULT GETDATE(),

)

GO


-- USER PROFILE

CREATE TABLE UserProfile

(

    ProfileId INT PRIMARY KEY IDENTITY,

    UserId INT FOREIGN KEY REFERENCES Users(UserId) ON DELETE CASCADE,

    Age INT,

    Height FLOAT,

    Weight FLOAT,

    Goal VARCHAR(50),

    ProfileImage VARCHAR(200)

)


GO


-- BMI HISTORY

CREATE TABLE BMIHistory

(

    BMIId INT PRIMARY KEY IDENTITY,

    UserId INT FOREIGN KEY REFERENCES Users(UserId) ON DELETE CASCADE,

    BMIValue FLOAT,

    Category VARCHAR(20),

    RecordedDate DATETIME DEFAULT GETDATE()

)

GO


-- GOALS


CREATE TABLE Goals

(

    GoalId INT PRIMARY KEY IDENTITY,

    UserId INT FOREIGN KEY REFERENCES Users(UserId) ON DELETE CASCADE,

    GoalType VARCHAR(50),

    TargetValue FLOAT,

    Deadline DATE,

    Status VARCHAR(20)

)

GO


-- FOOD MASTER


CREATE TABLE FoodMaster

(

    FoodId INT PRIMARY KEY IDENTITY,

    FoodName VARCHAR(100),

    Calories INT,

    Protein FLOAT,

    Carbs FLOAT,

    Fats FLOAT

)

GO


-- MEALS


CREATE TABLE Meals

(

    MealId INT PRIMARY KEY IDENTITY,

    UserId INT FOREIGN KEY REFERENCES Users(UserId) ON DELETE CASCADE,

    MealType VARCHAR(20),

    MealTime DATETIME DEFAULT GETDATE()

)

GO


-- MEAL ITEMS


CREATE TABLE MealItems

(

    ItemId INT PRIMARY KEY IDENTITY,

    MealId INT FOREIGN KEY REFERENCES Meals(MealId),

    FoodName VARCHAR(100),

    Calories INT,

    Quantity FLOAT

)

GO


-- WATER INTAKE


CREATE TABLE WaterIntake

(

    WaterId INT PRIMARY KEY IDENTITY,

    UserId INT FOREIGN KEY REFERENCES Users(UserId) ON DELETE CASCADE,

    QuantityML INT,

    IntakeTime DATETIME DEFAULT GETDATE()

)

GO

-- WORKOUTS


CREATE TABLE Workouts

(

    WorkoutId INT PRIMARY KEY IDENTITY,

    UserId INT FOREIGN KEY REFERENCES Users(UserId) ON DELETE CASCADE,

    ExerciseName VARCHAR(100),

    Duration INT,

    CaloriesBurned INT,

    WorkoutDate DATETIME DEFAULT GETDATE()

)

GO


-- REMINDERS

CREATE TABLE Reminders

(

    ReminderId INT PRIMARY KEY IDENTITY,

    UserId INT FOREIGN KEY REFERENCES Users(UserId) ON DELETE CASCADE,

    ReminderText VARCHAR(200),

    ReminderTime DATETIME,

    IsActive BIT,
    -- Add missing columns
  Title VARCHAR(100),
 Description VARCHAR(300),
 ReminderType VARCHAR(50),
 IsCompleted BIT DEFAULT 0


)

GO





-- NOTIFICATIONS

CREATE TABLE Notifications

(

    NotificationId INT PRIMARY KEY IDENTITY,

    UserId INT FOREIGN KEY REFERENCES Users(UserId) ON DELETE CASCADE,

    Message VARCHAR(200),

    IsRead BIT DEFAULT 0,

    CreatedDate DATETIME DEFAULT GETDATE()

)

GO


-- STREAKS


CREATE TABLE Streaks

(

    StreakId INT PRIMARY KEY IDENTITY,

    UserId INT FOREIGN KEY REFERENCES Users(UserId) ON DELETE CASCADE,
    
    TotalNumberOfDaysActive Int Default 0,

    CurrentStreak INT DEFAULT 0,

    LongestStreak INT DEFAULT 0,

    LastActiveDate DATE

)

GO


-- ACHIEVEMENTS

CREATE TABLE PredefinedAchievements

(

    PId INT PRIMARY KEY IDENTITY,

    Title VARCHAR(100) unique not null,

    Description VARCHAR(200)

)

GO

CREATE TABLE Achievements

(

    AchievementId INT PRIMARY KEY IDENTITY,

    UserId INT FOREIGN KEY REFERENCES Users(UserId) ON DELETE CASCADE,

    PId INT FOREIGN KEY REFERENCES PredefinedAchievements(PId),

    AchievedDate DATETIME

)

GO

-- LEADERBOARD
CREATE TABLE Leaderboard
(
    LeaderboardId INT PRIMARY KEY IDENTITY,
    UserId INT FOREIGN KEY REFERENCES Users(UserId) ON DELETE CASCADE,
    Score INT
)

GO


-- FEEDBACK

CREATE TABLE Feedback

(

    FeedbackId INT PRIMARY KEY IDENTITY,
    Rating INT not null check(Rating between 1 and 5),

    UserId INT FOREIGN KEY REFERENCES Users(UserId) ON DELETE CASCADE,

    Message VARCHAR(500),

    CreatedDate DATETIME DEFAULT GETDATE()

)

GO


-- SUPPORT REQUESTS


CREATE TABLE SupportRequests

(

    RequestId INT PRIMARY KEY IDENTITY,

    Name VARCHAR(100),

    Email VARCHAR(100),

    Message VARCHAR(500),

    CreatedDate DATETIME DEFAULT GETDATE()

)

GO


-- SLEEP TRACKING

CREATE TABLE SleepTracking

(

    SleepId INT PRIMARY KEY IDENTITY,

    UserId INT FOREIGN KEY REFERENCES Users(UserId) ON DELETE CASCADE,

    SleepHours FLOAT,

    SleepDate DATE DEFAULT GETDATE()

)

GO


-- CHAT HISTORY (AI FEATURE)


CREATE TABLE ChatHistory

(

    ChatId INT PRIMARY KEY IDENTITY,

    UserId INT FOREIGN KEY REFERENCES Users(UserId) ON DELETE CASCADE,

    UserMessage VARCHAR(500),

    BotResponse VARCHAR(500),

    CreatedDate DATETIME DEFAULT GETDATE()

)

GO

-- Body Measurements for Visualisation

Create Table BodyMeasurements (
    BMId Int Primary Key Identity,
    UserId Int Foreign Key References Users(UserId) ON DELETE CASCADE,
    Waist Float,
    Chest Float,
    Hips Float,
    RecordedDate Date Default GETDATE()
);

GO

INSERT INTO Users (UserName, EmailId, PasswordHash, IsAdmin) 
VALUES ('Admin','admin@gmail.com', HASHBYTES('SHA2_256', 'admin123@'),1)

select HASHBYTES('SHA2_256', 'Admin123@')

GO

--Stored procedure for register
DROP PROCEDURE IF EXISTS usp_RegisterUser  
GO
CREATE PROCEDURE usp_RegisterUser
(
    @UserName VARCHAR(50),
    @EmailId VARCHAR(50),
    @Password NVARCHAR(100)
)
AS
BEGIN
    DECLARE @retval INT
    DECLARE @PasswordHash VARBINARY(256)
    BEGIN TRY
        IF (@UserName IS NULL OR LEN(@UserName) < 3)
            SET @retval = -1
        ELSE IF (@EmailId IS NULL OR @EmailId NOT LIKE '%_@__%.__%')
            SET @retval = -2
        ELSE IF (@Password IS NULL OR LEN(@Password) < 6)
            SET @retval = -3
        ELSE IF EXISTS (SELECT 1 FROM Users WHERE EmailId = @EmailId)
            SET @retval = -4
        ELSE

        BEGIN
            SET @PasswordHash = HASHBYTES('SHA2_256', @Password)
            INSERT INTO Users
            ( UserName, EmailId, PasswordHash, Theme, CreatedDate, IsAdmin
            )
            VALUES
            ( @UserName, @EmailId,@PasswordHash,'Light', GETDATE(), 0
            )
            SET @retval = SCOPE_IDENTITY()
       END
    END TRY
    BEGIN CATCH
       SET @retval = -99
    END CATCH
    RETURN @retval
END
GO


--STORED PROCEDURE FOR USERPROFILE

DROP PROCEDURE IF EXISTS usp_AddUserProfile  
go


CREATE PROCEDURE usp_AddUserProfile
(
    @UserId INT,
    @Age INT = NULL,
    @Height FLOAT = NULL,
    @Weight FLOAT = NULL,
    @Goal VARCHAR(50) = NULL,
    @ProfileImage VARCHAR(200) = NULL
)
AS
BEGIN
    DECLARE @retVal INT
    BEGIN TRY
        -- Check user exists
        IF NOT EXISTS (
            SELECT 1 
            FROM Users
            WHERE UserId = @UserId
        )
        BEGIN
            SET @retVal = -1
        END
        -- Age validation
        ELSE IF (@Age IS NOT NULL AND (@Age < 18 OR @Age > 100))
        BEGIN
            SET @retVal = -2
        END
        -- Height validation
        ELSE IF (@Height IS NOT NULL AND @Height <= 55)
        BEGIN
            SET @retVal = -3
        END
        -- Weight validation
        ELSE IF (@Weight IS NOT NULL AND @Weight <= 5)
        BEGIN
            SET @retVal = -4
        END
        -- If profile already exists → UPDATE
        ELSE IF EXISTS (
            SELECT 1 
            FROM UserProfile 
            WHERE UserId = @UserId
        )
        BEGIN
            UPDATE UserProfile
            SET
                Age = ISNULL(@Age, Age),
                Height = ISNULL(@Height, Height),
                Weight = ISNULL(@Weight, Weight),
                Goal = ISNULL(@Goal, Goal),
                ProfileImage = ISNULL(@ProfileImage, ProfileImage)
            WHERE UserId = @UserId
            SET @retVal = 2
        END
        ELSE

        BEGIN

            INSERT INTO UserProfile
            (
                UserId,
                Age,
                Height,
                Weight,
                Goal,
                ProfileImage
            )
            VALUES
            (
                @UserId,
                @Age,
                @Height,
                @Weight,
                @Goal,
                @ProfileImage
            )
            SET @retVal = 1
        END
    END TRY
    BEGIN CATCH
        SET @retVal = -99
    END CATCH
    RETURN @retVal
END

GO
GO

CREATE PROCEDURE usp_LoginUser
    @EmailId NVARCHAR(100),
    @Password NVARCHAR(100),
    @UserId INT OUTPUT,
    @IsAdmin BIT OUTPUT

AS

BEGIN

    SET NOCOUNT ON;
    SET @UserId = NULL
    SET @IsAdmin = 0
    IF NOT EXISTS (SELECT 1 FROM Users WHERE EmailId = @EmailId)
        RETURN -1   
    SELECT 
        @UserId = UserId,
        @IsAdmin = IsAdmin
    FROM Users

    WHERE EmailId = @EmailId AND PasswordHash = HASHBYTES('SHA2_256', @Password)

    IF (@UserId IS NULL)
        RETURN -2  
    RETURN 1

END

GO
DROP PROCEDURE IF EXISTS sp_ChangePassword  
GO

CREATE PROCEDURE sp_ChangePassword
(
    @UserId INT,
    @CurrentPassword NVARCHAR(100),
    @NewPassword NVARCHAR(100)
)
AS
BEGIN

    SET NOCOUNT ON;
   IF NOT EXISTS (
        SELECT 1 
        FROM Users 
        WHERE UserId = @UserId
    )

    BEGIN
        RETURN -2
    END

    IF(@CurrentPassword IS NULL OR @CurrentPassword = '')
    BEGIN
        RETURN -3
    END
    IF(@NewPassword IS NULL OR @NewPassword = '')
    BEGIN
        RETURN -4
    END
    IF(@CurrentPassword = @NewPassword)

    BEGIN
        RETURN -5   
    END
    IF NOT EXISTS(
        SELECT 1
        FROM Users
        WHERE UserId = @UserId
        AND PasswordHash = HASHBYTES('SHA2_256', @CurrentPassword)
    )
    BEGIN
        RETURN -1
    END

    -- Update password

    UPDATE Users
    SET PasswordHash = HASHBYTES('SHA2_256', @NewPassword)
    WHERE UserId = @UserId
    RETURN 1

END
GO

INSERT INTO FoodMaster (FoodName, Calories, Protein, Carbs, Fats) VALUES

('Rice',130,2.7,28,0.3),
('Fried Rice',163,3.5,31,3.2),
('Biryani',290,9,35,12),
('Idli',58,2,12,0.4),
('Dosa',168,4,30,4),
('Upma',120,3,20,4),
('Poha',130,2.5,23,3),
('Pongal',150,4,25,5),
('Vada',250,6,30,12),
('Chapati',120,3,18,3),
('Paratha',260,5,35,10),
('Poori',296,6,40,14),
('Dal',116,9,20,1),
('Paneer Curry',265,11,8,20),
('Chicken Curry',240,20,6,15),
('Sambar',80,3,12,2),
('Apple',52,0.3,14,0.2),
('Banana',89,1.1,23,0.3),
('Orange',47,0.9,12,0.1),
('Mango',60,0.8,15,0.4),
('Grapes',69,0.7,18,0.2),
('Watermelon',30,0.6,8,0.2),
('Papaya',43,0.5,11,0.3),
('Guava',68,2.6,14,1),
('Pineapple',50,0.5,13,0.1),
('Potato',77,2,17,0.1),
('Tomato',18,0.9,4,0.2),
('Carrot',41,0.9,10,0.2),
('Cucumber',16,0.7,4,0.1),
('Broccoli',34,2.8,7,0.4),
('Egg',155,13,1.1,11),
('Boiled Egg',155,13,1.1,11),
('Chicken Breast',165,31,0,3.6),
('Fish',206,22,0,12),
('Paneer',265,18,6,20),
('Pizza',266,11,33,10),
('Burger',295,17,30,14),
('French Fries',312,3.4,41,15),
('Pasta',131,5,25,1.1),
('Noodles',138,4.5,25,2),
('Maggi',450,8,60,18),
('Kurkure',550,6,56,35),
('Popcorn',387,13,78,4),
('Chips',536,7,53,35),
('Biscuits',502,6,65,24),
('Coke',42,0,11,0),
('Pepsi',41,0,11,0),
('Coffee',2,0.3,0,0),
('Tea',1,0,0.2,0),
('Milk',42,3.4,5,1),
('Ice Cream',207,3.5,24,11),
('Chocolate',546,4.9,61,31),
('Cake',257,4,38,10);

INSERT INTO WaterIntake (UserId, QuantityML, IntakeTime) VALUES
(2, 250, GETDATE()),
(2, 300, GETDATE()),
(2, 200, GETDATE()),
(2, 350, GETDATE()),
(2, 250, GETDATE())
GO




INSERT INTO Streaks (UserId, TotalNumberOfDaysActive, CurrentStreak, LongestStreak, LastActiveDate)
VALUES
(4, 30, 10, 15, '2026-04-29'),
(2, 25, 12, 12, '2026-04-28'),
(3, 40, 8, 20, '2026-04-30'),
(5, 10, 5, 8, '2026-04-27');



INSERT INTO PredefinedAchievements (Title, Description) VALUES

('7_days', 'Active for 7 consecutive days'),

('15_days', 'Active for 15 consecutive days'),

('30_days', 'Active for 30 consecutive days'),

('50_days', 'Active for 50 consecutive days'),

('70_days', 'Active for 70 consecutive days'),

('1000_k', 'Burned 1000 calories total'),

('2000_k', 'Burned 2000 calories total'),

('3000_k', 'Burned 3000 calories total'),

('5000_k', 'Burned 5000 calories total'),

('10_l', 'Drank 10 liters of water'),

('25_l', 'Drank 25 liters of water'),

('50_l', 'Drank 50 liters of water'),

('75_l', 'Drank 75 liters of water');




DECLARE @i INT = 0;

DECLARE @mealId INT;

WHILE @i < 30

BEGIN

    /* BMI */

    INSERT INTO BMIHistory (UserId, BMIValue, Category, RecordedDate)

    VALUES 

    (

        @UserId,

        ROUND(22 + (RAND()*2),2),

        'Normal',

        DATEADD(DAY, -@i, GETDATE())

    );

    /* WATER */

    INSERT INTO WaterIntake (UserId, QuantityML, IntakeTime)

    VALUES

    (@UserId, 250, DATEADD(DAY, -@i, GETDATE())),

    (@UserId, 300, DATEADD(DAY, -@i, GETDATE())),

    (@UserId, 400, DATEADD(DAY, -@i, GETDATE())),

    (@UserId, 500, DATEADD(DAY, -@i, GETDATE()));

    /* WORKOUT */

    INSERT INTO Workouts (UserId, ExerciseName, Duration, CaloriesBurned, WorkoutDate)

    VALUES

    (@UserId, 'Running', 30 + (@i % 20), 200 + (@i * 5), DATEADD(DAY, -@i, GETDATE())),

    (@UserId, 'Cycling', 20 + (@i % 15), 150 + (@i * 4), DATEADD(DAY, -@i, GETDATE()));

    /* SLEEP */

    INSERT INTO SleepTracking (UserId, SleepHours, SleepDate)

    VALUES

    (

        @UserId,

        ROUND(6 + (RAND()*3),1),

        DATEADD(DAY, -@i, GETDATE())

    );

    /* MEALS */

    INSERT INTO Meals (UserId, MealType, MealTime)

    VALUES (@UserId, 'Lunch', DATEADD(DAY, -@i, GETDATE()));

    SET @mealId = SCOPE_IDENTITY();

    INSERT INTO MealItems (MealId, FoodName, Calories, Quantity)

    VALUES

    (@mealId, 'Rice', 130, 1),

    (@mealId, 'Dal', 116, 1),

    (@mealId, 'Chicken Curry', 240, 1);

    /* BODY MEASUREMENTS */

    IF (@i % 7 = 0)

    BEGIN

        INSERT INTO BodyMeasurements (UserId, Waist, Chest, Hips, RecordedDate)

        VALUES

        (

            @UserId,

            32 - (@i * 0.05),

            38 + (@i * 0.03),

            36 - (@i * 0.04),

            DATEADD(DAY, -@i, GETDATE())

        );

    END

    /* NOTIFICATIONS */

    INSERT INTO Notifications (UserId, Message, CreatedDate)

    VALUES

    (

        @UserId,

        'Daily fitness reminder',

        DATEADD(DAY, -@i, GETDATE())

    );

    /* CHAT */

    INSERT INTO ChatHistory (UserId, UserMessage, BotResponse, CreatedDate)

    VALUES

    (

        @UserId,

        'How many calories should I eat?',

        'It depends on your goal and BMI.',

        DATEADD(DAY, -@i, GETDATE())

    );

    SET @i = @i + 1;

END;



IF EXISTS (SELECT 1 FROM Streaks WHERE UserId = @UserId)

BEGIN

    UPDATE Streaks

    SET 

        TotalNumberOfDaysActive = 30,

        CurrentStreak = 30,

        LongestStreak = 30,

        LastActiveDate = GETDATE()

    WHERE UserId = @UserId;

END

ELSE

BEGIN

    INSERT INTO Streaks (UserId, TotalNumberOfDaysActive, CurrentStreak, LongestStreak, LastActiveDate)

    VALUES (@UserId, 30, 30, 30, GETDATE());

END;


INSERT INTO Achievements (UserId, PId, AchievedDate)

SELECT 

    @UserId,

    PId,

    GETDATE()

FROM PredefinedAchievements

WHERE Title IN ('7_days', '30_days', '1000_k', '3000_k', '10_l', '50_l');