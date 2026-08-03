using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using TrackFitDataAccessLayer;
using TrackFitDataAccessLayer.Models;
using TrackFitWebServices.Models;

namespace TrackFitWebServices.Controllers
{

    [Route("api/[controller]")]

    [ApiController]

    public class FoodController : ControllerBase

    {

        private readonly TrackFitRepostiory _repo;

        public FoodController(TrackFitRepostiory repository)

        {

            _repo = repository;

        }

        [HttpPost("calculate")]

        public async Task<IActionResult> CalculateCalories([FromBody] FoodRequestDTO request)
        {
            if (string.IsNullOrWhiteSpace(request.Items))
            {
                return BadRequest("Enter food items");
            }

            var foodItems = request.Items.Split(",");

            List<FoodCaloriesDTO> results = new();

            foreach (var item in foodItems)
            {
                string foodName = item.Trim();

                if (string.IsNullOrWhiteSpace(foodName))
                    continue;

                // Step 1 → check DB
                var food = await _repo.GetFoodByName(foodName);

                if (food == null)
                {
                    food = await FetchFromAPI(foodName);
                    if (food != null)
                    {
                        await _repo.SaveFood(food);
                    }

                }

                if (food != null)
                {
                    results.Add(new FoodCaloriesDTO
                    {
                        FoodName = food.FoodName,
                        Grams = 100,
                        Calories = food.Calories ?? 0
                    });
                }
            }
            if (results.Count == 0)
            {
                return Ok(new
                {
                    success = false,
                    message="Food not found"
                });

            }
            return Ok(new TotalCaloriesDTO
            {
                Foods = results,
                TotalCalories = results.Sum(x => x.Calories)
            });

        }

        private async Task<FoodMaster?> FetchFromAPI(string foodName)

        {

            using var client = new HttpClient();

            var url =

                $"https://world.openfoodfacts.org/cgi/search.pl?search_terms={foodName}&search_simple=1&json=1";

            var response = await client.GetAsync(url);

            if (!response.IsSuccessStatusCode)

                return null;

            var json = await response.Content.ReadAsStringAsync();

            var document = JsonDocument.Parse(json);

            var products = document.RootElement.GetProperty("products");

            if (products.GetArrayLength() == 0)

                return null;

            var firstProduct = products[0];

            if (!firstProduct.TryGetProperty("nutriments", out var nutriments))

                return null;

            int calories =

                nutriments.TryGetProperty("energy-kcal_100g", out var c)

                ? (int)c.GetDouble()

                : 0;

            return new FoodMaster

            {

                FoodName = foodName,

                Calories = calories

            };

        }

    }

}

