package com.test.ppl.exception;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    private String resolveTraceId() {
        return MDC.get("traceId") != null ? MDC.get("traceId") : "N/A";
    }

    private String resolveTraceId(WebRequest request) {
        String traceId = request.getHeader("X-Request-Id");
        return (traceId != null && !traceId.isEmpty()) ? traceId : UUID.randomUUID().toString();
    }

    private ErrorResponse buildError(HttpStatus status, String message, WebRequest request, List<String> details) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(request.getDescription(false))
                .details(details)
                .traceId(resolveTraceId()) // ✅ From Micrometer tracing
                .build();
    }



    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, WebRequest request) {
        List<String> details = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.toList());

        ErrorResponse error = buildError(HttpStatus.BAD_REQUEST, "Validation Failed", request, details);
        log.warn("[{}] Validation failed: {}", error.getTraceId(), details);
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleMalformedJson(HttpMessageNotReadableException ex, WebRequest request) {
        ErrorResponse error = buildError(HttpStatus.BAD_REQUEST, "Malformed JSON request", request,
                Collections.singletonList(ex.getMostSpecificCause().getMessage()));
        log.error("[{}] Malformed JSON: {}", error.getTraceId(), ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingParam(MissingServletRequestParameterException ex, WebRequest request) {
        ErrorResponse error = buildError(HttpStatus.BAD_REQUEST, "Missing required parameter", request,
                Collections.singletonList(ex.getMessage()));
        log.warn("[{}] Missing parameter: {}", error.getTraceId(), ex.getParameterName());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoHandler(NoHandlerFoundException ex, WebRequest request) {
        ErrorResponse error = buildError(HttpStatus.NOT_FOUND, "Resource Not Found", request,
                Collections.singletonList(ex.getMessage()));
        log.info("[{}] Resource not found: {}", error.getTraceId(), ex.getRequestURL());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(CustomBusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusiness(CustomBusinessException ex, WebRequest request) {
        ErrorResponse error = buildError(HttpStatus.UNPROCESSABLE_ENTITY, ex.getMessage(), request,
                Collections.singletonList("ErrorCode: " + ex.getErrorCode()));
        log.warn("[{}] Business exception: {}", error.getTraceId(), ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleMaxSize(MaxUploadSizeExceededException ex, WebRequest request) {
        ErrorResponse error = buildError(HttpStatus.PAYLOAD_TOO_LARGE, "File too large!", request,
                Collections.singletonList(ex.getMessage()));
        log.error("[{}] File upload exceeded: {}", error.getTraceId(), ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.PAYLOAD_TOO_LARGE);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAll(Exception ex, WebRequest request) {
        ErrorResponse error = buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", request,
                Collections.singletonList(ex.getMessage()));
        log.error("[{}] Unhandled exception: {}", error.getTraceId(), ex.getMessage(), ex);
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}