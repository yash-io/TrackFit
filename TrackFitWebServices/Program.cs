using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TrackFitDataAccessLayer;
using TrackFitDataAccessLayer.Models;
using TrackFitWebServices.Services;

namespace TrackFitWebServices
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Configuration
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

            builder.Services.AddDbContext<TrackFitDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddScoped<TrackFitRepostiory>();

            builder.Services.AddControllers()
    .AddJsonOptions(options => {
        options.JsonSerializerOptions.PropertyNamingPolicy
            = System.Text.Json.JsonNamingPolicy.CamelCase;
    });
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddAuthentication("Bearer")


            .AddJwtBearer("Bearer", options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    RoleClaimType = "role",
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes("THIS_IS_MY_SECRET_KEY_12345"))};
            });

            // var conn = builder.Configuration.GetConnectionString("DefaultConnection");
            // Console.WriteLine("CONNECTION STRING = " + conn);

            builder.Services.AddTransient<TrackFitDbContext>();
            builder.Services.AddTransient<DashBoardRepo>();
            builder.Services.AddHttpClient();
            builder.Services.AddTransient<FeedbackRepo>();
            builder.Services.AddTransient<TrackFitRepostiory>();
            builder.Services.AddTransient<WaterRepository>();
            builder.Services.AddSingleton<AiService>();



            var app = builder.Build();

            app.UseCors(options =>
                options.WithOrigins("*")
                       .AllowAnyHeader()
                       .AllowAnyMethod());

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseAuthentication();

            app.UseAuthorization();

            app.UseHttpsRedirection();
            
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}