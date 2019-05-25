package it.polito.ai.pedibus.api.services;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "recovery token not found")
public class RecoveryTokenNotFoundException extends Exception {
    public RecoveryTokenNotFoundException(){
        super();
    }
}
