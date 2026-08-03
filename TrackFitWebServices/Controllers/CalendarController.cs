// TrackFitWebServices/Controllers/CalendarController.cs
using Microsoft.AspNetCore.Mvc;

namespace TrackFitWebServices.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CalendarController : Controller
    {
        TrackFitRepostiory repository;

        public CalendarController(
            TrackFitRepostiory repository)
        {
            this.repository = repository;
        }

        [HttpGet]
        public JsonResult GetCalendarData(
            int userId, int month, int year)
        {
            var result = repository.GetCalendarData(
                userId, month, year
            );
            return Json(result);
        }
    }
}