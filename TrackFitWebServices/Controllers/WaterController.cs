using Microsoft.AspNetCore.Mvc;
using TrackFitDataAccessLayer;
using TrackFitDataAccessLayer.Models;
namespace TrackFitWebServices.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]

    public class WaterController:Controller
    {
        WaterRepository repository;

        public WaterController(WaterRepository repository)
        {
            this.repository = repository;
        }

      
        [HttpGet]
        public JsonResult GetWaterByUser(int userId)
        {
            var result = repository.GetWaterByUser(userId);
            return Json(result);
        }

        
        [HttpGet]
        public JsonResult GetTodayWater(int userId)
        {
            var result = repository.GetTodayWaterByUser(userId);
            return Json(result);
        }

       
        [HttpGet]
        public JsonResult GetRecommendedIntake(int userId)
        {
            var profile = repository.GetUserProfile(userId);
            if (profile == null)
                return Json(new { recommended = 2000 });

           
            double recommended = (profile.Weight ?? 60) * 35;

            
            switch (profile.Goal)
            {
                case "Weight Loss":
                    recommended += 500; break;
                case "Muscle Building":
                case "Weight Gain":
                    recommended += 300; break;
                case "Stamina Improvement":
                    recommended += 400; break;
                default:
                    break;
            }

            return Json(new { recommended = (int)recommended });
        }

        [HttpPost]
        public JsonResult AddWater([FromBody] WaterIntake water)
        {
            int result = repository.AddWater(water);
            return Json(result);
        }

       
        [HttpPost]
        public JsonResult UpdateWater([FromBody] WaterIntake water)
        {
            int result = repository.UpdateWater(water);
            return Json(result);
        }
  
      
        [HttpPost]
        public JsonResult DeleteWater(int waterId)
        {
            int result = repository.DeleteWater(waterId);
            return Json(result);
        }
    }


}
