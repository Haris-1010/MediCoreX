using ClinIQ.API.Controllers;
using ClinIQ.Application.Interfaces;
using ClinIQ.Application.DTOs.Auth;
using Microsoft.AspNetCore.Mvc;

namespace ClinIQ.API.Tests.Controllers;

public class AuthControllerTests
{
    private readonly Mock<IAuthService> _authServiceMock;
    private readonly AuthController _controller;
    private readonly Fixture _fixture;

    public AuthControllerTests()
    {
        _authServiceMock = new Mock<IAuthService>();
        _controller = new AuthController(_authServiceMock.Object);
        _fixture = new Fixture();
    }

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsOkWithToken()
    {
        // Arrange
        var loginDto = new LoginDto { Email = "test@example.com", Password = "password123" };
        var authResult = new AuthResultDto
        {
            Success = true,
            Token = "jwt-token",
            RefreshToken = "refresh-token",
            ExpiresAt = DateTime.UtcNow.AddHours(1)
        };
        _authServiceMock.Setup(s => s.LoginAsync(loginDto))
            .ReturnsAsync(authResult);

        // Act
        var result = await _controller.Login(loginDto);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnValue = okResult.Value.Should().BeOfType<AuthResultDto>().Subject;
        returnValue.Success.Should().BeTrue();
        returnValue.Token.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task Login_WithInvalidCredentials_ReturnsUnauthorized()
    {
        // Arrange
        var loginDto = new LoginDto { Email = "test@example.com", Password = "wrongpassword" };
        var authResult = new AuthResultDto
        {
            Success = false,
            Error = "Invalid credentials"
        };
        _authServiceMock.Setup(s => s.LoginAsync(loginDto))
            .ReturnsAsync(authResult);

        // Act
        var result = await _controller.Login(loginDto);

        // Assert
        result.Result.Should().BeOfType<UnauthorizedObjectResult>();
    }

    [Fact]
    public async Task Register_WithValidData_ReturnsOkResult()
    {
        // Arrange
        var registerDto = _fixture.Create<RegisterDto>();
        var authResult = new AuthResultDto
        {
            Success = true,
            Token = "jwt-token",
            RefreshToken = "refresh-token"
        };
        _authServiceMock.Setup(s => s.RegisterAsync(registerDto))
            .ReturnsAsync(authResult);

        // Act
        var result = await _controller.Register(registerDto);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnValue = okResult.Value.Should().BeOfType<AuthResultDto>().Subject;
        returnValue.Success.Should().BeTrue();
    }

    [Fact]
    public async Task Register_WithExistingEmail_ReturnsBadRequest()
    {
        // Arrange
        var registerDto = _fixture.Create<RegisterDto>();
        var authResult = new AuthResultDto
        {
            Success = false,
            Error = "Email already registered"
        };
        _authServiceMock.Setup(s => s.RegisterAsync(registerDto))
            .ReturnsAsync(authResult);

        // Act
        var result = await _controller.Register(registerDto);

        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task RefreshToken_WithValidToken_ReturnsNewTokens()
    {
        // Arrange
        var refreshDto = new RefreshTokenDto { RefreshToken = "valid-refresh-token" };
        var authResult = new AuthResultDto
        {
            Success = true,
            Token = "new-jwt-token",
            RefreshToken = "new-refresh-token"
        };
        _authServiceMock.Setup(s => s.RefreshTokenAsync(refreshDto.RefreshToken))
            .ReturnsAsync(authResult);

        // Act
        var result = await _controller.RefreshToken(refreshDto);

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnValue = okResult.Value.Should().BeOfType<AuthResultDto>().Subject;
        returnValue.Token.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task RefreshToken_WithInvalidToken_ReturnsUnauthorized()
    {
        // Arrange
        var refreshDto = new RefreshTokenDto { RefreshToken = "invalid-refresh-token" };
        var authResult = new AuthResultDto
        {
            Success = false,
            Error = "Invalid refresh token"
        };
        _authServiceMock.Setup(s => s.RefreshTokenAsync(refreshDto.RefreshToken))
            .ReturnsAsync(authResult);

        // Act
        var result = await _controller.RefreshToken(refreshDto);

        // Assert
        result.Result.Should().BeOfType<UnauthorizedObjectResult>();
    }

    [Fact]
    public async Task ForgotPassword_WithValidEmail_ReturnsOk()
    {
        // Arrange
        var dto = new ForgotPasswordDto { Email = "test@example.com" };
        _authServiceMock.Setup(s => s.ForgotPasswordAsync(dto.Email))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.ForgotPassword(dto);

        // Assert
        result.Should().BeOfType<OkResult>();
    }

    [Fact]
    public async Task ResetPassword_WithValidToken_ReturnsOk()
    {
        // Arrange
        var dto = new ResetPasswordDto
        {
            Token = "reset-token",
            Email = "test@example.com",
            NewPassword = "newPassword123"
        };
        _authServiceMock.Setup(s => s.ResetPasswordAsync(dto))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.ResetPassword(dto);

        // Assert
        result.Should().BeOfType<OkResult>();
    }

    [Fact]
    public async Task Logout_ReturnsOk()
    {
        // Arrange
        _authServiceMock.Setup(s => s.LogoutAsync())
            .Returns(Task.CompletedTask);

        // Act
        var result = await _controller.Logout();

        // Assert
        result.Should().BeOfType<OkResult>();
    }
}
