using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrackFitDataAccessLayer
{
    public class WeeklyActivityDTO
    {
        public DateOnly Date { get; set; }
        public int ActiveUsers { get; set; }
    }
}
