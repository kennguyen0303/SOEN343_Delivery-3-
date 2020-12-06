package com.soen343.backend.utilities;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Utility class to organize permissions by user
 */
public class UserPermissions {

    // Access to open/close all windows
    @JsonProperty("openAllWindows")
    private  boolean canOpenAllWindows;

    // Access to lock/unlock all doors
    @JsonProperty("lockDoors")
    private boolean canLockDoors;

    // Access to open/close all lights
    @JsonProperty("useAllLights")
    private boolean canUseLights;

    // Access to open/close windows in same room
    @JsonProperty("useRestrictedWindows")
    private boolean canOpenRestrictedWindow;

    // Access to open/close lights in same room
    @JsonProperty("useRestrictedLights")
    private boolean canUseRestrictedLights;

    // Access to set away mode on and off
    @JsonProperty("canSetAwayMode")
    private boolean canSetAwayMode;

    @JsonProperty("canDefineZones")
    private boolean canDefineZones;

    @JsonProperty("canOverrideAllTemperatures")
    private boolean canOverrideAllTemperatures;


    @JsonProperty("canOverrideRestrictedTemperature")
    private boolean canOverrideRestrictedTemperature;

    /**
     * Constructor to initialize user permissions to default
     */
    public UserPermissions() {
        canOpenAllWindows = false;
        canLockDoors = false;
        canUseLights = false;
        canOpenRestrictedWindow = false;
        canUseRestrictedLights = false;
        canSetAwayMode = false;
        canDefineZones = false;
        canOverrideAllTemperatures = false;
        canOverrideRestrictedTemperature = false;
    }

    public void setAsChild(){
        this.canOpenAllWindows = false;
        this.canLockDoors = false;
        this.canUseLights = false;
        this.canOpenRestrictedWindow = true;
        this.canUseRestrictedLights = true;
        this.canSetAwayMode = false;
        this.canDefineZones = false;
        this.canOverrideAllTemperatures = false;
        this.canOverrideRestrictedTemperature = false;
    }

    public void setAsParent(){
        this.canOpenAllWindows = true;
        this.canLockDoors = true;
        this.canUseLights = true;
        this.canOpenRestrictedWindow = true;
        this.canUseRestrictedLights = true;
        this.canSetAwayMode = true;
        this.canDefineZones = true;
        this.canOverrideAllTemperatures = true;
        this.canOverrideRestrictedTemperature = true;
    }

    public void setAsGuest(){
        this.canOpenAllWindows = false;
        this.canLockDoors = false;
        this.canUseLights = false;
        this.canOpenRestrictedWindow = true;
        this.canUseRestrictedLights = true;
        this.canSetAwayMode = false;
        this.canDefineZones = false;
        this.canOverrideAllTemperatures = false;
        this.canOverrideRestrictedTemperature = true;
    }

    /**
     * Getter for all window permissions
     * @return boolean if user has access to open/close all windows
     */
    public boolean getCanOpenAllWindows() {
        return canOpenAllWindows;
    }

    /**
     * Setter for all window permissions
     * @param canOpenAllWindows boolean if user has access to open/close all windows
     */
    public void setCanOpenAllWindows(boolean canOpenAllWindows) {
        this.canOpenAllWindows = canOpenAllWindows;
    }

    /**
     * Getter for all door permissions
     * @return boolean if user has access to open/close all doors
     */
    public boolean getCanLockDoors() {
        return canLockDoors;
    }

    /**
     * Setter for all door permissions
     * @param canLockDoors boolean if user has access to open/close all doors
     */
    public void setCanLockDoors(boolean canLockDoors) {
        this.canLockDoors = canLockDoors;
    }

    /**
     * Getter for all light permissions
     * @return boolean if user has access to open/close all lights
     */
    public boolean getCanUseLights() {
        return canUseLights;
    }

    /**
     * Setter for all light permissions
     * @param canUseLights boolean if user has access to open/close all lights
     */
    public void setCanUseLights(boolean canUseLights) {
        this.canUseLights = canUseLights;
    }

    /**
     * Getter for restricted windows permissions
     * @return boolean if user has access to open/close windows in same room
     */
    public boolean getCanOpenRestrictedWindow() {
        return canOpenRestrictedWindow;
    }

    /**
     * Setter for restricted windows permissions
     * @param canOpenRestrictedWindow boolean if user has access to open/close windows in same room
     */
    public void setCanOpenRestrictedWindow(boolean canOpenRestrictedWindow) {
        this.canOpenRestrictedWindow = canOpenRestrictedWindow;
    }

    /**
     * Getter for restricted lights permissions
     * @return boolean if user has access to open/close lights in same room
     */
    public boolean getCanUseRestrictedLights() {
        return canUseRestrictedLights;
    }

    /**
     * Getter for restricted windows permissions
     * @param canUseRestrictedLights boolean if user has access to open/close lights in same room
     */
    public void setCanUseRestrictedLights(boolean canUseRestrictedLights) {
        this.canUseRestrictedLights = canUseRestrictedLights;
    }

    public boolean getCanSetAwayMode() {
        return canSetAwayMode;
    }

    public void setCanSetAwayMode(boolean canSetAwayMode) {
        this.canSetAwayMode = canSetAwayMode;
    }

    public boolean getCanOverrideRestrictedTemperature() {
        return canOverrideRestrictedTemperature;
    }

    public void setCanOverrideRestrictedTemperature(boolean canOverrideRestrictedTemperature) {
        this.canOverrideRestrictedTemperature = canOverrideRestrictedTemperature;
    }

    public boolean getCanOverrideAllTemperatures() {
        return canOverrideAllTemperatures;
    }

    public void setCanOverrideAllTemperatures(boolean canOverrideAllTemperatures) {
        this.canOverrideAllTemperatures = canOverrideAllTemperatures;
    }

    public boolean getCanDefineZones() {
        return canDefineZones;
    }

    public void setCanDefineZones(boolean canDefineZones){
        this.canDefineZones =  canDefineZones;
    }
}
