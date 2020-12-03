package com.soen343.backend.exceptions;

import com.soen343.backend.dao.UserDAO;
import com.soen343.backend.dao.UserDataAccessService;
import com.soen343.backend.model.Parent;
import com.soen343.backend.model.User;
import com.soen343.backend.strategy.GrantPermissions;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class UserNotFoundExceptionTest {

    @Test
    public void loginUser(){
        UserDataAccessService userDAO = new UserDataAccessService();
        UUID id = UUID.randomUUID();
        User user = new User(id, "parent", new GrantPermissions());
        userDAO.insertUser(user);

        UUID newId = UUID.randomUUID();
        assertThrows(UserNotFoundException.class, () -> {userDAO.loginUser(newId);});
    }

    @Test
    public void deleteUser(){
        UserDataAccessService userDAO = new UserDataAccessService();
        UUID id = UUID.randomUUID();
        User user = new User(id, "parent", new GrantPermissions());
        userDAO.insertUser(user);

        UUID newId = UUID.randomUUID();
        assertThrows(UserNotFoundException.class, () -> {userDAO.deleteUserById(newId);});
    }
}