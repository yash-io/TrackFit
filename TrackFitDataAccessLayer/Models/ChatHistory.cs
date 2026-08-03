using System;
using System.Collections.Generic;

namespace TrackFitDataAccessLayer.Models;

public partial class ChatHistory
{
    public int ChatId { get; set; }

    public int? UserId { get; set; }

    public string UserMessage { get; set; }

    public string BotResponse { get; set; }

    public DateTime? CreatedDate { get; set; }

    public virtual User User { get; set; }
}
