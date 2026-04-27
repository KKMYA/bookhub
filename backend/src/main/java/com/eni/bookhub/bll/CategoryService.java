package com.eni.bookhub.bll;

import com.eni.bookhub.controller.dto.response.CategoryDto;

import java.util.List;

public interface CategoryService {

    List<CategoryDto> getAllCategories();
}
