package com.inventory.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ItemRequest(
        @NotBlank(message = "name is required") String name,
        @NotBlank(message = "sku is required") @Size(max = 100) String sku,
        String brand,
        String model,
        @Size(max = 1000) String description,
        Long categoryId,
        @NotNull(message = "price is required") @DecimalMin(value = "0.0", message = "price cannot be negative") BigDecimal price,
        @Min(value = 0, message = "quantity cannot be negative") Integer quantity,
        @Min(value = 0, message = "minStockLevel cannot be negative") Integer minStockLevel,
        @Min(value = 0, message = "defaultWarrantyMonths cannot be negative") Integer defaultWarrantyMonths) {
}
