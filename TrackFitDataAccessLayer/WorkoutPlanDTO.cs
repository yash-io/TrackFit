using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrackFitDataAccessLayer
{
    public class WorkoutPlanDay
    {
        public string Day { get; set; }
        public string DayName { get; set; }
        public string Focus { get; set; } 
        public bool IsRestDay { get; set; }
        public List<PlanExercise> Exercises { get; set; }
    }

    public class PlanExercise
    {
        public string Name { get; set; }
        public int Sets { get; set; }
        public string Reps { get; set; }
        public string RestTime { get; set; }

       
        public string BestTime { get; set; } 
        public string Difficulty { get; set; } 
        public string WhyThisEx { get; set; } 
    }
}