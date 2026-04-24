package com.eni.bookhub.bll;

import com.eni.bookhub.controller.dto.response.UserDto;

public interface UserService {

   UserDto getUserById(Long id);

   UserDto getUserByEmail(String email);
}
