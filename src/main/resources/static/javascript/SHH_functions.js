class Zone{
    constructor(zoneID, rooms, periodicTempSettings){
        this.zoneID = zoneID;
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

    // TODO set default temperature for uncovered periods
    setDefaultTemperature(){
        // TODO the default temperature will be 24.0
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

class SHH{
    constructor(outdoorTemp){
        this.outdoorTemp = outdoorTemp;
    }

    getAllZones(){
        return zones;
    }

    getZoneById(id){
        this.forEach(zone => {
            if (zone.zoneID == id) {
                return zone;
            }
        });
        alert("the zone is not found, please the ID.");
    }

    addZone(newZone){
        this.zones.push(newZone);
    }

    deleteZoneById(id){
        for (let i = 0; i < this.zones.length; i++) {
            const zone = this.zones[i];
            if (zone.zoneID == id) {
                this.splice(i, 1);
                return;
            }
        }
        alert("Operation failed, no such a zone found");
    }
}

// submit zones settings
function submitZones(){
    $('#zoneModal').modal('hide');
}

// submit temperature settings
function submitTemps(){
    $('#tempModal').modal('hide');
}