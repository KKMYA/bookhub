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

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final AccountRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;


    @Override
    public UserDto getUserById(Long id) {
        Account user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("user", id));
        return userMapper.userEntityToUserDto(user);
    }

    @Override
    public UserDto getUserByEmail(String email) {
        Account user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("L'utilisateur", email));
        return userMapper.userEntityToUserDto(user);
    }

    @Override
    public UserDto updateUser(UserDto userDto) {
        Account user = userRepository.findById(userDto.id())
                .orElseThrow(() -> new EntityNotFoundException("L'utilisateur", userDto.id()));

        user.setNom(userDto.nom());
        user.setPrenom(userDto.prenom());
        user.setTelephone(userDto.telephone());
        
        Account updatedUser = userRepository.save(user);
        return userMapper.userEntityToUserDto(updatedUser);
    }

    @Override
    public UserDto updateUserByAdmin(UserDto userDto) {
        if (userDto.id() == null) {
            throw new BookhubException("L'ID de l'utilisateur est obligatoire pour la mise à jour.");
        }

        Account user = userRepository.findById(userDto.id())
                .orElseThrow(() -> new EntityNotFoundException("L'utilisateur", userDto.id()));

        // Vérification email unique si changé
        if (!user.getEmail().equals(userDto.email()) && userRepository.findByEmail(userDto.email()).isPresent()) {
            throw new BookhubException("Cet email est déjà utilisé par un autre compte.");
        }

        user.setNom(userDto.nom());
        user.setPrenom(userDto.prenom());
        user.setEmail(userDto.email());
        user.setTelephone(userDto.telephone());

        if (userDto.role() != null) {
            try {
                user.setRole(com.eni.bookhub.bo.Role.valueOf(userDto.role().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new BookhubException("Rôle invalide : " + userDto.role());
            }
        }

        Account updatedUser = userRepository.save(user);
        return userMapper.userEntityToUserDto(updatedUser);
    }

    @Override
    public UserDto createUserByAdmin(com.eni.bookhub.controller.dto.request.RegisterRequestByAdmin request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new BookhubException("Cet email est déjà utilisé.");
        }

        Account user = Account.builder()
                .nom(request.nom())
                .prenom(request.prenom())
                .email(request.email())
                .telephone(request.telephone())
                .password(passwordEncoder.encode(request.password()))
                .role(com.eni.bookhub.bo.Role.valueOf(request.role().toUpperCase()))
                .build();

        Account savedUser = userRepository.save(user);
        return userMapper.userEntityToUserDto(savedUser);
    }

    @Override
    public void updatePassword(String email, PasswordUpdateRequest request) {
        Account user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("L'utilisateur avec l'email ", email ));

        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            throw new BookhubException("Ancien mot de passe incorrect.");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::userEntityToUserDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("L'utilisateur avec l'ID ", id );
        }
        userRepository.deleteById(id);
    }
}
