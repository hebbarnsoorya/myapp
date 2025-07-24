package com.soorya.file.reader.controller;

import com.soorya.file.reader.model.Product;
import com.soorya.file.reader.service.ProductExcelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products")
//@CrossOrigin(origins = "http://localhost:3000")
public class ProductUploadController {

    @Autowired
    private ProductExcelService productExcelService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadProducts(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file to upload.");
        }
        if (!file.getOriginalFilename().endsWith(".xlsx")) {
            return ResponseEntity.badRequest().body("Only .xlsx files are allowed.");
        }

        try {
            List<Product> products = productExcelService.readProductsFromExcel(file);
            System.out.println("RESULT: "+ products);
            return ResponseEntity.ok(products);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            // Log the exception
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred during file processing: " + e.getMessage());
        }
    }
}
