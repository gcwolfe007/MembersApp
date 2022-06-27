using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using CatsFuncs.models;
using CatsFuncs.Repositorys;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;

namespace CatsFuncs
{
    public class CatsApi
    {
        private readonly AzureADJwtBearerValidation _azureADJwtBearerValidation;
        private StringValues _authToken;
        private readonly CatsContextFactory _catsFactory;
        private readonly string _claimType;
        private readonly IConfiguration _configuration;
        private readonly string[] _dataArgs = new string[4];
        private readonly DatabasesRepository _databases;
        private readonly ILogger _log;
        private readonly string _partition;
        private ClaimsPrincipal _principal;

        public CatsApi(IConfiguration configuration,
            CatsContextFactory catsFactory,
            ILoggerFactory loggerFactory,
            AzureADJwtBearerValidation azureADJwtBearerValidation,
            DatabasesRepository databases
        )
        {
            _configuration = configuration;
            _catsFactory = catsFactory;
            _log = loggerFactory.CreateLogger<CatsApi>();
            _azureADJwtBearerValidation = azureADJwtBearerValidation;
            _databases = databases;
            _dataArgs[0] = _configuration["SqlServer"];
            _claimType = _configuration["oidClaim"];
            _partition = _configuration["Partition"];
        }

        [FunctionName("GetCats")]
        public async Task<IActionResult> GetCats(
            [HttpTrigger(AuthorizationLevel.User, "get", Route = "Cats")]
            HttpRequest req, ILogger log)
        {
            try
            {
                _authToken = GetTokenFromRequest(req);
                if ((_principal = await _azureADJwtBearerValidation.ValidateTokenAsync(_authToken)) == null)
                {
                    return LogAccessDenied();
                }
                _log.LogInformation("Get  cats request Authorized");
                return new OkObjectResult(await GetCatsDbContext().Cats.ToListAsync());
            }
            catch (Exception ex)
            {
                _log.LogError(ex.Message);
                return new BadRequestErrorMessageResult($"{ex.Message}");
            }
        }

        [FunctionName("CreateCat")]
        public async Task<IActionResult> CreateCat(
            [HttpTrigger(AuthorizationLevel.User,"post", Route = "Cats/Create")]
            HttpRequest req, ILogger log)
        {
            try
            {
                _authToken = GetTokenFromRequest(req);
                if ((_principal = await _azureADJwtBearerValidation.ValidateTokenAsync(_authToken)) == null)
                {
                    return LogAccessDenied();
                }

                var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                var input = JsonConvert.DeserializeObject<CatDto>(requestBody);
                var cat = new Cat { CatName = input.CatName, CoatColor = input.CoatColor };

                var dbContext = GetCatsDbContext();
                await dbContext.Cats.AddAsync(cat);
                await dbContext.SaveChangesAsync();

                var result = new CreatedAtActionResult(                
                    nameof(GetCatById),                    
        nameof(CatsApi),                    
                    "Cats/{id}",
                    cat);
                return result;
            }
            catch (Exception ex)
            {
                _log.LogError(ex.Message);
                return new BadRequestErrorMessageResult($"{ex.Message}");
            }
        }

        [FunctionName("UpdateCat")]
        public async Task<IActionResult> UpdateCatById(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "Cats/{id}")]
            HttpRequest req, ILogger log,
            string id)
        {
            try
            {
                _authToken = GetTokenFromRequest(req);
                if ((_principal = await _azureADJwtBearerValidation.ValidateTokenAsync(_authToken)) == null)
                {
                    return LogAccessDenied();
                }

                var dbContext = GetCatsDbContext();
                var cat = await dbContext.Cats.FindAsync(int.Parse(id));
                if (cat == null) return new NotFoundResult();

                var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                var input = JsonConvert.DeserializeObject<CatDto>(requestBody);
                cat.CatName = input.CatName;
                cat.CoatColor = input.CoatColor;

                await dbContext.SaveChangesAsync();
                return new OkObjectResult(cat);
            }
            catch (Exception ex)
            {
                _log.LogError(ex.Message);
                return new BadRequestErrorMessageResult($"{ex.Message}");
            }
        }

        [FunctionName("GetCatById")]
        public async Task<IActionResult> GetCatById(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "Cats/{id}")]
            HttpRequest req, ILogger log,
            string id)
        {
            try
            {
                _authToken = GetTokenFromRequest(req);
                if ((_principal = await _azureADJwtBearerValidation.ValidateTokenAsync(_authToken)) == null)
                {
                    return LogAccessDenied();
                }

                var dbContext = GetCatsDbContext();
                var cat = await dbContext.Cats.FindAsync(int.Parse(id));
                if (cat == null) return new NotFoundResult();

                return new OkObjectResult(cat);
            }
            catch (Exception ex)
            {
                _log.LogError(ex.Message);
                return new BadRequestErrorMessageResult($"{ex.Message}");
            }
        }

        [FunctionName("DeleteCat")]
        public async Task<IActionResult> DeleteCat(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "Cats/{id}")]
            HttpRequest req, ILogger log,
            string id)
        {
            try
            {
                _authToken = GetTokenFromRequest(req);
                if ((_principal = await _azureADJwtBearerValidation.ValidateTokenAsync(_authToken)) == null)
                {
                    return LogAccessDenied();
                }

                var dbContext = GetCatsDbContext();
                var cat = await dbContext.Cats.FindAsync(int.Parse(id));
                if (cat == null) return new NotFoundResult();
                dbContext.Cats.Remove(cat);
                await dbContext.SaveChangesAsync();
                return new NoContentResult();
            }
            catch (Exception ex)
            {
                _log.LogError(ex.Message);
                return new BadRequestErrorMessageResult($"{ex.Message}");
            }

        }

        private StringValues GetTokenFromRequest(HttpRequest request)
        {
            return request.Headers
                .Where(k => k.Key == "Authorization")
                .Select(k => k.Value).FirstOrDefault();
        }

        private CatsDbContext GetCatsDbContext()
        {
            _dataArgs[1] = _databases
                .Get(_partition, _principal.Claims
                    .FirstOrDefault(c => c.Type == _claimType)?.Value).Catalog;
            return _catsFactory.CreateDbContext(_dataArgs);
        }

        private UnauthorizedResult LogAccessDenied()
        {
            var result = new UnauthorizedResult();
            _log.LogInformation("Status " + result.StatusCode.ToString() + " Unauthorized Request, access Denied");
            return result;
        }
    }
}