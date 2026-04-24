package com.eni.bookhub.controller.dto.mapper;

import com.eni.bookhub.bo.Account;
import com.eni.bookhub.bo.Book;
import com.eni.bookhub.controller.dto.request.BookDto;
import com.eni.bookhub.controller.dto.response.UserDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto userEntityToUserDto(Account user);

}
