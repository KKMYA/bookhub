package com.eni.bookhub.bll;

import com.eni.bookhub.controller.dto.request.PasswordUpdateRequest;
import com.eni.bookhub.controller.dto.response.UserDto;

public interface UserService {

   UserDto getUserById(Long id);

   UserDto getUserByEmail(String email);

   UserDto updateUser(UserDto userDto);

   void updatePassword(String email, PasswordUpdateRequest request);
}
