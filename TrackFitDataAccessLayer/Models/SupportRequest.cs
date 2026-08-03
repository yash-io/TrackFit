using System;
using System.Collections.Generic;

namespace TrackFitDataAccessLayer.Models;

public partial class SupportRequest
{
    public int RequestId { get; set; }

    public string Name { get; set; }

    public string Email { get; set; }

    public string Message { get; set; }

    public DateTime? CreatedDate { get; set; }
}
