using System;
using BCrypt.Net;

namespace ClinIQ.API;

public static class HashGenerator
{
    public static void Main()
    {
        string password = "Admin@123";
        string hash = BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12);
        Console.WriteLine("BCrypt Hash for 'Admin@123':");
        Console.WriteLine(hash);

        bool verified = BCrypt.Net.BCrypt.Verify(password, hash);
        Console.WriteLine($"Verification: {verified}");
    }
}
