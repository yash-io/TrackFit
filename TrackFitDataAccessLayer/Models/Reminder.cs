using System;
using System.Collections.Generic;


namespace TrackFitDataAccessLayer.Models
{
    public partial class Reminder
    {
        public int ReminderId { get; set; }
        public int? UserId { get; set; }
        public string Title { get; set; }
        public string ReminderText { get; set; }
        public DateTime? ReminderTime { get; set; }
        public string ReminderType { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsCompleted { get; set; }
        public virtual User User { get; set; }
    }
}