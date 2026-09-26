using System.Security.Claims;
using ClinIQ.Infrastructure.Services;
using Microsoft.AspNetCore.Http;

namespace ClinIQ.Infrastructure.Tests.Services;

/// <summary>Audit rows take the actor's name from here; it must read the claim AuthService actually issues.</summary>
public class CurrentUserServiceTests
{
    private static CurrentUserService With(params Claim[] claims)
    {
        var accessor = new Mock<IHttpContextAccessor>();
        accessor.Setup(a => a.HttpContext).Returns(new DefaultHttpContext
        {
            User = new ClaimsPrincipal(new ClaimsIdentity(claims, "test")),
        });
        return new CurrentUserService(accessor.Object);
    }

    [Fact]
    public void FullName_ReadsTheFullNameClaimIssuedAtLogin() =>
        With(new Claim("full_name", "Talha Yahya")).FullName.Should().Be("Talha Yahya");

    [Fact]
    public void FullName_FallsBackToGivenAndSurname() =>
        With(new Claim(ClaimTypes.GivenName, "Sara"), new Claim(ClaimTypes.Surname, "Khan")).FullName.Should().Be("Sara Khan");

    [Fact]
    public void FullName_IsNullWithoutAnyNameClaim() =>
        With(new Claim(ClaimTypes.Email, "a@b.test")).FullName.Should().BeNull();
}
