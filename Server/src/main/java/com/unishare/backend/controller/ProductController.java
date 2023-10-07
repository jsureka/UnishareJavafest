package com.unishare.backend.controller;

import com.unishare.backend.DTO.SpecialResponse.ApiResponse;
import com.unishare.backend.DTO.Response.ProductResponse;
import com.unishare.backend.DTO.SpecialResponse.PageResponse;
import com.unishare.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin(origins = "*")

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping()
    public ResponseEntity<ApiResponse<PageResponse<List<ProductResponse>>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2147483647") int size) {
        try {
            PageResponse<List<ProductResponse>> productResponses = productService.getAllProducts(page, size);
            return ResponseEntity.ok(new ApiResponse<>(productResponses, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        try {
            ProductResponse product = productService.getProductById(id);
            return ResponseEntity.ok(new ApiResponse<>(product, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @PostMapping()
    public ResponseEntity<ApiResponse<ProductResponse>> createProductWithImage(
            @RequestHeader("Authorization") String token,
            @RequestParam("image0") MultipartFile image0,
            @RequestParam(value = "image1", required = false) MultipartFile image1,
            @RequestParam(value = "image2", required = false) MultipartFile image2,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("marketPrice") Double marketPrice,
            @RequestParam("price") Double price,
            @RequestParam("perDayPrice") Double perDayPrice,
            @RequestParam("categoryId") Long categoryId
    ) {
        try {
            List<MultipartFile> images =new java.util.ArrayList<>();
            images.add(image0);
            if (image1 != null) images.add(image1);
            if (image2 != null) images.add(image2);
            ProductResponse createdProduct = productService.createProductWithImage(images, name, description, marketPrice, price, perDayPrice, categoryId, token);
            return ResponseEntity.ok(new ApiResponse<>(createdProduct, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>());
        }
    }

    @GetMapping("/category/{id}")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProductsByCategoryId(@PathVariable Long id) {
        try {
            List<ProductResponse> products = productService.getProductsByCategoryId(id);
            return ResponseEntity.ok(new ApiResponse<>(products, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("/owner/{id}")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProductsByOwnerId(@PathVariable Long id) {
        try {
            List<ProductResponse> products = productService.getProductsByOwnerId(id);
            return ResponseEntity.ok(new ApiResponse<>(products, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProductsByStatus(@PathVariable String status) {
        try {
            List<ProductResponse> products = productService.getProductsByStatus(status);
            return ResponseEntity.ok(new ApiResponse<>(products, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("/owner/{id}/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProductsByOwnerIdAndCategoryId(@PathVariable Long id, @PathVariable Long categoryId) {
        try {
            List<ProductResponse> products = productService.getProductsByOwnerIdAndCategoryId(id, categoryId);
            return ResponseEntity.ok(new ApiResponse<>(products, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("/owner/{id}/status/{status}")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProductsByOwnerIdAndStatus(@PathVariable Long id, @PathVariable String status) {
        try {
            List<ProductResponse> products = productService.getProductsByOwnerIdAndStatus(id, status);
            return ResponseEntity.ok(new ApiResponse<>(products, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("/owner/{id}/category/{categoryId}/status/{status}")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProductsByOwnerIdAndStatusAndCategoryId(@PathVariable Long id, @PathVariable String status, @PathVariable Long categoryId) {
        try {
            List<ProductResponse> products = productService.getProductsByOwnerIdAndStatusAndCategoryId(id, status, categoryId);
            return ResponseEntity.ok(new ApiResponse<>(products, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("/category/{categoryId}/status/{status}")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProductsByCategoryIdAndStatus(@PathVariable Long categoryId, @PathVariable String status) {
        try {
            List<ProductResponse> products = productService.getProductsByCategoryIdAndStatus(categoryId, status);
            return ResponseEntity.ok(new ApiResponse<>(products, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @PostMapping("/restricted/{id}")
    public ResponseEntity<ApiResponse<Boolean>> restrictProduct(@PathVariable Long id) {
        try {
            Boolean flag = productService.restrictProduct(id);
            return ResponseEntity.ok(new ApiResponse<>(flag, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

}
