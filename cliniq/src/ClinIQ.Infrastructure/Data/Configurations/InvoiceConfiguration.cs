using ClinIQ.Domain.Entities.Billing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClinIQ.Infrastructure.Data.Configurations;

public class InvoiceConfiguration : IEntityTypeConfiguration<Invoice>
{
    public void Configure(EntityTypeBuilder<Invoice> builder)
    {
        builder.ToTable("Invoices");

        builder.HasKey(i => i.Id);

        builder.Property(i => i.InvoiceNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(i => new { i.TenantId, i.InvoiceNumber })
            .IsUnique();

        builder.Property(i => i.SubTotal)
            .HasColumnType("decimal(18,2)");

        builder.Property(i => i.DiscountAmount)
            .HasColumnType("decimal(18,2)");

        builder.Property(i => i.DiscountPercent)
            .HasColumnType("decimal(5,2)");

        builder.Property(i => i.TaxAmount)
            .HasColumnType("decimal(18,2)");

        builder.Property(i => i.TaxPercent)
            .HasColumnType("decimal(5,2)");

        builder.Property(i => i.TotalAmount)
            .HasColumnType("decimal(18,2)");

        builder.Property(i => i.PaidAmount)
            .HasColumnType("decimal(18,2)");

        builder.Property(i => i.OutstandingAmount)
            .HasColumnType("decimal(18,2)");

        builder.Property(i => i.RefundedAmount)
            .HasColumnType("decimal(18,2)");

        builder.Property(i => i.InsuranceAmount)
            .HasColumnType("decimal(18,2)");

        builder.Property(i => i.PatientResponsibility)
            .HasColumnType("decimal(18,2)");

        builder.Property(i => i.CorporateAmount)
            .HasColumnType("decimal(18,2)");

        builder.Property(i => i.DiscountReason)
            .HasMaxLength(500);

        builder.Property(i => i.Notes)
            .HasMaxLength(1000);

        builder.Property(i => i.CancellationReason)
            .HasMaxLength(500);

        builder.Property(i => i.RowVersion)
            .IsRowVersion();

        // Indexes
        builder.HasIndex(i => new { i.BranchId, i.Status });
        builder.HasIndex(i => new { i.PatientId, i.InvoiceDate });
        builder.HasIndex(i => new { i.BranchId, i.InvoiceDate });
    }
}

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.ToTable("Payments");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.PaymentNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(p => new { p.TenantId, p.PaymentNumber })
            .IsUnique();

        builder.Property(p => p.Amount)
            .HasColumnType("decimal(18,2)");

        builder.Property(p => p.ReferenceNumber)
            .HasMaxLength(100);

        builder.Property(p => p.CardLastFour)
            .HasMaxLength(4);

        builder.Property(p => p.CardType)
            .HasMaxLength(20);

        builder.Property(p => p.BankName)
            .HasMaxLength(100);

        builder.Property(p => p.BankAccountNumber)
            .HasMaxLength(50);

        builder.Property(p => p.Notes)
            .HasMaxLength(500);

        builder.Property(p => p.RefundReason)
            .HasMaxLength(500);

        builder.Property(p => p.ReversalReason)
            .HasMaxLength(500);

        builder.Property(p => p.RowVersion)
            .IsRowVersion();

        // Indexes
        builder.HasIndex(p => new { p.InvoiceId, p.Status });
        builder.HasIndex(p => new { p.PatientId, p.PaymentDate });
        builder.HasIndex(p => new { p.BranchId, p.PaymentDate });

        builder.HasOne(p => p.Invoice)
            .WithMany(i => i.Payments)
            .HasForeignKey(p => p.InvoiceId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
