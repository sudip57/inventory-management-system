package com.inventory.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * A product/model in the catalog (e.g. "Dell Latitude 5440", "Kingston 16GB DDR4 RAM").
 */
@Entity
@Table(name = "items")
@Getter
@Setter
@NoArgsConstructor
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String sku;

    private String brand;

    private String model;

    @Column(length = 1000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price = BigDecimal.ZERO;

    @Column(nullable = false)
    private int quantity = 0;

    /** When quantity falls to this level (or below) the item is flagged as LOW_STOCK. */
    @Column(nullable = false)
    private int minStockLevel = 0;

    /** Default warranty applied to new serial-numbered units of this item. */
    private Integer defaultWarrantyMonths;

    @JsonIgnore
    private String imageFileName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ----- computed fields included in the JSON response -----

    public StockStatus getStockStatus() {
        if (quantity <= 0) {
            return StockStatus.OUT_OF_STOCK;
        }
        if (quantity <= minStockLevel) {
            return StockStatus.LOW_STOCK;
        }
        return StockStatus.IN_STOCK;
    }

    public String getImageUrl() {
        return imageFileName == null ? null : "/api/items/" + id + "/image";
    }
}
