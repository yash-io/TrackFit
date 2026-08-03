using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime.InteropServices;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using TrackFitDataAccessLayer.Models;
using TrackFitWebServices.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace TrackFitWebServices.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]

    public class UserController : Controller
    {
        TrackFitRepostiory repository;

        public UserController(TrackFitRepostiory repository)
        {
            this.repository = repository;
        }

        [HttpPost]
        public JsonResult RegisterUserDetails(UserDTO user)
        {
            int result = 0;
            try
            {
                result = this.repository.RegisterUser(user.UserName, user.EmailId, user.Password);
            }
            catch (Exception)
            {
                result = -99;
            }
            return Json(result);
        }

        [HttpPost]

        public JsonResult LoginUserDetails(string emailId, string password)
        {
            try
            {
                int userId;
                bool isAdmin;
                int result = repository.LoginUser(emailId, password, out userId, out isAdmin);
                if (result == -1)
                {
                    return Json(new
                    {
                        status = 0,
                        message = "Email not found"
                    });
                }
                if (result == -2)

                {
                    return Json(new
                    {
                        status = 0,
                        message = "Wrong password"
                    });

                }
                if (result == 1)
                {
                    var claims = new[]
                    {
                        new Claim("userId", userId.ToString()),
                        new Claim("email", emailId),
                        new Claim("role", isAdmin ? "Admin" : "User")
                    };

                    var key = new SymmetricSecurityKey(

                        Encoding.UTF8.GetBytes("THIS_IS_MY_SECRET_KEY_1234567890")

                    );
                    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                    var token = new JwtSecurityToken(
                        claims: claims,
                        expires: DateTime.Now.AddHours(1),
                        signingCredentials: creds
                    );

                    var jwt = new JwtSecurityTokenHandler().WriteToken(token);

                    return Json(new

                    {
                        status = 1,
                        message = "Login successful",
                        token = jwt,
                        userId = userId,
                        isAdmin = isAdmin
                    });

                }

                return Json(new
                {
                    status = -1,
                    message = "Something went wrong"
                });
            }

            catch (Exception)
            {
                return Json(new
                {
                    status = -99,
                    message = "Server error"
                });
            }
        }

        [HttpPost]
        public JsonResult AddProfileDetails(AddProfileDTO profile)
        {
            int result = 0;
            try
            {
                result = repository.AddUserProfile(profile.UserId, profile.Age, profile.Height,
                                profile.Weight, profile.Goal, profile.ProfileImage);
            }
            catch
            {
                result = -99;
            }
            return Json(result);
        }

        [HttpGet]

        public JsonResult GetUserProfile(int userId)
        {
            object data = null;
            try
            {
                data = this.repository.GetUserProfile(userId);

            }
            catch (Exception)
            {
                data = null;
            }
            return Json(data);
        }

        [HttpPut]

        public JsonResult UpdateUserName(int userId, string userName)
        {
            int result = 0;
            try
            {
                result = repository.UpdateUserName(userId, userName);
            }
            catch (Exception)
            {
                result = -99;
            }
            return Json(result);
        }

        [HttpPut]
        public JsonResult ChangePassword(ChangePasswordDTO model)
        {
            int result = 0;
            try
            {
                result = repository.ChangePassword(
                    model.UserId,
                    model.CurrentPassword,
                    model.NewPassword
                );
            }

            catch
            {
                result = -99;
            }
            return Json(result);

        }

        [HttpGet]
        public async Task<IActionResult> GetLeaderboard()
        {
            try

            {
                var updated = await repository.UpdateLeaderboard();

                if (!updated)
                {

                    return StatusCode(500, new
                    {
                        status = "error",
                        message = "Failed to update leaderboard"

                    });

                }
                var data = await repository.GetLeaderboard();
                return Ok(new
                {

                    status = "success",
                    message = "Leaderboard fetched successfully",
                    data = data
                });
            }

            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = "error",
                    message = ex.Message
                });

            }

        }

    }
}


