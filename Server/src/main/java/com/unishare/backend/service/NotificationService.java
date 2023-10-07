package com.unishare.backend.service;

import com.unishare.backend.DTO.Request.NotificationRequest;
import com.unishare.backend.DTO.Response.NotificationResponse;
import com.unishare.backend.exceptionHandlers.ErrorMessageException;
import com.unishare.backend.model.Notification;
import com.unishare.backend.repository.NotificationRepository;
import com.unishare.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class NotificationService {

    private NotificationRepository notificationRepository;
    private UserRepository userRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public NotificationResponse makeNotificationResponse(Notification notification) {
        return new NotificationResponse(
            notification.getId(),
            notification.getMessage(),
            notification.getCreatedAt().toString(),
            notification.getSender().getId(),
            notification.getReceiver().getId()
        );
    }

    public List<NotificationResponse> getAllNotifications() {
        List<Notification> notifications = notificationRepository.findAll();
        return notifications.stream().map(this::makeNotificationResponse).collect(Collectors.toList());
    }

    public NotificationResponse getNotification(Long id) {
        Optional<Notification> notificationOptional = notificationRepository.findById(id);
        if (notificationOptional.isPresent()) {
            return makeNotificationResponse(notificationOptional.get());
        }
        throw new ErrorMessageException("Notification not found with ID: " + id);
    }

    public void createNotification(Long sender, Long receiver, String message) {
        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setSender(userRepository.findById(sender)
                .orElseThrow(() -> new ErrorMessageException("User not found with ID: " + sender)));
        notification.setReceiver(userRepository.findById(receiver)
                .orElseThrow(() -> new ErrorMessageException("Receiver not found with ID: " + receiver)));
        notification.setCreatedAt(new Date());
        notificationRepository.save(notification);
    }

    public List<NotificationResponse> getNotificationsByReceiverId(Long receiverId) {
        List<Notification> notifications = notificationRepository.findByReceiverId(receiverId);
        return notifications.stream().map(this::makeNotificationResponse).collect(Collectors.toList());
    }

    public void sendNotificationOfPendingStatus(Long ownerId, Long borrowerId, Long productId) {
        String message = "Your product #ID" + productId.toString() + " has a new booking request by user @"
                + borrowerId.toString() + ".\n"
                + "Please check Booking Request page on Owner Dashboard for more details.";

        createNotification(borrowerId, ownerId, message);
    }

    public void sendNotificationOfAcceptedStatus(Long ownerId, Long borrowerId, Long productId) {
        String message = "Your booking request for product #ID" + productId.toString() + " has been accepted by user @"
                + ownerId.toString() + ".\n"
                + "Please check My Request page for more details.";

        createNotification(ownerId, borrowerId, message);
    }

    public void sendNotificationOfRejectedStatus(Long ownerId, Long borrowerId, Long productId) {
        String message = "Your booking request for product #ID" + productId.toString() + " has been rejected by user @"
                + ownerId.toString() + ".\n"
                + "Please check My Request page for more details.";
        createNotification(ownerId, borrowerId, message);
    }

    public void sendNotificationOfLentStatus(Long ownerId, Long borrowerId, Long productId) {
        String message = "Your product #ID" + productId.toString() + " has been lent to user @"
                + borrowerId.toString() + ".\n"
                + "Please check Booking Request page on Owner Dashboard for more details.";

        createNotification(borrowerId, ownerId, message);
    }

    public void sendNotificationOfCancelledStatus(Long ownerId, Long borrowerId, Long productId) {
        String message = "Booking request for product #ID" + productId.toString() + " has been cancelled by user @"
                + borrowerId.toString() + ".\n"
                + "Please check Booking Request page on Borrower Dashboard for more details.";

        createNotification(borrowerId, ownerId, message);
    }

    public void sendNotificationOfCompletedStatus(Long ownerId, Long borrowerId, Long productId) {
        String message = "Thank you! The rental has been completed for product #ID" + productId.toString() + ".\n"
                + "Please check My Request page for more details.";

        createNotification(ownerId, borrowerId, message);
    }
}
