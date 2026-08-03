using Microsoft.AspNetCore.Mvc;
using TrackFitDataAccessLayer;
using TrackFitDataAccessLayer.Models;

[ApiController]
[Route("api/notifications")]
public class NotificationController : ControllerBase
{
    private readonly TrackFitRepostiory repository;

    public NotificationController(TrackFitRepostiory repo)
    {
        repository = repo;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> Get(int userId)
    {
        return Ok(await repository.GetNotificationsAsync(userId));
    }

    [HttpPost]
    public async Task<IActionResult> Add(Notification n)
    {
        return Ok(await repository.AddNotificationAsync(n));
    }

    [HttpPut("read/{id}")]
    public async Task<IActionResult> Read(int id)
    {
        return Ok(await repository.MarkAsReadAsync(id));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        return Ok(await repository.DeleteNotificationAsync(id));
    }
}