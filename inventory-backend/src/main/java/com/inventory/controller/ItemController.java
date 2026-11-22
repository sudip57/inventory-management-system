
package com.inventory.controller;

import com.inventory.dto.ItemRequest;
import com.inventory.dto.StockChangeRequest;
import com.inventory.entity.Item;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.service.FileStorageService;
import com.inventory.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;
    private final FileStorageService fileStorageService;

    // ------------------------------------------------------------
    // CRUD
    // ------------------------------------------------------------

    @GetMapping
    public Page<Item> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @PageableDefault(size = 20, sort = "name") Pageable pageable) {

        return itemService.search(search, categoryId, pageable);
    }

    @GetMapping("/{id}")
    public Item get(@PathVariable Long id) {
        return itemService.findById(id);
    }

    /**
     * Create item with an optional image.
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Item create(
            @Valid @RequestPart("item") ItemRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        return itemService.create(request, file);
    }

    @PutMapping("/{id}")
    public Item update(
            @PathVariable Long id,
            @Valid @RequestBody ItemRequest request) {

        return itemService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        itemService.delete(id);
    }

    // ------------------------------------------------------------
    // STOCK
    // ------------------------------------------------------------

    @GetMapping("/out-of-stock")
    public List<Item> outOfStock() {
        return itemService.findOutOfStock();
    }

    @GetMapping("/low-stock")
    public List<Item> lowStock() {
        return itemService.findLowStock();
    }

    @PostMapping("/{id}/stock/add")
    public Item addStock(
            @PathVariable Long id,
            @Valid @RequestBody StockChangeRequest request) {

        return itemService.addStock(id, request.quantity());
    }

    @PostMapping("/{id}/stock/remove")
    public Item removeStock(
            @PathVariable Long id,
            @Valid @RequestBody StockChangeRequest request) {

        return itemService.removeStock(id, request.quantity());
    }

    // ------------------------------------------------------------
    // IMAGE
    // ------------------------------------------------------------

    /**
     * Upload or replace an image for an existing item.
     */
    @PostMapping(
            value = "/{id}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Item uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        return itemService.uploadImage(id, file);
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<Resource> getImage(@PathVariable Long id) {

        Item item = itemService.findById(id);
        String fileName = item.getImageFileName();

        if (fileName == null) {
            throw new ResourceNotFoundException(
                    "Item " + id + " has no image");
        }

        Resource resource = fileStorageService.load(fileName);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(
                        fileStorageService.contentType(fileName)))
                .body(resource);
    }

    @DeleteMapping("/{id}/image")
    public Item deleteImage(@PathVariable Long id) {
        return itemService.deleteImage(id);
    }
}
