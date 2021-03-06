package com.soen343.backend.dao;

import com.soen343.backend.exceptions.UserNotFoundException;
import com.soen343.backend.factory.UserTypeFactory;
import com.soen343.backend.model.User;
import com.soen343.backend.utilities.UserPermissions;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * A Repository of the Users that are Registered to the Simulation and related business logic
 */
@Repository("userDao")
public class UserDataAccessService implements UserDAO {

    private List<User> DB = new ArrayList<>();
    final private UserTypeFactory userTypeFactory = new UserTypeFactory();

    /**
     * Adds a new User to the database list
     * @param id Unique Id that is assigned to the new user
     * @param user A User Model to insert into the database list
     * @return an integer. 1 if the operation of succesful and 0 if it fails
     */
    @Override
    public int insertUser(UUID id, User user) {

        String roleType = user.getRole();

        DB.add(userTypeFactory.getUser(id, roleType));
        return 1;
    }

    /**
     *  A Getter for All Users models currently stored
     * @return A List of All Users registered
     */
    public List<User> selectAllUsers() {

        return DB;
    }

    /**
     * A Getter to find a specific user with their id
     * @param id Unique Id to identify the user to select
     * @return An Optional User if found with the provided id
     */
    @Override
    public Optional<User> selectUserById(UUID id) {
        return DB.stream()
                .filter(user -> user.getId().equals(id))
                .findFirst();
    }

    /**
     * Deletes the specific user identified by an id
     * @param id Unique Id to identify the user to delete
     * @return an Integer, 1 if no user was found and the operation fails or 1 if the operating is successful
     */
    @Override
    public int deleteUserById(UUID id) throws UserNotFoundException {
        Optional<User> user = selectUserById(id);

        if(user.isEmpty())
        {
            throw new UserNotFoundException("User to delete not found"); // indicates that no user was found and deleted
        }

        DB.remove(user.get());
        return 1;
    }

    /**
     * An method to update the role of a user that already exists
     * @param id Unique Id to identify the user to update
     * @param updateUser a user Model with new values to replace the old one with
     * @return an Integer, 1 if no user was found and the operation fails or 1 if the operating is successful
     */
    @Override
    public int updateUserById(UUID id, User updateUser) {
        return selectUserById(id)
                .map(user -> {
                    int indexOfUserToUpdate = DB.lastIndexOf(user);
                    if(indexOfUserToUpdate >= 0) // we have found a person
                    {
                        DB.set(indexOfUserToUpdate, userTypeFactory.getUser(id, updateUser.getRole())); // set contents of the person to new person that was just received
                        return 1;
                    }
                    return 0;
                })
                .orElse(0);
    }

    /**
     * Logs in user with specified Id and logs out the currently logged user
     * @param id Unique Id to identify the user to update
     * @return an Integer, 1 if no user was found and the operation fails or 1 if the operating is successful
     */
    @Override
    public int loginUser(UUID id) throws UserNotFoundException {

        Optional<User> userToLogIn = selectUserById(id);

        if(userToLogIn.isEmpty())
        {
            throw new UserNotFoundException("User to login not found"); // indicates that no user was found and no action was taken
        }
        Optional<User> currentLoggedInUser = findCurrentLoggedInUser();

        if(!currentLoggedInUser.isEmpty())
        {
            // log out the current user
            currentLoggedInUser.get().setLoggedUser(false);
        }

        // log in new user
        userToLogIn.get().setLoggedUser(true);

        return 1;
    }

    /**
     * Finds the User such that their current logged in status is true
     * @return an Optional User if it is found, if any user is logged in
     */
    @Override
    public Optional<User> findCurrentLoggedInUser() {
        return DB.stream()
                .filter(user -> user.getIsLoggedUser() == true)
                .findFirst();
    }

    /**
     * Updated the Location of a specific user
     * @param id Unique Id to identify the user to update
     * @param location A String representing their new location
     * @return an Integer, 1 if no user was found and the operation fails or 1 if the operating is successful
     */
    @Override
    public int setUserLocation(UUID id, String location) throws UserNotFoundException {

        Optional<User> user = selectUserById(id);

        if(user.isEmpty())
        {
            throw new UserNotFoundException("User not found to set location");
            // indicates that no user was found and no action was taken
        }

        user.get().setLocation(location);
        return 1;
    }

    /**
     * Change the permissions of a given user
     * @param id Unique Id to identify the user to update
     * @param permission String value of the setting that needs new permissions
     * @param value boolean: true if enabled, false if disabled
     * @return int 1 if successful and 0 if failed or no change
     */
    @Override
    public int grantUserPermissions(UUID id, String permission, boolean value) throws UserNotFoundException
    {
        Optional<User> user = findCurrentLoggedInUser();
        Optional<User> userToGetPermissions = selectUserById(id);
        if(user.isEmpty() || userToGetPermissions.isEmpty())
        {
            throw new UserNotFoundException("User not found when granting permission");
        }

        if(user.get().grantPermissions(userToGetPermissions.get(), permission, value))
        {
            return 1;
        }

        return 0;
    }

    /**
     *
     * @param id
     * @return
     */
    @Override
    public UserPermissions getUserPermissions(UUID id) {
        UserPermissions userPermissions = null;
        Optional<User> user = selectUserById(id);
        if(!user.isEmpty())
        {
            userPermissions = user.get().getUserPermissions();
        }
        return userPermissions;
    }

    @Override
    public UserPermissions getCurrentUserPermissions() {
        return findCurrentLoggedInUser().get().getUserPermissions();
    }
}
