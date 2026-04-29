package com.eni.bookhub.controller.dto.mapper;

import com.eni.bookhub.bo.Account;
import com.eni.bookhub.controller.dto.response.UserDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "idAccount", target = "id")
    @Mapping(source = "role", target = "role")
    UserDto userEntityToUserDto(Account user);

}
