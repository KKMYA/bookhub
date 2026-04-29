package com.eni.bookhub.bll;

import com.eni.bookhub.controller.dto.request.PasswordUpdateRequest;
import com.eni.bookhub.controller.dto.response.UserDto;

import java.util.List;

public interface UserService {

   UserDto getUserById(Long id);

   UserDto getUserByEmail(String email);

   UserDto updateUser(UserDto userDto);

   UserDto updateUserByAdmin(UserDto userDto);

   UserDto createUserByAdmin(com.eni.bookhub.controller.dto.request.RegisterRequestByAdmin request);

   void updatePassword(String email, PasswordUpdateRequest request);

   List<UserDto> getAllUsers();

   void deleteUser(Long id);
}
