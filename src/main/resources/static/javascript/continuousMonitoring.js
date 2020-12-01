class HAVCStates{
    static const states = {
      PAUSED: 'paused',
      RUNNING: 'running',
      STOPPED: 'stopped'
    }
}

class  HAVCController{
    static state = HAVCStates.states.STOPPED;

    constructor(zoneID){
        this.zoneID = zoneID;
    }
}

function monitorTemperature(location){
    var outsideTemperature = getOutsideTemperature();
    var temperatureInZone = getTemperatureInZone(location);
    var idealTemperature = getDesiredTemperatureByZone(location);

    if(Math.abs(idealTemperature - temperatureInZone) > 1){
       HAVCController.state = HAVCStates.states.RUNNING;
    }

    if(temperatureInZone > outsideTemperature){
        openWindowsInSummer();
    }
}

function getOutsideTemperature(){
    return 10; // temporary
}

function getTemperatureInZone(location){
    return 20; // temporary
}

function getDesiredTemperatureByZone(location){
    return 30;
}

function setOutsideTemperature(){
}

function changeTemp(idealTemperature, temperatureInZone, location){

    setTimeout(monitorTemperature(location), 1000);

}

function openWindowsInSummer(location){
    var currentSeason = getCurrentSeason();
    if(currentSeason == Seasons.season.SUMMER){

            // open all windows in zone
    }
}