package com.inventory.repository;

import com.inventory.entity.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {

    boolean existsBySkuIgnoreCase(String sku);

    boolean existsByCategoryId(Long categoryId);

    @Query("""
            SELECT i FROM Item i LEFT JOIN i.category c
            WHERE (:search IS NULL
                   OR LOWER(i.name) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(i.sku) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(i.brand) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(i.model) LIKE LOWER(CONCAT('%', :search, '%')))
              AND (:categoryId IS NULL OR c.id = :categoryId)
            """)
    Page<Item> search(@Param("search") String search,
                      @Param("categoryId") Long categoryId,
                      Pageable pageable);

    List<Item> findByQuantityLessThanEqual(int quantity);

    @Query("SELECT i FROM Item i WHERE i.quantity > 0 AND i.quantity <= i.minStockLevel")
    List<Item> findLowStock();

    long countByQuantityLessThanEqual(int quantity);

    @Query("SELECT COUNT(i) FROM Item i WHERE i.quantity > 0 AND i.quantity <= i.minStockLevel")
    long countLowStock();

    /** Returns null when there are no items; callers should treat null as zero. */
    @Query("SELECT SUM(i.price * i.quantity) FROM Item i")
    BigDecimal totalStockValue();
}
