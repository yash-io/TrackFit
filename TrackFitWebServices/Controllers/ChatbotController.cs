using Microsoft.AspNetCore.Mvc;
using TrackFitWebServices.DTOs;
using TrackFitWebServices.Services;

namespace TrackFitWebServices.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ChatbotController : Controller
    {
        private readonly AiService _aiService;

        public ChatbotController(AiService aiService)
        {
            _aiService = aiService;
        }

        // POST: api/Chatbot/Send
        [HttpPost]
        public async Task<JsonResult> Send([FromBody] ChatRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
                return Json(new { success = false, response = "Message cannot be empty." });

            var reply = await _aiService.GetFitnessReply(request.Message, request.History ?? new());

            if (reply == null)
                return Json(new { success = false, response = "Sorry, I could not process your request. Please try again." });

            return Json(new { success = true, response = reply });
        }
    }
}