package com.eni.bookhub.controller;


import com.eni.bookhub.bll.CategoryService;
import com.eni.bookhub.controller.dto.response.BookSumaryDto;
import com.eni.bookhub.controller.dto.response.CategoryDto;
import com.eni.bookhub.controller.dto.response.PaginatedFilesDto;
import com.eni.bookhub.repository.CategoryRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping()
    @CrossOrigin(origins = "http://localhost:4200")
    @Operation(
            tags = "Bookhub",
            summary = "Tous les livres",
            description = "Récupération de tous les livres"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Get a list of book"),
            @ApiResponse(responseCode = "204", description = "No content"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error")
    })
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        List<CategoryDto> allCategories = categoryService.getAllCategories();
        if (allCategories.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return new ResponseEntity<>(allCategories, HttpStatus.OK);
    }
}
