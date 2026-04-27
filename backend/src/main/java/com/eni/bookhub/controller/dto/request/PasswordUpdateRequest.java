package com.eni.bookhub.controller.dto.request;

import jakarta.validation.constraints.NotBlank;

public record PasswordUpdateRequest(
    @NotBlank String oldPassword,
    @NotBlank String newPassword
) {
}
