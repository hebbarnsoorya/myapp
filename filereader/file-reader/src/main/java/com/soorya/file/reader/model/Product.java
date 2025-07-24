package com.soorya.file.reader.model;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class Product {

    @NotBlank(message = "Product name cannot be null or empty")
    @Size(min = 5, max = 9, message = "Product name must be 5 or 9 characters long")
    @JsonProperty("pName")
    private String pName;

    @JsonProperty("pTitle")
    private String pTitle;

    @NotBlank(message = "Product code cannot be null or empty")
    @Size(min = 6, max = 6, message = "Product code must be exactly 6 characters long")
    @JsonProperty("pCode") // Explicitly set the JSON key
    private String pCode;

    private String orgName; // No change needed

    @NotNull(message = "Start date cannot be null")
    @DateTimeFormat(pattern = "MM/dd/yyyy")
    @Past(message = "Start date must be in the past")
    @JsonProperty("pStartDate") // Explicitly set the JSON key
    private LocalDate pStartDate;

    @NotNull(message = "End date cannot be null")
    @DateTimeFormat(pattern = "MM/dd/yyyy")
    private LocalDate endDate; // No change needed

    @NotNull(message = "Release date cannot be null")
    @DateTimeFormat(pattern = "MM/dd/yyyy")
    @Future(message = "Release date must be in the future")
    private LocalDate releaseDate; // No change needed
}
