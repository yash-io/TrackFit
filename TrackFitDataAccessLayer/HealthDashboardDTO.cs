using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrackFitDataAccessLayer
{
    public class HealthDashboardDTO
    {
        public double AvgCaloriesPerWorkout { get; set; }
        public string BestWorkout { get; set; }

        public double AvgWaterPerDrink { get; set; }
        public int WaterEntries { get; set; }

        public double AvgSleep { get; set; }
        public string SleepConsistency { get; set; }

        public double LatestBMI { get; set; }
        public double BmiChange { get; set; }
    }
}
