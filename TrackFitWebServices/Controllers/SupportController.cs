using Microsoft.AspNetCore.Mvc;
using TrackFitDataAccessLayer;
using TrackFitDataAccessLayer.Models;

[ApiController]
[Route("api/support")]
public class SupportController : ControllerBase
{
    private readonly TrackFitRepostiory repository;

    public SupportController(TrackFitRepostiory repo)
    {
        repository = repo;
    }

    [HttpPost]
    public async Task<IActionResult> Add(SupportRequest request)
    {
        var result = await repository.AddSupportRequestAsync(request);
        return Ok(result);
    }
}