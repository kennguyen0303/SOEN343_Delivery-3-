package com.soen343.backend.exceptions;

public class UserNotFoundException extends Exception{

    public UserNotFoundException(String msg){
        super(msg);
    }
}
