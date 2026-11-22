package com.inventory.service;

import com.inventory.exception.BadRequestException;
import com.inventory.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

/** Stores uploaded item images on local disk (folder set by app.upload-dir). */
@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "gif", "webp");

    private final Path uploadDir;

    public FileStorageService(@Value("${app.upload-dir}") String uploadDir) {
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException e) {
            throw new UncheckedIOException("Could not create upload directory " + this.uploadDir, e);
        }
    }

    /** Saves the image and returns the generated file name. */
    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Image file is required");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("Only image files are allowed");
        }
        String original = file.getOriginalFilename() == null ? "" : file.getOriginalFilename();
        int dot = original.lastIndexOf('.');
        String extension = dot >= 0 ? original.substring(dot + 1).toLowerCase(Locale.ROOT) : "";
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException("Allowed image types: " + ALLOWED_EXTENSIONS);
        }
        String fileName = UUID.randomUUID() + "." + extension;
        try {
            Files.copy(file.getInputStream(), uploadDir.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to store image", e);
        }
        return fileName;
    }

    public Resource load(String fileName) {
        try {
            Path path = uploadDir.resolve(fileName).normalize();
            if (!path.startsWith(uploadDir) || !Files.exists(path)) {
                throw new ResourceNotFoundException("Image file not found");
            }
            return new UrlResource(path.toUri());
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    public String contentType(String fileName) {
        try {
            String type = Files.probeContentType(uploadDir.resolve(fileName));
            return type != null ? type : "application/octet-stream";
        } catch (IOException e) {
            return "application/octet-stream";
        }
    }

    public void delete(String fileName) {
        if (fileName == null) {
            return;
        }
        try {
            Path path = uploadDir.resolve(fileName).normalize();
            if (path.startsWith(uploadDir)) {
                Files.deleteIfExists(path);
            }
        } catch (IOException ignored) {
            // best effort cleanup
        }
    }
}
