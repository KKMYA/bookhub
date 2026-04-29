package com.eni.bookhub.controller.dto.mapper;

import com.eni.bookhub.bo.Category;
import com.eni.bookhub.controller.dto.response.CategoryDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    CategoryDto categoryEntityToCategoryDto(Category category);

}