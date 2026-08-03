using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrackFitDataAccessLayer.Models;

namespace TrackFitDataAccessLayer
{
    public class WaterRepository
    {
        private TrackFitDbContext context;
        public WaterRepository(TrackFitDbContext context)
        {
            this.context = context;
        }
        public List<WaterIntake> GetWaterByUser(int userId)
        {
            return context.WaterIntakes
                .Where(w => w.UserId == userId)
                .OrderByDescending(w => w.IntakeTime)
                .ToList();
        }

        public List<WaterIntake> GetTodayWaterByUser(int userId)
        {
            var today = DateTime.Today;
            return context.WaterIntakes
                .Where(w => w.UserId == userId &&
                       w.IntakeTime.HasValue &&
                       w.IntakeTime.Value.Date == today)
                .OrderByDescending(w => w.IntakeTime)
                .ToList();
        }

        public int AddWater(WaterIntake water)
        {
            int result = 0;
            try
            {
                water.IntakeTime = DateTime.Now;
                context.WaterIntakes.Add(water);
                context.SaveChanges();
                result = 1;
            }
            catch (Exception) { result = -99; }
            return result;
        }

        public int UpdateWater(WaterIntake water)
        {
            int result = 0;
            try
            {
                var existing = context.WaterIntakes.Find(water.WaterId);
                if (existing == null) return -1;
                existing.QuantityMl = water.QuantityMl;
                context.SaveChanges();
                result = 1;
            }
            catch (Exception) { result = -99; }
            return result;
        }

        public int DeleteWater(int waterId)
        {
            int result = 0;
            try
            {
                var water = context.WaterIntakes.Find(waterId);
                if (water == null) return -1;
                context.WaterIntakes.Remove(water);
                context.SaveChanges();
                result = 1;
            }
            catch (Exception) { result = -99; }
            return result;
        }

        public UserProfile GetUserProfile(int userId)
        {
            return context.UserProfiles
                .FirstOrDefault(p => p.UserId == userId);
        }


    }
}
