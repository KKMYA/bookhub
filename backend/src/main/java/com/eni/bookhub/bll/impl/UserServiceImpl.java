package com.eni.bookhub.bll.impl;


import com.eni.bookhub.bll.UserService;
import com.eni.bookhub.bo.Account;
import com.eni.bookhub.controller.dto.response.UserDto;
import com.eni.bookhub.exception.EntityNotFoundException;
import com.eni.bookhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;


    @Override
    public UserDto getUserById(int id) {
        return null;
//        Account user = userRepository.findById(id)
//                .orElseThrow(() -> new EntityNotFoundException("L'utilisateur avec l'ID " + id + " est introuvable."));
//        return userMapper.userEntityToUserDto(user);
    }
}
