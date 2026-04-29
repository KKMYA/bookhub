package com.eni.bookhub.bll.impl;

import com.eni.bookhub.bll.CategoryService;
import com.eni.bookhub.bo.Category;
import com.eni.bookhub.controller.dto.mapper.CategoryMapper;
import com.eni.bookhub.controller.dto.response.CategoryDto;
import com.eni.bookhub.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public List<CategoryDto> getAllCategories() {

        List<Category> allCategories = categoryRepository.findAll();
        return   allCategories.stream()
                .map(categoryMapper::categoryEntityToCategoryDto)
                .toList();
    }
}
