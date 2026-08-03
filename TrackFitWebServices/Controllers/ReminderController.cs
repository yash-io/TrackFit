using Microsoft.AspNetCore.Mvc;
using TrackFitDataAccessLayer.Models;

namespace TrackFitWebServices.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ReminderController : Controller
    {
        TrackFitRepostiory repository;

        public ReminderController(TrackFitRepostiory repository)
        {
            this.repository = repository;
        }

        [HttpGet]
        public JsonResult GetRemindersByUser(int userId)
        {
            var result = repository.GetRemindersByUser(userId);
            return Json(result);
        }

        [HttpPost]
        public JsonResult AddReminder([FromBody] Reminder reminder)
        {
            int result = repository.AddReminder(reminder);
            return Json(result);
        }

        [HttpPost]
        public JsonResult UpdateReminder([FromBody] Reminder reminder)
        {
            int result = repository.UpdateReminder(reminder);
            return Json(result);
        }

        [HttpPost]
        public JsonResult DeleteReminder(int reminderId)
        {
            int result = repository.DeleteReminder(reminderId);
            return Json(result);
        }

        [HttpPost]
        public JsonResult MarkReminderComplete(int reminderId)
        {
            int result = repository.MarkReminderComplete(reminderId);
            return Json(result);
        }
    }
}