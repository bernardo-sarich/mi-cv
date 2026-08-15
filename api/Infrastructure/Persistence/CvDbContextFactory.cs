using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Infrastructure.Persistence;

public class CvDbContextFactory : IDesignTimeDbContextFactory<CvDbContext>
{
    public CvDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<CvDbContext>();
        optionsBuilder.UseNpgsql("Host=localhost;Database=cvdatabase;Username=postgres;Password=postgres");

        return new CvDbContext(optionsBuilder.Options);
    }
}
