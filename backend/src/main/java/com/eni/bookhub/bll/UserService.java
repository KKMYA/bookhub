package com.eni.bookhub.bll;

import com.eni.bookhub.controller.dto.response.UserDto;

public interface UserService {

   UserDto getUserById(int id);
}
