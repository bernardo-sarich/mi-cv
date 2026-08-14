using Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Infrastructure.Persistence;

public class CvDbContext(DbContextOptions<CvDbContext> options) : DbContext(options)
{
    public DbSet<ProfileEntity> Profiles => Set<ProfileEntity>();
    public DbSet<ExperienceEntity> Experiences => Set<ExperienceEntity>();
    public DbSet<ProjectEntity> Projects => Set<ProjectEntity>();
    public DbSet<SkillCategoryEntity> SkillCategories => Set<SkillCategoryEntity>();
    public DbSet<StatEntity> Stats => Set<StatEntity>();
    public DbSet<ContactMessageEntity> ContactMessages => Set<ContactMessageEntity>();
    public DbSet<ContactAttemptEntity> ContactAttempts => Set<ContactAttemptEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var stringListComparer = new ValueComparer<List<string>>(
            (a, b) => (a ?? new List<string>()).SequenceEqual(b ?? new List<string>()),
            list => list.Aggregate(0, (hash, item) => HashCode.Combine(hash, item.GetHashCode())),
            list => list.ToList());

        modelBuilder.Entity<ProfileEntity>(builder =>
        {
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Language).HasConversion<string>().IsRequired();
            builder.Property(p => p.Name).IsRequired();
            builder.Property(p => p.Title).IsRequired();
            builder.Property(p => p.Bio).IsRequired();
            builder.HasMany(p => p.Stats)
                .WithOne()
                .HasForeignKey(s => s.ProfileId)
                .IsRequired();
        });

        modelBuilder.Entity<ExperienceEntity>(builder =>
        {
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Language).HasConversion<string>().IsRequired();
            builder.Property(e => e.Company).IsRequired();
            builder.Property(e => e.Role).IsRequired();
            builder.Property(e => e.Dates).IsRequired();
            builder.Property(e => e.Bullets)
                .HasConversion(
                    bullets => System.Text.Json.JsonSerializer.Serialize(bullets, (System.Text.Json.JsonSerializerOptions?)null),
                    json => System.Text.Json.JsonSerializer.Deserialize<List<string>>(json, (System.Text.Json.JsonSerializerOptions?)null)!)
                .Metadata.SetValueComparer(stringListComparer);
        });

        modelBuilder.Entity<ProjectEntity>(builder =>
        {
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Language).HasConversion<string>().IsRequired();
            builder.Property(p => p.Name).IsRequired();
            builder.Property(p => p.Description).IsRequired();
            builder.Property(p => p.Link).IsRequired();
            builder.Property(p => p.Stack)
                .HasConversion(
                    stack => System.Text.Json.JsonSerializer.Serialize(stack, (System.Text.Json.JsonSerializerOptions?)null),
                    json => System.Text.Json.JsonSerializer.Deserialize<List<string>>(json, (System.Text.Json.JsonSerializerOptions?)null)!)
                .Metadata.SetValueComparer(stringListComparer);
        });

        modelBuilder.Entity<SkillCategoryEntity>(builder =>
        {
            builder.HasKey(s => s.Id);
            builder.Property(s => s.Language).HasConversion<string>().IsRequired();
            builder.Property(s => s.Name).IsRequired();
            builder.Property(s => s.Items)
                .HasConversion(
                    items => System.Text.Json.JsonSerializer.Serialize(items, (System.Text.Json.JsonSerializerOptions?)null),
                    json => System.Text.Json.JsonSerializer.Deserialize<List<string>>(json, (System.Text.Json.JsonSerializerOptions?)null)!)
                .Metadata.SetValueComparer(stringListComparer);
        });

        modelBuilder.Entity<StatEntity>(builder =>
        {
            builder.HasKey(s => s.Id);
            builder.Property(s => s.Suffix).IsRequired();
            builder.Property(s => s.Label).IsRequired();
        });

        modelBuilder.Entity<ContactMessageEntity>(builder =>
        {
            builder.HasKey(c => c.Id);
            builder.Property(c => c.Name).IsRequired();
            builder.Property(c => c.Email).IsRequired();
            builder.Property(c => c.Message).IsRequired();
        });

        modelBuilder.Entity<ContactAttemptEntity>(builder =>
        {
            builder.HasKey(c => c.Id);
            builder.Property(c => c.IpAddress).IsRequired();
            builder.HasIndex(c => new { c.IpAddress, c.AttemptedAt });
        });
    }
}
