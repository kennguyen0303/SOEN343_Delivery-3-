class Zone{
    constructor(zoneID){
        this.zoneID = zoneID;
        this.rooms = new Array();
        this.periodicTempSettings = new Array();
    }

    // add a room to the zone
    // para should be a string of the room's name
    addRoom(room){
        this.rooms.push(room);
    }

    getAllRooms(){
        return this.rooms;
    }

    resetRooms(){
        // delete all rooms
        while (this.rooms.length > 0) {
            this.rooms.splice(0, 1)
        }
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
        this.zones = new Array();
        for (let i = 0; i < 6; i++) {
            var zone = new Zone(i);
            this.zones.push(zone);
        }
        //zones[0] is for unset rooms
    }

    getOutdoorTemp(){
        return this.outdoorTemp;
    }

    setOutdoorTemp(outdoorTemp){
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
        alert("the zone is not found, please check the ID.");
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

var shh = new SHH('15.5');

// set the outside temperature according to user's input
function submitOutsideTemp(){
    var outsideTemp = prompt('Please enter the value for outside temperature:');
    console.log(outsideTemp);

    var tempElement = document.getElementById('outsideTemp');
    if(isNaN(outsideTemp)){
        alert("invalid input, temperature value will be restored");
        // tempElement.innerHTML = shh.getOutdoorTemp();
    }
    else if(outsideTemp > 60 || outsideTemp < -90){
        alert("This temperature has never been observed on earth");
    }
    else{
        shh.setOutdoorTemp(outsideTemp);
        tempElement.innerHTML = outsideTemp;
        alert("The outside temperature has been updated successfully.");
    }
}

// submit zones settings
function submitZones(){

    // collect all room-zone pairs
    var roomZones = new Array();
    var zoneSelections = document.getElementsByClassName('form-control');
    var roomLabels = document.getElementsByClassName('roomLabel');
    for (let i = 0; i < zoneSelections.length; i++) {
        var index = zoneSelections[i].selectedIndex;
        var roomID = zoneSelections[i].options[index].value;
        var roomName = roomLabels[i].innerHTML;
        roomZones[roomName] = roomID;
    }

    //delete all rooms
    for (let i = 0; i < shh.zones.length; i++) {
        shh.zones[i].resetRooms()
    }

    //add selected rooms for each zone
    room_array.forEach(room => {
        if (room.getName() == 'hallway') {
            shh.zones[roomZones['hallway']].addRoom(room);
        }
        if (room.getName() == 'garage') {
            shh.zones[roomZones['garage']].addRoom(room);
        }
        if (room.getName() == 'kitchen') {
            shh.zones[roomZones['kitchen']].addRoom(room);
        }
        if (room.getName() == 'bedroom') {
            shh.zones[roomZones['bedroom']].addRoom(room);
        }
        if (room.getName() == 'bathroom') {
            shh.zones[roomZones['bathroom']].addRoom(room);
        }
    });

    // TODO start monitor temperature under new settings

    // close zone modal
    for (let i = 0; i < shh.zones.length; i++) {
        console.log(shh.zones[i].rooms);
        
    }
    $('#zoneModal').modal('hide');
}

// submit temperature settings
function submitTemps(){
    var errorMsgs;

    // TODO validate period overlap

    // TODO validate within one day

    // TODO validate temperature setting

    // TODO set the zones of the SHH as required

    // TODO start monitor temperature under new settings

    // success senario
    if (errorMsgs == null) {
        alert(displayErrorMsg(errorMsgs));
        $('#tempModal').modal('hide');
    }
}

// alert all error messages to the user
function displayErrorMsg(errorMsgs){
    var output = '';
    errorMsgs.forEach(errorMsg => {
        output += "Error 1: " + errorMsg + "\n";
    });
    return output;
}