using Microsoft.AspNetCore.Mvc;

namespace TrackFitWebServices.Controllers
{
    [Route("api/delete-account")]
    [ApiController]
    public class DeleteAccountController : ControllerBase
    {
        private TrackFitRepostiory service;

        public DeleteAccountController(TrackFitRepostiory service)
        {
            this.service = service;
        }

        [HttpDelete("{userId}")]
        public IActionResult DeleteAccount(int userId)
        {
             // temporary (later from login/session)

            bool result = service.DeleteUser(userId);

            if (!result)
                return NotFound("User not found");

            return Ok("Account deleted successfully");
        }
    }
}

