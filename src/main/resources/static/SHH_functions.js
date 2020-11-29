class Zone{
    constructor(rooms, periodicTempSetting){
        this.rooms = rooms;
        this.periodicTempSettings = periodicTempSettings;
    }

    // add a room to the zone
    // para should be a string of the room's name
    addRoom(room){
        this.rooms.push(room);
    }

    // add a period to the zone
    addPeriodicTemperatureSetting(startTime, endTime, tempSetting){
        newPeriodicTempSetting = new PeriodicTempSetting(startTime, endTime, tempSetting);
        
        // check conflict
        this.forEach(element => {
            if (element.isOverlapped(newPeriodicTempSetting)) {
                alert("the setting for period conflicts, please choose other period");
                return;
            }
        });

        //push the new element
        this.periodicTempSettings.push(newPeriodicTempSetting)

        alert("All settings have been saved.");
    }

    // TODO check if all periodic temperature setttings can cover the whole day
    isFullyCovered(){

    }
}

class PeriodicTempSetting {
    constructor(startTime, endTime, tempSetting){
        this.startTime = startTime;
        this.endTime = endTime;
        this.tempSetting = tempSetting;
    }

    setStartTime(startTime){
        this.startTime = startTime;
    }

    setEndTime(endTime){
        this.endTime = endTime;
    }
    
    setTempSetting(tempSetting){
        this.tempSetting = tempSetting;
    }

    isOverlapped(periodicTempSetting){
        if ((periodicTempSetting.startTime >= this.startTime && periodicTempSetting.endTime < this.endTime) 
        || (periodicTempSetting.endTime <= this.endTime && periodicTempSetting.startTime > this.startTime)) {
            return true;
        }
        else{
            return false;
        }
    }
}