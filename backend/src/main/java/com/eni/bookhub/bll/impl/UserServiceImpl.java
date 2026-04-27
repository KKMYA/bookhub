package com.eni.bookhub.bll.impl;


import com.eni.bookhub.bll.UserService;
import com.eni.bookhub.bo.Account;
import com.eni.bookhub.controller.dto.mapper.UserMapper;
import com.eni.bookhub.controller.dto.request.PasswordUpdateRequest;
import com.eni.bookhub.controller.dto.response.UserDto;
import com.eni.bookhub.exception.BookhubException;
import com.eni.bookhub.exception.EntityNotFoundException;
import com.eni.bookhub.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final AccountRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;


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

    @Override
    public UserDto updateUser(UserDto userDto) {
        Account user = userRepository.findById(userDto.id())
                .orElseThrow(() -> new EntityNotFoundException("L'utilisateur avec l'ID " + userDto.id() + " est introuvable."));
        
        user.setNom(userDto.nom());
        user.setPrenom(userDto.prenom());
        user.setEmail(userDto.email());
        user.setTelephone(userDto.telephone());
        
        Account updatedUser = userRepository.save(user);
        return userMapper.userEntityToUserDto(updatedUser);
    }

    @Override
    public void updatePassword(String email, PasswordUpdateRequest request) {
        Account user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("L'utilisateur avec l'email " + email + " est introuvable."));

        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            throw new BookhubException("Ancien mot de passe incorrect.");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }
}
