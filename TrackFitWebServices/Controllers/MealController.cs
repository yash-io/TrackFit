using Microsoft.AspNetCore.Mvc;
using TrackFitDataAccessLayer;
using TrackFitDataAccessLayer.Models;
using System.Linq;

namespace TrackFitWebServices.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MealController : Controller
    {
        TrackFitRepostiory repository;

        public MealController(TrackFitRepostiory repository)
        {
            this.repository = repository;
        }

        // ── ADD MEAL ─────────────────────────────────────────────
        // POST /api/Meal/AddMeal
        [HttpPost]
        [Route("AddMeal")]
        public IActionResult AddMeal(AddMealRequestDTO request)
        {
            if (request == null || request.MealItems.Count == 0)
                return BadRequest("No food to save");

            var items = request.MealItems.Select(x => new MealItem
            {
                FoodName = x.FoodName,
                Calories = x.Calories,
                Quantity = x.Quantity
            }).ToList();

            repository.AddMeal(request.UserId, request.MealType, request.MealTime, items);

            return Ok(new { message = "Meal added successfully" });
        }

        // ── GET CALORIES BY MEAL TYPE ─────────────────────────────
        // GET /api/Meal/GetTodayCaloriesByMealType?userId=3
        [HttpGet]
        [Route("GetTodayCaloriesByMealType")]
        public IActionResult GetTodayCaloriesByMealType(int userId)
        {
            var data = repository.GetTodayCaloriesByMealType(userId);
            return Ok(data);
        }

        // ── GET MEALS ─────────────────────────────────────────────
        // GET /api/Meal/GetMeals/3
        [HttpGet("GetMeals/{userId}")]
        public IActionResult GetMeals(int userId)
        {
            var meals = repository.GetMeals(userId);
            return Ok(meals);
        }

        // ── UPDATE MEAL ───────────────────────────────────────────
        // PUT /api/Meal/UpdateMeal
        [HttpPut]
        [Route("UpdateMeal")]
        public IActionResult UpdateMeal([FromBody] UpdateMealRequestDTO request)
        {
            if (request == null)
                return BadRequest("Invalid request");

            int result = repository.UpdateMeal(request);

            if (result == 0)
                return NotFound("Meal not found");

            return Ok(new { message = "Meal updated successfully" });
        }

        // ── DELETE MEAL ───────────────────────────────────────────
        // DELETE /api/Meal/DeleteMeal/5
        [HttpDelete("DeleteMeal/{mealId}")]
        public IActionResult DeleteMeal(int mealId)
        {
            int result = repository.DeleteMeal(mealId);

            if (result == 0)
                return NotFound("Meal not found");

            return Ok(new { message = "Meal deleted successfully" });
        }
    }
}