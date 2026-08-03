using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using System;
using TrackFitDataAccessLayer;

namespace TrackFitWebServices.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : Controller
    {
        TrackFitRepostiory repository;

        public DashboardController(TrackFitRepostiory repository)
        {
            this.repository = repository;
        }

        [HttpGet]

        public JsonResult GetHealthDashboard(int UserId)
        {
            var result = new Object();

            try
            {
                result = repository.GetHealthDashboard(UserId);
            }
            catch (Exception ex)
            {
                result = "no data found";
            }
            return Json(result);
        }
        [HttpGet("/completeHealthDashboard")]

        public JsonResult GetCompleteHealthDashboard(int UserId)
        {
            var result = new HealthDashboardDTO();

            try
            {
                result = repository.GetCompleteHealthDashboard(UserId);
            }
            catch (Exception ex)
            {
                result = null;
            }
            return Json(result);
        }

        [HttpGet("/getStreak")]

        public JsonResult GetStreak(int userId)
        {
            var result = new Object();

            try
            {
                result = repository.GetStreakDetails(userId);
            }
            catch (Exception)
            {
                result = null;
            }

            return Json(result);
        }
        [HttpGet("/getAchievements")]
        public JsonResult GetAchievements(int userId)
        {
            object res = null;
            try
            {
                res = repository.GetAchievements(userId);
            }
            catch (Exception)
            {
                res = null;
            }
            return Json(res);
        }

        [HttpGet("/getRecords")]
        public JsonResult GetRecords(int userId)
        {
            object result = null;
            try
            {
                result = repository.GetRecords(userId);
            }
            catch (Exception)
            {
                result = null;
            }
            return Json(result);
        }
    }
}
