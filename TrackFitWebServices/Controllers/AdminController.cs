using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace TrackFitWebServices.Controllers
{
    [ApiController]

    [Route("api/[controller]/[action]")]

    public class AdminController : ControllerBase
    {
        private readonly TrackFitRepostiory _repo;
        public AdminController(TrackFitRepostiory repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()

        {

            var users = await _repo.GetAllUsers();

            var count = await _repo.GetUserCount();

            return Ok(new{

                totalUsers = count,

                users = users

            });

        }

        [HttpGet]
        public JsonResult GetAllFeedbacks()
        {
            try
            {
                var data = _repo.GetAllFeedbacks();
                if (data == null || data.Count == 0)
                {
                    return new JsonResult(new
                    {
                        status = "fail",
                        message = "No feedback data found",
                        count = 0,
                        data = new List<object>()
                    });
                }
                return new JsonResult(new
                {
                    status = "success",
                    message = "Feedback data fetched successfully",
                    count = data.Count,
                    data = data
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    status = "error",
                    message = "Something went wrong while fetching feedback",
                    error = ex.Message,
                    count = 0,
                    data = new List<object>()
                });
            }
        }

        [HttpGet]

        public JsonResult GetWeeklyActivity()
        {
            try
            {
                var data = _repo.GetWeeklyActivity();
                if (data == null || data.Count == 0)
                {
                    return new JsonResult(new
                    {
                        status = "fail",
                        message = "No weekly activity data found",
                        data = new List<object>()
                    });
                }
                return new JsonResult(new
                {
                    status = "success",
                    message = "Weekly activity fetched successfully",
                    data = data
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    status = "error",
                    message = "Error fetching weekly activity",
                    error = ex.Message,
                    data = new List<object>()
                });
            }
        }

        [HttpGet]
        public JsonResult GetActiveUsers()
        {
            try
            {
                var users = _repo.GetActiveUsersToday();
                return new JsonResult(new
                {
                    success = true,
                    count = users.Count,
                    users = users
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    message = "Something went wrong",
                    error = ex.Message
                })
                {
                    StatusCode = 500
                };
            }
        }
    }
}
