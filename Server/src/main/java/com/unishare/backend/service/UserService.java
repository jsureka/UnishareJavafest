package com.unishare.backend.service;

import com.unishare.backend.DTO.Request.UserUpdateRequest;
import com.unishare.backend.DTO.Response.ProductResponse;
import com.unishare.backend.DTO.Response.UserResponse;
import com.unishare.backend.DTO.SpecialResponse.PageResponse;
import com.unishare.backend.exceptionHandlers.ErrorMessageException;
import com.unishare.backend.exceptionHandlers.UserNotFoundException;
import com.unishare.backend.model.Booking;
import com.unishare.backend.model.BookingStatus;
import com.unishare.backend.model.Product;
import com.unishare.backend.model.User;
import com.unishare.backend.repository.BookingRepository;
import com.unishare.backend.repository.ProductRepository;
import com.unishare.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final ProductRepository productRepository;
    private final BookingRepository bookingRepository;
    private final CloudinaryImageService cloudinaryImageService;



    public UserResponse makeUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getIdCard(),
                user.getProfilePicture(),
                user.getAddress(),
                user.getPhoneNumber(),
                user.getLat(),
                user.getLng(),
                user.getUniversity().getId(),
                user.getIsEmailVerified(),
                user.getIsVerified(),
                user.getIsBlocked()
        );
    }

    @Cacheable("user-all")
    public PageResponse<List<UserResponse>> getAllUsers(int page, int size) {
        if (size == Integer.MAX_VALUE) page = 0;
        Page<User> userPage = userRepository.getUsersPage(PageRequest.of(page, size));

        PageResponse<List<UserResponse>> pageResponse = new PageResponse<>();
        List<UserResponse> users = userPage.stream()
                .map(this::makeUserResponse)
                .collect(Collectors.toList());
        pageResponse.setData(users);
        pageResponse.setTotalPages(userPage.getTotalPages());
        pageResponse.setTotalElements(userPage.getTotalElements());
        pageResponse.setCurrentPage(userPage.getNumber());
        pageResponse.setCurrentElements(userPage.getNumberOfElements());
        return pageResponse;
    }

    @Cacheable("user-#id")
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ErrorMessageException("User not found with ID: " + id));
        return makeUserResponse(user);
    }

    @CacheEvict(value = {"user-all", "user-#id"}, allEntries = true)
    public UserResponse userProfileUpdate(UserUpdateRequest userUpdateRequest) {
        User user = userRepository.findByEmail(userUpdateRequest.getEmail())
                .orElseThrow(() -> new ErrorMessageException("Haven't any account with this email"));

        user.setFullName(userUpdateRequest.getFullName());
        user.setProfilePicture(userUpdateRequest.getProfilePicture());
        user = userRepository.save(user);

        return makeUserResponse(user);
    }

    @CacheEvict(value = {"user-#id", "user-all"}, allEntries = true)
    public UserResponse userBlockStatusUpdate(Long id, boolean isBlocked) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ErrorMessageException("User not found with ID: " + id));

        user.setIsBlocked(isBlocked);
        user = userRepository.save(user);

        List<Product> products = productRepository.findAllByOwnerId(id);
        for (Product product : products) {
            if (canBeRestricted(product)) {
                product.setStatus("Restricted");
                product.setIsRestricted(true);
                productRepository.save(product);
            }
        }

        return makeUserResponse(user);
    }


    @CacheEvict(value = {"user-#id", "user-all"}, allEntries = true)
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

    @CacheEvict(value = {"user-#id", "user-all"}, allEntries = true)
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ErrorMessageException("User not found with ID: " + id));

        userRepository.delete(user);
    }

    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ErrorMessageException("User not found with email: " + email));
        return makeUserResponse(user);
    }

    public UserResponse getUserResponseByToken(String token) {
        String email = jwtService.extractEmailFromBearerToken(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ErrorMessageException("User not found with token."));
        return makeUserResponse(user);
    }

    public User getUserByToken(String token) {
        String email = jwtService.extractEmailFromBearerToken(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ErrorMessageException("User not found with token."));
    }

    public Long getUserIdFromToken(String token) {
        String email = jwtService.extractEmailFromBearerToken(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ErrorMessageException("User not found with token."));
        return user.getId();
    }

    public void userProfilePictureUpdate(String token, MultipartFile profilePicture) {
        User user = getUserByToken(token);
        String profilePictureUrl = cloudinaryImageService.getUploadedImageUrl(profilePicture);
        user.setProfilePicture(profilePictureUrl);
        userRepository.save(user);
    }

    public void userIdCardUpdate(String token, MultipartFile idcard) {
        User user = getUserByToken(token);
        String idcardurl = cloudinaryImageService.getUploadedImageUrl(idcard);
        user.setIdCard(idcardurl);
        userRepository.save(user);
    }

    // Add more service methods here as needed
}
