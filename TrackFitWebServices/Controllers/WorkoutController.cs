using Microsoft.AspNetCore.Mvc;
using TrackFitDataAccessLayer.Models;

namespace TrackFitWebServices.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class WorkoutController : Controller
    {
        TrackFitRepostiory repository;

        public WorkoutController(TrackFitRepostiory repository)
        {
            this.repository = repository;
        }

        [HttpGet]
        public JsonResult GetWorkoutsByUser(int userId)
        {
            var result = repository.GetWorkoutsByUser(userId);
            return Json(result);
        }

        [HttpGet]
        public JsonResult GetWorkoutsByGoalType(int userId, string goalType)
        {
            var result = repository.GetWorkoutsByGoalType(userId, goalType);
            return Json(result);
        }

        [HttpPost]
        public JsonResult AddWorkout([FromBody] Workout workout)
        {
            int result = repository.AddWorkout(workout);
            return Json(result);
        }

        [HttpPost]
        public JsonResult UpdateWorkout([FromBody] Workout workout)
        {
            int result = repository.UpdateWorkout(workout);
            return Json(result);
        }

        [HttpPost]
        public JsonResult DeleteWorkout(int workoutId)
        {
            int result = repository.DeleteWorkout(workoutId);
            return Json(result);
        }

        [HttpGet]
        public JsonResult GenerateWorkoutPlan(string goalType)
        {
            var result = repository.GenerateWorkoutPlan(goalType);
            return Json(result);
        }
    }

   
}
