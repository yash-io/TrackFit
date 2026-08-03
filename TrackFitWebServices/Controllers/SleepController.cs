using Microsoft.AspNetCore.Mvc;

namespace TrackFitWebServices.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SleepController : Controller
    {
        TrackFitRepostiory repository;

        public SleepController(TrackFitRepostiory repository)
        {
            this.repository = repository;
        }

        // POST: api/Sleep/AddSleep
        [HttpPost]
        public JsonResult AddSleep(int userId, double sleepHours, DateOnly sleepDate)
        {
            if (sleepHours <= 0 || sleepHours > 24)
                return Json(new { success = false, message = "Sleep hours must be between 0 and 24." });

            bool result = repository.AddSleep(userId, sleepHours, sleepDate);
            return Json(new { success = result, message = result ? "Sleep logged successfully." : "Failed to log sleep." });
        }

        // GET: api/Sleep/GetSleepHistory?userId=5
        [HttpGet]
        public JsonResult GetSleepHistory(int userId)
        {
            var result = repository.GetSleepHistory(userId);
            return Json(result);
        }

        // GET: api/Sleep/GetSleepByWeek?userId=5
        [HttpGet]
        public JsonResult GetSleepByWeek(int userId)
        {
            var result = repository.GetSleepByWeek(userId);
            return Json(result);
        }

        // POST: api/Sleep/UpdateSleep
        [HttpPost]
        public JsonResult UpdateSleep(int sleepId, double sleepHours)
        {
            if (sleepHours <= 0 || sleepHours > 24)
                return Json(new { success = false, message = "Sleep hours must be between 0 and 24." });

            int result = repository.UpdateSleep(sleepId, sleepHours);
            if (result == -1)
                return Json(new { success = false, message = "Sleep record not found." });

            return Json(new { success = result == 1, message = result == 1 ? "Updated successfully." : "Update failed." });
        }

        // POST: api/Sleep/DeleteSleep
        [HttpPost]
        public JsonResult DeleteSleep(int sleepId)
        {
            int result = repository.DeleteSleep(sleepId);
            if (result == -1)
                return Json(new { success = false, message = "Sleep record not found." });

            return Json(new { success = result == 1, message = result == 1 ? "Deleted successfully." : "Delete failed." });
        }
    }
}