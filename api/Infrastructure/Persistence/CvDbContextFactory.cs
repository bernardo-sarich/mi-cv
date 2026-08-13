using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Infrastructure.Persistence;

public class CvDbContextFactory : IDesignTimeDbContextFactory<CvDbContext>
{
    public CvDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<CvDbContext>();
        optionsBuilder.UseSqlServer("Server=localhost;Database=CvDatabase;Trusted_Connection=True;TrustServerCertificate=True;");

        return new CvDbContext(optionsBuilder.Options);
    }
}
