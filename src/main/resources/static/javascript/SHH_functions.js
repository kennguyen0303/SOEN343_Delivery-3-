// **************************

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

    getPeriodicTempSettings(){
        return this.periodicTempSettings;
    }

    resetRooms(){
        // delete all rooms
        while (this.rooms.length > 0) {
            this.rooms.splice(0, 1)
        }
    }
}

class PeriodicTempSetting {
    constructor(id, startTime, endTime, tempSetting){
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.tempSetting = tempSetting;
    }

    getPeriodID(){
        return this.id;
    }

    getStartTime(){
        return this.startTime;
    }

    getEndTime(){
        return this.endTime;
    }

    getTempSetting(){
        return this.tempSetting;
    }

    setPeriodID(id){
        this.id = id;
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
}

// Temperature Monitoring
class HAVCStates{
    static states = {
      PAUSED: 'paused',
      RUNNING: 'running',
      STOPPED: 'stopped'
    }
}

var heatingComponents = new Array();

class HAVCController{

    constructor(newZone,outdoorTemp,awaymode){
        this.zone = newZone;
        this.id = newZone.zoneID;
        this.awayModeStatus=awaymode;//get the status from the SHH
        this.state = HAVCStates.states.PAUSED;
        this.outsideTemperature=outdoorTemp;
    }

    monitorTemperature(){
        // var outsideTemperature = document.getElementById('outsideTemp').innerHTML;
        // outsideTemperature=parseFloat(outsideTemperature);
        var outsideTemperature=this.outsideTemperature;
        //console.log("Monitor temperature outside have: "+outsideTemperature);
        var tempSettings = (this.zone).getPeriodicTempSettings();
        var idealTemperature = 18;
        //console.log(tempSettings);

        if(tempSettings != null){
            for(let i = 0; i<tempSettings.length; i++){
                //console.log(tempSetting[i].getStartTime()+" "+tempSettings[i].getEndTime());
                var isTime = (varCurrentTime.getHours() > tempSettings[i].getStartTime()) && (tempSettings[i].getEndTime() < varCurrentTime.getHours()) ;
                if(isTime){
                    idealTemperature = tempSettings[i].getTempSetting();
                }
            }
        }

        var rooms = this.zone.getAllRooms();
        for(let i = 0; i< rooms.length; i++){
            //console.log(rooms[i].getTemperature());
            var room = rooms[i];

            // check if windows have been closed since last temperature reading
            if(this.state == HAVCStates.states.STOPPED){
                 var index = rooms[i].window_index_array();
                 if( window_index_array[index].status == 'closed'){
                    this.state = HAVCStates.states.RUNNING;
                 }
            }

            // adjust temperature if the simulation is not stopped
            if(this.state != HAVCStates.states.STOPPED){
                var temperatureInRoom = rooms[i].getTemperature();
                this.setHAVCState(idealTemperature, temperatureInRoom);

                if(this.state == HAVCStates.states.RUNNING){
                   var increase = (idealTemperature > temperatureInRoom);
                   //console.log(increase);
                   this.updateRoomTemperature(increase, 0.1, room);
                }
                else if(this.state == HAVCStates.states.PAUSED){
                    var increase = (outsideTemperature > temperatureInRoom);
                    this.updateRoomTemperature(increase, 0.05, room);
                }
            }

            this.monitorPipes(temperatureInRoom);
            this.monitorWindows(temperatureInRoom, outsideTemperature, room);
        }
        var heater = this;
        setTimeout(function(){heater.monitorTemperature()}, temperatureTimeout);
    }

    monitorPipes(temperatureInRoom){
        if(temperatureInRoom == 0){
            // output to console
            var consoleNode = document.createElement("p");
            var text = "Caution! Temperature below zero. Pipes may burst."
            var textNode =  document.createTextNode(text);
            consoleNode.appendChild(textNode);
            document.getElementById("outputConsole").appendChild(consoleNode);

           // write to output log
           writeToFile(text);
        }
    }

    monitorWindows(temperatureInRoom, outsideTemperature, room){
        if(temperatureInRoom >= outsideTemperature){
            this.openWindowsInSummer(room);
        }
    }

    setHAVCState(idealTemperature, temperatureInRoom)
    {
        if(Math.abs(idealTemperature - temperatureInRoom) > 1){
            this.state = HAVCStates.states.RUNNING;
        }
        else if(Math.abs(idealTemperature - temperatureInRoom) >= 0.25){
            this.state = HAVCStates.states.RUNNING;
        }
        else if(idealTemperature == temperatureInRoom){
            this.state = HAVCStates.states.PAUSED;
        }
    }

    openWindowsInSummer(room){
         var seasonNum = varCurrentTime.getMonth();
         var isSummer = false;
         for(let i=0; i < summer_month.length ; i++){
            if(seasonNum == summer_month[i]){
                isSummer = true;
            }
         }

         if(isSummer){
             if(shp_observer.getAwayMode() == 'OFF'){
                this.state = HAVCStates.states.STOPPED;
                room.openWindow(); // no parameters opens all windows in room
                //shp_observer.getAwayMode() gonna replace line 184
             }
         }
     }

    updateRoomTemperature(increase, rate, room){
        var currentTemp =  room.temperature;
       if(this.state != HAVCStates.states.PAUSED || currentTemp != outsideTemp){
          var tempPlus= Math.round((currentTemp + rate)*1e12)/1e12;
          var tempMinus=Math.round((currentTemp - rate)*1e12)/1e12;
          room.temperature = increase ? tempPlus: tempMinus;
       }
       for(var i=0;i<HVAC_array.length;i++){
        HVAC_array[i].updateStatus(this);
        HVAC_array[i].update();
       }
    }
    /**
     * update the outdoor temperature from SHH
     * @param {} val 
     */
    updateOutsideTemp(val){
        this.outsideTemperature=val;
    }
    /**
     * update the away mode status from the SHH
     * @param {*} msg 
     */
    updateAwayModeStatus(msg){
        this.awayModeStatus=msg;
    }
    /**
     * return the away mode
     */
    getAwayModeStatus(){
        return this.awayModeStatus;
    }
}

class SHH{
    constructor(outdoorTemp){
        this.awayMode="OFF";//assuming OFF initially
        this.outdoorTemp = outdoorTemp;
        this.zones = new Array();
        for (let i = 0; i < 6; i++) {
            var zone = new Zone(i);
            this.zones.push(zone);

        // temperature monitoring
        var heater = new HAVCController(zone,outdoorTemp,this.awayMode);
        heater.monitorTemperature();
        heatingComponents.push(heater);
        }
        //zones[0] is for unset rooms
    }

    getOutdoorTemp(){
        return this.outdoorTemp;
    }
    /**
     * update the outdoor temp for this SHH and all the heaters
     * @param {*} outdoorTemp 
     */
    setOutdoorTemp(outdoorTemp){
        this.outdoorTemp = outdoorTemp;
        try {
            heatingComponents.forEach(heater => {
                heater.updateOutsideTemp(outdoorTemp);
                console.log("Updating outdoor for heater: "+outdoorTemp);
            });
        } catch (error) {
            console.log(error);
        }
    }
    /**
     * Update the away mode status when there is a change
     * Also update the status for all heater components
     * @param {*} msg 
     */
    setAwayMode(msg){
        this.awayMode=msg;
        heatingComponents.forEach(heater => {
            
        });
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

        // temperature monitoring
        // var heater = new HAVCController(newZone);
        // heater.startMonitoring();
        // heatingComponents.push(heater);
    }

    deleteZoneById(id){
        for (let i = 0; i < this.zones.length; i++) {
            const zone = this.zones[i];
            if (zone.zoneID == id) {
                this.zones.splice(i, 1);

                // remove associated heater component
                if(this.heaterComponents[i].id == id){
                    this.heaterComponents.splice(i, 1);
                }
                return;
            }
        }

        alert("Operation failed, no such a zone found");
    }


    getHeatingComponents(){
        return heatingComponents;
    }

}
//-----DEFINING OBJECTS------------
var shh = new SHH('15.5');
var shc_observer=new SHC_observer(shh);
var shc_Subject = new SHC_Subject();
shc_Subject.addObserver(shc_observer);//add the observer
var shp_observer=new SHP_observer(shh);
var shp_Subject = new SHP_Subject();

// set the outside temperature according to user's input
function submitOutsideTemp(){
    var outsideTemp = prompt('Please enter the value for outside temperature:');

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

    // set the options as stored data
    for (let i = 0; i < shh.zones.length; i++) {
        const zone = shh.zones[i];
        if (zone.getAllRooms() != null) {
            for (let i = 0; i < zone.rooms.length; i++) {
                const room = zone.rooms[i];
                var tagID = room.getName() + 'Select';
                document.getElementById(tagID).options[i].setAttribute('selected', true);
            }
        }
    }

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
    $('#zoneModal').modal('hide');
}

//fill the table with stored data
function showPeriodicTemps(){
    // resize the width of the modal
    $('#tempModal').on('show', function(){
        $(this).find('.modal-dialog').css({
            width: 'auto'
        });
    });

    // get all zones of the SHH system
    refreshTable();
}

// submit temperature settings
function submitTemps(){

    // TODO set the zones of the SHH as required
    for (let i = 1; i < shh.zones.length; i++) {
        var zone = shh.zones[i];
        var periods = new Array();

        // for loop for validation
        for (let j = 0; j < 3; j++) {
            // generate IDs
            var startID = 'z' + i + 'p' + (j+1) + 's';
            var endID = 'z' + i + 'p' + (j+1) + 'e';
            var tempID = 'z' + i + 'p' + (j+1) + 't';

            // get all attribute of a period
            var startTime = document.getElementById(startID).value;
            var endTime = document.getElementById(endID).value;
            var tempSetting = document.getElementById(tempID).value;    
            
            // a period can either allFilled or allEmpty
            var allFilled = (startTime != '') && (endTime != '') && (tempSetting != '');
            var allEmpty = (startTime == '') && (endTime == '') && (tempSetting == '');
            if(!allFilled && !allEmpty){
                alert('ERROR! Either fill in all parameters for each period or leave them all blank');
                return;
            }
            else{
                var times = new Array();
                times.push(startTime);
                times.push(endTime);
                periods.push(times);
            }
        }
        // check overlap
        for (let k1 = 0; k1 < 3; k1++) {
            for (let k2 = 0; k2 < 3; k2++){
                if(isOverlapped(periods[k1], periods[k2])){
                    alert('ERROR! The time periods of zone '+i+' period '+(k1+1)+' and period '+(k2+1)+' overlapped!' );
                    return;
                }
            }
        }

        // for loop for assign values
        for (let j = 0; j < 3; j++) {

            // generate IDs
            var startID = 'z' + i + 'p' + (j+1) + 's';
            var endID = 'z' + i + 'p' + (j+1) + 'e';
            var tempID = 'z' + i + 'p' + (j+1) + 't';

            // get all attribute of a period
            var startTime = document.getElementById(startID).value;
            var endTime = document.getElementById(endID).value;
            var tempSetting = document.getElementById(tempID).value;

            // get the non-empty values from user inputs
            if(document.getElementById(startID).value != ''){
                // if the periodicTempSetting is unset, construct one
                if (zone.periodicTempSettings[j] == null) {
                    zone.periodicTempSettings[j] = new PeriodicTempSetting(j, startTime, endTime, tempSetting);
                }
                // else, set it according to the inputs
                else{
                    zone.periodicTempSettings[j].setStartTime(startTime);
                    zone.periodicTempSettings[j].setEndTime(endTime);
                    zone.periodicTempSettings[j].setTempSetting(tempSetting);
                }
            }
        }
    }

    // TODO start monitor temperature under new settings

    $('#tempModal').modal('hide');
}

// check if two periods overlap
function isOverlapped(times1, times2){
    if (times1 !== times2 && times1[0] != '') {
        if(times2[0] < times2[1]){
            if(times1[0] >= times2[0] && times1[0] < times2[1]){
                return true;
            }
            if(times1[1] > times2[0] && times1[1] <= times2[1]){
                return true;
            }
        }

        // overnight case
        else if(times2[0] > times2[1]){
            if(times1[0] >= times2[0] || times1[0] < times2[1]){
                return true;
            }
            if(times1[1] > times2[0] || times1[1] <= times2[1]){
                return true;
            }
        }
    }
    return false;
}

// set periodic temperature settings according to the stored values
function refreshTable(){
    for (let i = 1; i < 6; i++) {
        const zone = shh.zones[i];

        for (let j = 0; j < 3; j++) {
            const pTempSetting = zone.periodicTempSettings[j];

            var startID = 'z' + i + 'p' + (j+1) + 's';
            var endID = 'z' + i + 'p' + (j+1) + 'e';
            var tempID = 'z' + i + 'p' + (j+1) + 't';
            var startTag = document.getElementById(startID);
            var endTag = document.getElementById(endID);
            var tempTag = document.getElementById(tempID);

            if (pTempSetting != null) {
                // assign values from stored data
                startTag.value = pTempSetting.getStartTime();
                endTag.value = pTempSetting.getEndTime();
                tempTag.value = pTempSetting.getTempSetting();
            }
            else{
                startTag.value = '';
                endTag.value = '';
                tempTag.value = '';
            }
        }
    }
}

function loadRoomsDropdown()
{
    var htmlText = "<select name='roomName' id='roomName'>";
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myObj = JSON.parse(this.responseText);
            for(var key1 of Object.keys(myObj))
            {
                for (var key2 of Object.keys(myObj[key1])){
                    if(key2=="name"){
                        var roomName = myObj[key1][key2][0].toString()
                        htmlText += "<option value=" + roomName + ">" + roomName + "</option>" ;
                    }
                }
            }

            htmlText += "</select>";
            document.getElementById('tempGet').innerHTML = htmlText;
        };
    } 
    xmlhttp.open("GET", "layout.json", true);
    xmlhttp.send();

    document.getElementById("winterDefault").innerHTML = "Desired winter temperature: " + desiredWinterTemp;
    document.getElementById("summerDefault").innerHTML = "Desired summer temperature: " + desiredSummerTemp;
}

function postTemp(){
    var roomCheck = document.getElementById('roomName').value;
    var i=0;
    room_array.forEach(room => {

        if (room.getName() == roomCheck) {
            //console.log(room.getDesiredTemperature());
            var consoleNode = document.createElement("p");
            roomsTempVals = room.getDesiredTemperature();
            var alertText;
            if(room.isOverriden)
            {
                alertText = varCurrentTime.toLocaleString("en-US") + " The temperature in the " + roomCheck + " is " + room.getDesiredTemperature();
            }
            else if(roomsTempVals.length>1){
                 alertText = varCurrentTime.toLocaleString("en-US") + " The temperature in the " + roomCheck + " is " + roomsTempVals[0].getTempSetting() + ", " + roomsTempVals[1].getTempSetting() + " and "  + roomsTempVals[2].getTempSetting();
            }
            else alertText="No zone, no setting -> Desired temp for this room is: "+room.getDesiredTemperature()+" by standard";
            //console.log(alertText);
            
            if (room.isOverriden)
            {
                alertText += " OVERRIDDEN";
            }           
            var consoleText = document.createTextNode(alertText);
            consoleNode.appendChild(consoleText);
            document.getElementById("outputConsole").appendChild(consoleNode);
        }
        i++;
    });
    
}

function updateTemp(){
    var newTemp = prompt("Enter a new temperature", "0");
    if(isNaN(newTemp))
    {
        alert("Please enter a number");
        return;
    }
    if(newTemp > 60 || newTemp < -10)
    {
        alert("This value is unrealistic");
        return;
    }
    var roomCheck = document.getElementById('roomName').value;
    var i = 0;
    room_array.forEach(room => {
        if (room.getName() == roomCheck) {
            room.setDesiredTemperature(newTemp);
        }
    });
//CONFLICT 2 END
}

function resetTemp(){
    var roomCheck = document.getElementById('roomName').value;
    room_array.forEach(room => {
        if (room.getName() == roomCheck) {
            room.resetOverriden();
        }
    });
}

function changeDesired(season)
{
    var desired = prompt("What do you want to change the desired temperature to?", "0");

    if(season)
    {
        desiredWinterTemp = desired;
        document.getElementById("winterDefault").innerHTML = "Desired winter temperature: " + desiredWinterTemp;
    }
    else{
        desiredSummerTemp = desired;
        document.getElementById("summerDefault").innerHTML = "Desired summer temperature: " + desiredSummerTemp;
    }
}


