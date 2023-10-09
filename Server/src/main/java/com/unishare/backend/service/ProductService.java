package com.unishare.backend.service;

import com.unishare.backend.DTO.Request.CategoryRequest;
import com.unishare.backend.DTO.Request.ProductRequest;
import com.unishare.backend.DTO.Response.CategoryResponse;
import com.unishare.backend.DTO.Response.ProductResponse;
import com.unishare.backend.DTO.SpecialResponse.PageResponse;
import com.unishare.backend.exceptionHandlers.CategoryNotFoundException;
import com.unishare.backend.exceptionHandlers.ErrorMessageException;
import com.unishare.backend.exceptionHandlers.ProductNotFoundException;
import com.unishare.backend.exceptionHandlers.UserNotFoundException;
import com.unishare.backend.model.*;
import com.unishare.backend.repository.BookingRepository;
import com.unishare.backend.repository.CategoryRepository;
import com.unishare.backend.repository.ProductRepository;
import com.unishare.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CategoryService categoryService;
    private final CloudinaryImageService cloudinaryImageService;
    private final UserService userService;
    private final BookingRepository bookingRepository;

    @Cacheable("product-all")
    public PageResponse<List<ProductResponse>> getAllProducts(int page, int size) {
        if (size == Integer.MAX_VALUE) page = 0;
        Page<Product> pageResponse = productRepository.getProductsPage(PageRequest.of(page, size));

        PageResponse<List<ProductResponse>> pageResponses = new PageResponse<>();
        List<ProductResponse> products = pageResponse.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());


        pageResponses.setData(products);
        pageResponses.setTotalPages(pageResponse.getTotalPages());
        pageResponses.setTotalElements(pageResponse.getTotalElements());
        pageResponses.setCurrentPage(pageResponse.getNumber());
        pageResponses.setCurrentElements(pageResponse.getNumberOfElements());
        return pageResponses;
    }

    @Cacheable("product-#id")
    public ProductResponse getProductById(Long id) {
        Optional<Product> productOptional = productRepository.findById(id);
        if (productOptional.isPresent()) {
            return convertToResponse(productOptional.get());
        }
        throw new ProductNotFoundException("Product not found with ID: " + id);
    }

    @CacheEvict(value = {"product-#id", "product-all"}, allEntries = true)
    public void deleteProduct(Long id) {
        Optional<Product> productOptional = productRepository.findById(id);
        if (productOptional.isPresent()) {
            Product product = productOptional.get();
            productRepository.delete(product);
        } else {
            throw new ProductNotFoundException("Product not found with ID: " + id);
        }
    }

    private Double getTotalPrice(Product product, int dayCount) {
        return product.getBasePrice() + product.getPerDayPrice() * dayCount;
    }

    private Double getTotalPrice(Product product) {
        return product.getBasePrice() + product.getPerDayPrice();
    }

    private Double getRating(Product product) {
        List<Booking> bookings = bookingRepository.findAllByProductId(product.getId());
        Double totalRating = 0.0;
        Integer ratingCount = 0;
        for (Booking booking : bookings) {
            if (Objects.nonNull(booking.getReview()) && Objects.nonNull(booking.getReview().getRating())) {
                totalRating += booking.getReview().getRating();
                ratingCount++;
            }
        }

        if (ratingCount == 0) {
            return 0.0;
        }
        return totalRating / ratingCount;
    }

    private Integer getRatingCount(Product product) {
        List<Booking> bookings = bookingRepository.findAllByProductId(product.getId());
        Integer ratingCount = 0;
        for (Booking booking : bookings) {
            if (Objects.nonNull(booking.getReview()) && Objects.nonNull(booking.getReview().getRating())) {
                ratingCount++;
            }
        }
        return ratingCount;
    }

    private ProductResponse convertToResponseHelp(Product product) {
        List<Long> bookingIds = bookingRepository.findAllByProductId(product.getId()).stream()
                .map(Booking::getId)
                .collect(Collectors.toList());

        ProductResponse response = new ProductResponse();
        response.setProductId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setBasePrice(product.getBasePrice());
        response.setMarketPrice(product.getMarketPrice());
        response.setStatus(product.getStatus());
        response.setOwner(userService.userResponseForOthers(product.getOwner()));
        response.setCategory(categoryService.makeCategoryResponse(product.getCategory()));
        response.setBookingIds(bookingIds);
        response.setImage1(product.getImage1());
        response.setImage2(product.getImage2());
        response.setImage3(product.getImage3());
        response.setPerDayPrice(product.getPerDayPrice());

        return response;
    }

    private ProductResponse convertToResponse(Product product) {
        ProductResponse response = convertToResponseHelp(product);
        response.setRating(getRating(product));
        response.setRatingCount(getRatingCount(product));
        response.setTotalPrice(getTotalPrice(product));

        return response;
    }

    public ProductResponse convertToResponse(Product product, int dayCount) {
        ProductResponse response = convertToResponseHelp(product);
        response.setRating(getRating(product));
        response.setRatingCount(getRatingCount(product));
        response.setTotalPrice(getTotalPrice(product, dayCount));

        return response;
    }


    @CacheEvict(value = {"product-#id", "product-all"}, allEntries = true)
    public ProductResponse createProductWithImage(List<MultipartFile> images, String name, String description, Double marketPrice, Double price, Double perDayPrice, Long categoryId, String token) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ErrorMessageException("Category not found with ID: " + categoryId));
        User owner = userService.getUserByToken(token);

        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setMarketPrice(marketPrice);
        product.setBasePrice(price);
        product.setPerDayPrice(perDayPrice);
        product.setStatus("Available");
        product.setOwner(owner);
        product.setCategory(category);
        product.setIsRestricted(false);

        String imageUrl1 = cloudinaryImageService.getUploadedImageUrl(images.get(0));
        product.setImage1(imageUrl1);

        if (images.size() > 1) {
            String imageUrl2 = cloudinaryImageService.getUploadedImageUrl(images.get(1));
            product.setImage2(imageUrl2);
        }

        if (images.size() > 2) {
            String imageUrl3 = cloudinaryImageService.getUploadedImageUrl(images.get(2));
            product.setImage3(imageUrl3);
        }

        product = productRepository.save(product);
        return convertToResponse(product);
    }

    public PageResponse<List<ProductResponse>> getProductsByCategoryId(Long id, int page, int size) {
        if (size == Integer.MAX_VALUE) page = 0;
        Page<Product> products = productRepository.findAllByCategoryId(id, PageRequest.of(page, size));

        PageResponse<List<ProductResponse>> pageResponses = new PageResponse<>();
        List<ProductResponse> productResponses = products.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        pageResponses.setData(productResponses);
        pageResponses.setTotalPages(products.getTotalPages());
        pageResponses.setTotalElements(products.getTotalElements());
        pageResponses.setCurrentPage(products.getNumber());
        pageResponses.setCurrentElements(products.getNumberOfElements());

        return pageResponses;
    }

    public PageResponse<List<ProductResponse>> getProductsByOwnerId(Long id, int page, int size) {
        if (size == Integer.MAX_VALUE) page = 0;
        Page<Product> products = productRepository.findAllByOwnerId(id, PageRequest.of(page, size));

        PageResponse<List<ProductResponse>> pageResponses = new PageResponse<>();
        List<ProductResponse> productResponses = products.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        pageResponses.setData(productResponses);
        pageResponses.setTotalPages(products.getTotalPages());
        pageResponses.setTotalElements(products.getTotalElements());
        pageResponses.setCurrentPage(products.getNumber());
        pageResponses.setCurrentElements(products.getNumberOfElements());

        return pageResponses;
    }

    public PageResponse<List<ProductResponse>> getProductsByOwnerIdAndStatus(Long id, String status, int page, int size) {
        if (size == Integer.MAX_VALUE) page = 0;
        Page<Product> products = productRepository.findAllByOwnerIdAndStatus(id, status, PageRequest.of(page, size));

        PageResponse<List<ProductResponse>> pageResponses = new PageResponse<>();
        List<ProductResponse> productResponses = products.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        pageResponses.setData(productResponses);
        pageResponses.setTotalPages(products.getTotalPages());
        pageResponses.setTotalElements(products.getTotalElements());
        pageResponses.setCurrentPage(products.getNumber());
        pageResponses.setCurrentElements(products.getNumberOfElements());

        return pageResponses;
    }

    public PageResponse<List<ProductResponse>> getProductsByOwnerIdAndStatusAndCategoryId(Long id, String status, Long categoryId, int page, int size) {
        if (size == Integer.MAX_VALUE) page = 0;
        Page<Product> products = productRepository.findAllByOwnerIdAndStatusAndCategoryId(id, status, categoryId, PageRequest.of(page, size));

        PageResponse<List<ProductResponse>> pageResponses = new PageResponse<>();
        List<ProductResponse> productResponses = products.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        pageResponses.setData(productResponses);
        pageResponses.setTotalPages(products.getTotalPages());
        pageResponses.setTotalElements(products.getTotalElements());
        pageResponses.setCurrentPage(products.getNumber());
        pageResponses.setCurrentElements(products.getNumberOfElements());

        return pageResponses;
    }

    public PageResponse<List<ProductResponse>> getProductsByOwnerIdAndCategoryId(Long id, Long categoryId, int page, int size) {
        if (size == Integer.MAX_VALUE) page = 0;
        Page<Product> products = productRepository.findAllByOwnerIdAndCategoryId(id, categoryId, PageRequest.of(page, size));

        PageResponse<List<ProductResponse>> pageResponses = new PageResponse<>();
        List<ProductResponse> productResponses = products.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        pageResponses.setData(productResponses);
        pageResponses.setTotalPages(products.getTotalPages());
        pageResponses.setTotalElements(products.getTotalElements());
        pageResponses.setCurrentPage(products.getNumber());
        pageResponses.setCurrentElements(products.getNumberOfElements());

        return pageResponses;
    }

    public PageResponse<List<ProductResponse>> getProductsByStatus(String status, int page, int size) {
        if (size == Integer.MAX_VALUE) page = 0;
        Page<Product> products = productRepository.findAllByStatus(status, PageRequest.of(page, size));

        PageResponse<List<ProductResponse>> pageResponses = new PageResponse<>();
        List<ProductResponse> productResponses = products.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        pageResponses.setData(productResponses);
        pageResponses.setTotalPages(products.getTotalPages());
        pageResponses.setTotalElements(products.getTotalElements());
        pageResponses.setCurrentPage(products.getNumber());
        pageResponses.setCurrentElements(products.getNumberOfElements());

        return pageResponses;
    }

    public PageResponse<List<ProductResponse>> getProductsByCategoryIdAndStatus(Long categoryId, String status, int page, int size) {
        if (size == Integer.MAX_VALUE) page = 0;
        Page<Product> products = productRepository.findAllByCategoryIdAndStatus(categoryId, status, PageRequest.of(page, size));

        PageResponse<List<ProductResponse>> pageResponses = new PageResponse<>();
        List<ProductResponse> productResponses = products.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        pageResponses.setData(productResponses);
        pageResponses.setTotalPages(products.getTotalPages());
        pageResponses.setTotalElements(products.getTotalElements());
        pageResponses.setCurrentPage(products.getNumber());
        pageResponses.setCurrentElements(products.getNumberOfElements());

        return pageResponses;
    }

    public PageResponse<List<ProductResponse>> getProductBySearchingKeyWord(String keyword, int page, int size) {
        if (size == Integer.MAX_VALUE) page = 0;
        Page<Product> products = productRepository.findByNameContainingIgnoreCase(keyword, PageRequest.of(page, size));

        PageResponse<List<ProductResponse>> pageResponses = new PageResponse<>();
        List<ProductResponse> productResponses = products.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        pageResponses.setData(productResponses);
        pageResponses.setTotalPages(products.getTotalPages());
        pageResponses.setTotalElements(products.getTotalElements());
        pageResponses.setCurrentPage(products.getNumber());
        pageResponses.setCurrentElements(products.getNumberOfElements());

        return pageResponses;
    }

//    public List<ProductResponse> getProductsByCategoryIdWithDayCount(Long categoryId, int dayCount, int page, int size) {
//        if (size == Integer.MAX_VALUE) page = 0;
//        List<Product> products = productRepository.findAllByCategoryId(categoryId, PageRequest.of(page, size)).stream().toList();
//        return products.stream()
//                .map(product -> convertToResponse(product, dayCount))
//                .collect(Collectors.toList());
//    }
//
//    public PageResponse<List<ProductResponse>> getProductsByCategoryIdAndStatusAndDayCountAndPriceAsc(Long categoryId, int dayCount, int page, int size) {
////        List<ProductResponse> products = getProductsByCategoryIdWithDayCount(categoryId, dayCount, page, size);
////
////        products = products.stream()
////                .sorted(Comparator.comparingDouble(ProductResponse::getTotalPrice))
////                .collect(Collectors.toList());
//
//        if (size == Integer.MAX_VALUE) page = 0;
//        Page<Product> products = productRepository.findAllByCategoryId(categoryId, PageRequest.of(page, size));
//
//        PageResponse<List<ProductResponse>> pageResponses = new PageResponse<>();
//        List<ProductResponse> productResponses = products.stream()
//                .map(product -> convertToResponse(product, dayCount))
//                .collect(Collectors.toList());
//
//        pageResponses = pageResponses.stream()
//                .sorted(Comparator.comparingDouble(ProductResponse::getTotalPrice))
//                .collect(Collectors.toList());
//
//        pageResponses.setData(productResponses);
//        pageResponses.setTotalPages(products.getTotalPages());
//        pageResponses.setTotalElements(products.getTotalElements());
//        pageResponses.setCurrentPage(products.getNumber());
//        pageResponses.setCurrentElements(products.getNumberOfElements());
//
//        return pageResponses;
//    }
//
//    public PageResponse<List<ProductResponse>> getProductsByCategoryIdAndStatusAndDayCountAndPriceDesc(Long categoryId, String status, int dayCount) {
//        PageResponse<List<ProductResponse>> products = getProductsByCategoryIdAndStatusWithDayCount(categoryId, status, dayCount);
//        return products.stream()
//                .sorted(Comparator.comparingDouble(ProductResponse::getTotalPrice).reversed())
//                .collect(Collectors.toList());
//    }
//
//    public PageResponse<List<ProductResponse>> getProductsByCategoryIdAndStatusAndDayCountAndRatingAsc(Long categoryId, String status, int dayCount) {
//        PageResponse<List<ProductResponse>> products = getProductsByCategoryIdAndStatusWithDayCount(categoryId, status, dayCount);
//        return products.stream()
//                .sorted(Comparator.comparingDouble(ProductResponse::getRating))
//                .collect(Collectors.toList());
//    }
//
//    public PageResponse<List<ProductResponse>> getProductsByCategoryIdAndStatusAndDayCountAndRatingDesc(Long categoryId, String status, int dayCount) {
//        PageResponse<List<ProductResponse>> products = getProductsByCategoryIdAndStatusWithDayCount(categoryId, status, dayCount);
//
//    }

    private boolean canBeRestricted(Product product) {
        List<Booking> bookings = bookingRepository.findAllByProductId(product.getId());
        for (Booking booking : bookings) {
            if (booking.getStatus().equals(BookingStatus.LENT) ||
                    booking.getStatus().equals(BookingStatus.ACCEPTED)) {
                return false;
            }
        }
        return true;
    }

    public Boolean restrictProduct(Long id) {
        Optional<Product> productOptional = productRepository.findById(id);
        if (productOptional.isPresent()) {
            if (!canBeRestricted(productOptional.get())) {
                throw new ErrorMessageException("Product cannot be restricted because it is currently being lent or booked");
            }
            Product product = productOptional.get();
            product.setStatus("Restricted");
            product.setIsRestricted(true);
            productRepository.save(product);
            return true;
        } else {
            throw new ProductNotFoundException("Product not found with ID: " + id);
        }
    }

    public void restrictProductOfUser(Long id) {
        List<Product> products = productRepository.findAllByOwnerId(id, PageRequest.of(0, Integer.MAX_VALUE)).stream().toList();
        for (Product product : products) {
            if (canBeRestricted(product)) {
                product.setStatus("Restricted");
                product.setIsRestricted(true);
                productRepository.save(product);
            }
        }
    }

}
