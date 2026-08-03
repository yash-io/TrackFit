using System;
using System.Collections.Generic;

namespace TrackFitDataAccessLayer.Models;

public partial class Feedback
{
    public int FeedbackId { get; set; }

    public int Rating { get; set; }

    public int? UserId { get; set; }

    public string Message { get; set; }

    public DateTime? CreatedDate { get; set; }

    public virtual User User { get; set; }
}
