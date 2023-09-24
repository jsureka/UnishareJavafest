package com.unishare.backend.service;

import com.unishare.backend.exceptionHandlers.ErrorMessageException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailSendingService {
    @Autowired
    private JavaMailSender javaMailSender;

    public void sendMail(String toMail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("no-reply@unishare.com");
        message.setTo(toMail);
        message.setText(body);
        message.setSubject(subject);

        this.javaMailSender.send(message);
    }

    public void sendOTPMail(String toMail, String OTP) {
        String subject = "UniShare: Your OTP to Activate Your Account";
        String body = "Thank you for choosing UniShare! Please use the following One-Time Password (OTP) to complete your sign-up process. The OTP is " + OTP;

        try {
            sendMail(toMail, subject, body);
        } catch (Exception exception) {
            throw new ErrorMessageException("Ops, Sending OTP is failed. Try again.");
        }
    }

    public void sendResetTokenMail(String toMail, String passwordResetToken) {
        String subject = "UniShare: Your Token to Reset Your Password";
        String body = "Thank you! Please use the following Token to reset your password. Your Password Reset Token is " + passwordResetToken;

        try {
            sendMail(toMail, subject, body);
        } catch (Exception exception) {
            throw new ErrorMessageException("Ops, Sending OTP is failed. Try again.");
        }
    }
}
