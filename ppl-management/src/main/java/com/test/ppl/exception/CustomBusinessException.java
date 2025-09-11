package com.test.ppl.exception;

import lombok.Getter;

@Getter
public class CustomBusinessException extends RuntimeException {
    private final String errorCode;

    public CustomBusinessException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
}
