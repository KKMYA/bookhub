package com.eni.bookhub.bll.impl;


import com.eni.bookhub.bll.UserService;
import com.eni.bookhub.bo.Account;
import com.eni.bookhub.controller.dto.mapper.UserMapper;
import com.eni.bookhub.controller.dto.response.UserDto;
import com.eni.bookhub.exception.EntityNotFoundException;
import com.eni.bookhub.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final AccountRepository userRepository;
    private final UserMapper userMapper;


    @Override
    public UserDto getUserById(Long id) {
        Account user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("L'utilisateur avec l'ID " + id + " est introuvable."));
        return userMapper.userEntityToUserDto(user);
    }

    @Override
    public UserDto getUserByEmail(String email) {
        Account user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("L'utilisateur avec l'email " + email + " est introuvable."));
        return userMapper.userEntityToUserDto(user);
    }
}
