package com.eni.bookhub.exception;

import lombok.Getter;

@Getter
public class EntityNotFoundException extends BookhubException {

    private final String entityName;
    private final Object entityId;

    public EntityNotFoundException(String entityName, Object entityId) {
        super(String.format("%s avec l'identifiant [%s] n'existe pas.", entityName, entityId));
        this.entityName = entityName;
        this.entityId = entityId;
    }
}