
package com.inventory.service;

import com.inventory.dto.ItemRequest;
import com.inventory.entity.Category;
import com.inventory.entity.Item;
import com.inventory.exception.BadRequestException;
import com.inventory.exception.DuplicateResourceException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ItemService {

    private final ItemRepository itemRepository;
    private final CategoryService categoryService;
    private final FileStorageService fileStorageService;

    // ------------------------------------------------------------
    // READ
    // ------------------------------------------------------------

    @Transactional(readOnly = true)
    public Page<Item> search(String search, Long categoryId, Pageable pageable) {
        String term = (search == null || search.isBlank())
                ? null
                : search.trim();

        return itemRepository.search(term, categoryId, pageable);
    }

    @Transactional(readOnly = true)
    public Item findById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Item not found with id " + id));
    }

    @Transactional(readOnly = true)
    public List<Item> findOutOfStock() {
        return itemRepository.findByQuantityLessThanEqual(0);
    }

    @Transactional(readOnly = true)
    public List<Item> findLowStock() {
        return itemRepository.findLowStock();
    }

    // ------------------------------------------------------------
    // WRITE
    // ------------------------------------------------------------

    public Item create(ItemRequest request, MultipartFile file) {

        String sku = request.sku().trim();

        if (itemRepository.existsBySkuIgnoreCase(sku)) {
            throw new DuplicateResourceException(
                    "SKU already exists: " + sku);
        }

        Item item = new Item();
        apply(item, request);

        // Save item first to ensure it exists.
        Item savedItem = itemRepository.save(item);

        // Upload image if provided.
        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.store(file);
            savedItem.setImageFileName(fileName);
        }

        return itemRepository.save(savedItem);
    }

    public Item update(Long id, ItemRequest request) {

        Item item = findById(id);
        String newSku = request.sku().trim();

        if (!item.getSku().equalsIgnoreCase(newSku)
                && itemRepository.existsBySkuIgnoreCase(newSku)) {

            throw new DuplicateResourceException(
                    "SKU already exists: " + newSku);
        }

        apply(item, request);
        return itemRepository.save(item);
    }

    public void delete(Long id) {

        Item item = findById(id);

        fileStorageService.delete(item.getImageFileName());
        itemRepository.delete(item);
    }

    // ------------------------------------------------------------
    // STOCK
    // ------------------------------------------------------------

    public Item addStock(Long id, int quantity) {

        Item item = findById(id);
        item.setQuantity(item.getQuantity() + quantity);

        return itemRepository.save(item);
    }

    public Item removeStock(Long id, int quantity) {

        Item item = findById(id);

        if (quantity > item.getQuantity()) {
            throw new BadRequestException(
                    "Not enough stock. Available: "
                            + item.getQuantity()
                            + ", requested: " + quantity);
        }

        item.setQuantity(item.getQuantity() - quantity);
        return itemRepository.save(item);
    }

    // ------------------------------------------------------------
    // IMAGE
    // ------------------------------------------------------------

    public Item uploadImage(Long id, MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Image file is required");
        }

        Item item = findById(id);

        String newFile = fileStorageService.store(file);
        String oldFile = item.getImageFileName();

        item.setImageFileName(newFile);
        Item savedItem = itemRepository.save(item);

        // Delete previous image only after the new one is stored.
        fileStorageService.delete(oldFile);

        return savedItem;
    }

    public Item deleteImage(Long id) {

        Item item = findById(id);

        fileStorageService.delete(item.getImageFileName());
        item.setImageFileName(null);

        return itemRepository.save(item);
    }

    // ------------------------------------------------------------
    // HELPERS
    // ------------------------------------------------------------

    private void apply(Item item, ItemRequest r) {

        item.setName(r.name().trim());
        item.setSku(r.sku().trim());
        item.setBrand(r.brand());
        item.setModel(r.model());
        item.setDescription(r.description());
        item.setPrice(r.price());

        item.setMinStockLevel(
                r.minStockLevel() == null
                        ? 0
                        : r.minStockLevel());

        item.setDefaultWarrantyMonths(
                r.defaultWarrantyMonths());

        if (r.quantity() != null) {
            item.setQuantity(r.quantity());
        }

        Category category = r.categoryId() == null
                ? null
                : categoryService.findById(r.categoryId());

        item.setCategory(category);
    }
}
