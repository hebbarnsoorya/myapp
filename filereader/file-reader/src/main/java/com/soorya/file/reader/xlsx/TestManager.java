package com.soorya.file.reader.xlsx;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class TestManager {




        public static void main11(String[] args) {
            String date1 = "07/29/2025"; // String in MM/dd/yyyy format
            LocalDate date2 = LocalDate.now(); // or any LocalDate

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
            try {
                LocalDate parsedDate1 = LocalDate.parse(date1, formatter);
                if (parsedDate1.isBefore(date2)) {
                    System.out.println("YES : Date isBefore(): ");
                }
                // Compare using isEqual, isBefore, isAfter
                if (parsedDate1.isEqual(date2)) {
                    System.out.println("Dates are equal");
                } else if (parsedDate1.isBefore(date2)) {
                    System.out.println("date1 is before date2");
                } else {
                    System.out.println("date1 is after date2");
                }

                // Or use compareTo
                int result = parsedDate1.compareTo(date2);
                System.out.println("compareTo result: " + result);
                // result < 0 => date1 before date2
                // result == 0 => equal
                // result > 0 => date1 after date2

            } catch (DateTimeParseException e) {
                System.err.println("Invalid date format: " + date1);
            }
        }
    }


