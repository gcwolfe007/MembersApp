using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace CatsFuncs
{
    public class CatsContextFactory : IDesignTimeDbContextFactory<CatsDbContext>
    {
        public CatsDbContext CreateDbContext(string[] args)
        {
            var dbServer = args[0];
            var database = args[1];
            var connectionString = $"{dbServer};Initial Catalog={database};Persist Security Info=False;User ID=gcwolfe007;Password=Winst0n1;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";

            var optionsBuilder = new DbContextOptionsBuilder<CatsDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            return new CatsDbContext(optionsBuilder.Options);
        }
    }
}