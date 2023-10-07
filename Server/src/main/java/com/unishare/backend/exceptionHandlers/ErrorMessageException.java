package com.unishare.backend.exceptionHandlers;

public class ErrorMessageException extends RuntimeException {
    public ErrorMessageException(String message) {
        super(message);
    }
}
