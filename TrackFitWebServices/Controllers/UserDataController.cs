using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using TrackFitDataAccessLayer.Models;
using TrackFitWebServices.Models;

namespace TrackFitWebServices.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserDataController : Controller
    {
        private TrackFitRepostiory repository;
        private HttpClient http;
        public UserDataController(TrackFitRepostiory repository,HttpClient http)
        {
            this.repository = repository;
            this.http = http;
        }
        [HttpPost("SubmitFeedback")]
        public int SubmitFeedback(FeedbackDTO feedback)
        {
            int feedbackId = 0;
            try
            {
                feedbackId = repository.SubmitFeedbackForm(feedback.UserId,feedback.Rating, feedback.Message, feedback.CreatedDate);
            }
            catch (Exception ex)
            {
                feedbackId = -99;
            }

            return feedbackId;
        }

        [HttpPut("UpdateFeedback")]
        public int UpdateFeedback(UpdateFeedBackDTO feedback)
        {
            int status = 0;

            try
            {
                status = repository.UpdateFeedback(feedback.feedbackId, feedback.Rating, feedback.Message, feedback.CreatedDate);
            }
            catch (Exception ex)
            {
                status = -99;
            }

            return status;

        }

        [HttpGet("triggerStreak")]
        public JsonResult TriggerStreak(int userId)
        {
            int status = 0;
            try
            {
                status = repository.TriggerStreak(userId);
            }
            catch(Exception ex)
            {
                return Json(StatusCode(500,new { ex.Message}));
            }
            return Json(status);
        }

        [HttpGet("getTip")]
        public async Task<IActionResult> GetTip()
        {
            var response = await http.GetAsync("https://www.affirmations.dev");
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode);
            }
            var quote = await response.Content.ReadAsStringAsync();

            return Content(quote,"applicaton/json");
        }


        [HttpPost("SleepTracking")]
        public bool AddSleepDuration(int UserId, double SleepHours, DateOnly SleepDate)
        {
            bool status = false;

            try
            {
                status = repository.AddSleep(UserId, SleepHours, SleepDate);
            }
            catch (Exception 
            
             
            
            
            
            
            
            
            
              ex)
            {
                status = false;
            }

            return status;
        }
    }
}
