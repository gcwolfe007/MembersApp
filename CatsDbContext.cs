using System;
using System.Collections.Generic;
using System.Text;
using CatsFuncs.models;
using Microsoft.EntityFrameworkCore;

namespace CatsFuncs
{
   public class CatsDbContext : DbContext
    {

        public CatsDbContext(DbContextOptions<CatsDbContext> options)
            : base(options)
        { }
        public DbSet<Cat> Cats { get; set; }
    }
}
