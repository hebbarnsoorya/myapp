package com.soorya.file.reader.service;
import com.soorya.file.reader.model.Product;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class ProductExcelService {

    private static final int START_RECORD_INDEX = 2; // Actual data starts from the 3rd row (index 2)
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MM/dd/yyyy");

    // It's a good practice to use a constant for the sheet name
    private static final String PRODUCT_SHEET_NAME = "inputData";

    @Autowired
    private Validator validator;

    public List<Product> readProductsFromExcel(MultipartFile file) throws IOException {
        List<Product> products = new ArrayList<>();
        List<String> validationErrors = new ArrayList<>();

        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {

            //Sheet sheet = workbook.getSheetAt(0);
            Sheet sheet = workbook.getSheet(PRODUCT_SHEET_NAME);

            if (sheet == null) {
                throw new IllegalArgumentException("Sheet '" + PRODUCT_SHEET_NAME + "' not found in the uploaded file.");
            }

            for (int rowIndex = START_RECORD_INDEX; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row == null) {
                    continue; // Skip empty rows
                }

                final int finalRowIndex = rowIndex;
                Product product = parseRowToProduct(row);

                Set<ConstraintViolation<Product>> violations = validator.validate(product);
                if (!violations.isEmpty()) {
                    violations.forEach(violation -> {
                        String errorMessage = String.format("Row %d, Field '%s': %s",
                                finalRowIndex + 1, violation.getPropertyPath(), violation.getMessage());
                        validationErrors.add(errorMessage);
                    });
                } else {
                    products.add(product);
                }
            }
        }

        if (!validationErrors.isEmpty()) {
            throw new IllegalArgumentException("Validation errors found: " + String.join("; ", validationErrors));
        }

        return products;
    }

    private Product parseRowToProduct(Row row) {
        Product product = new Product();
        try {
            product.setPName(getCellValueAsString(row.getCell(0)));
            product.setPTitle(getCellValueAsString(row.getCell(1)));
            product.setPCode(getCellValueAsString(row.getCell(2)));
            product.setOrgName(getCellValueAsString(row.getCell(3)));
            product.setPStartDate(parseDateCell(row.getCell(4)));
            product.setEndDate(parseDateCell(row.getCell(5)));
            product.setReleaseDate(parseDateCell(row.getCell(6)));
        } catch (Exception e) {
            // Handle parsing errors for a specific row
            throw new RuntimeException("Error parsing row " + (row.getRowNum() + 1) + ": " + e.getMessage(), e);
        }
        return product;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return null;
        }
        CellType cellType = cell.getCellType();
        switch (cellType) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                // Handle numeric values that might represent a string (e.g., product code)
                return String.valueOf((long) cell.getNumericCellValue());
            case FORMULA:
                return cell.getStringCellValue().trim();
            default:
                return null;
        }
    }

    private LocalDate parseDateCell(Cell cell) {
        if (cell == null) {
            return null;
        }

        CellType cellType = cell.getCellType();
        switch (cellType) {
            case STRING:
                try {
                    return LocalDate.parse(cell.getStringCellValue().trim(), DATE_FORMATTER);
                } catch (Exception e) {
                    return null;
                }
            case NUMERIC:
                // This is the key change: check cell type before trying to get numeric value
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getLocalDateTimeCellValue().toLocalDate();
                } else {
                    // For numeric cells that are not dates, handle as a potential string
                    return null;
                }
            default:
                return null;
        }
    }
}