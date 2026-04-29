package com.eni.bookhub.exception;

import lombok.Getter;

@Getter
public class EntityAlreadyExistsException extends BookhubException {
    private final String entityName;
    private final Object rejectedValue;

    public EntityAlreadyExistsException(String entityName, Object rejectedValue) {
        super(String.format("%s avec la valeur '%s' existe déjà.", entityName, rejectedValue));
        this.entityName = entityName;
        this.rejectedValue = rejectedValue;
    }
}
