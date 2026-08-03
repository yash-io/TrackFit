using Microsoft.AspNetCore.Mvc;
using TrackFitDataAccessLayer.Models;


namespace TrackFitWebServices.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class GoalController : Controller
    {
        TrackFitRepostiory repository;

        public GoalController(TrackFitRepostiory repository)
        {
            this.repository = repository;
        }

        [HttpGet]
        public JsonResult GetGoalsByUser(int userId)
        {
            var result = repository.GetGoalsByUser(userId);
            return Json(result);
        }

        [HttpPost]
        public JsonResult AddGoal([FromBody] Goal goal)
        {
            bool result = repository.AddGoal(goal);
            return Json(result);
        }

        [HttpPost]
        public JsonResult UpdateGoal([FromBody] Goal goal)
        {
            int result = repository.UpdateGoal(goal);
            return Json(result);
        }

        [HttpPost]
        public JsonResult DeleteGoal(int goalId)
        {
            int result = repository.DeleteGoal(goalId);
            return Json(result);
        }

        [HttpPost]
        public JsonResult MarkGoalComplete(int goalId)
        {
            int result = repository.MarkGoalComplete(goalId);
            return Json(result);
        }
    }

    
}
