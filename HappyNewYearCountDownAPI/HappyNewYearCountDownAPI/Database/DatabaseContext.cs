using HappyNewYearCountDownAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace HappyNewYearCountDownAPI.Database {
    public class DatabaseContext : DbContext {
        protected readonly IConfiguration _configuration;
        public DatabaseContext(IConfiguration configuration) {
            _configuration = configuration;
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
            var host = Environment.GetEnvironmentVariable("DB_HOST") ?? "localhost";
            var port = Environment.GetEnvironmentVariable("DB_PORT") ?? "5432";
            var user = Environment.GetEnvironmentVariable("DB_USER") ?? "root";
            var pass = Environment.GetEnvironmentVariable("DB_PASS") ?? "";
            var name = Environment.GetEnvironmentVariable("DB_NAME") ?? "HappyNewYearCountDown";
            var URI = $"Host={host}; Database={name}; User ID={user}; Password={pass}; Port={port};";
            optionsBuilder.UseNpgsql(URI);
        }
        public DbSet<Chat> Chat { get; set; }
    }
}
