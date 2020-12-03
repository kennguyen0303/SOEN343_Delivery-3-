class HAVCStates{
    static const states = {
      PAUSED: 'paused',
      RUNNING: 'running',
      STOPPED: 'stopped'
    }
}

class  HAVCController{

    constructor(newZone){
        this.zone = Zone;
        this.id = newZone.zoneID;
        this.state = HAVCStates.states.STOPPED;
    }

    function startMonitoring(){
        monitorTemperature();
    }

    function monitorTemperature(){
        var outsideTemperature = 18; /*getOutsideTemperature();*/
        var temperatureInZone = getTemperatureInZone(zoneID);
        var idealTemperature = getDesiredTemperatureByZone(zoneID);

        if(Math.abs(idealTemperature - temperatureInZone) > 1){
           this.state = HAVCStates.states.RUNNING;
        }

        if(temperatureInZone > outsideTemperature){
            openWindowsInSummer();
        }
     }

     function getDesiredTemperatureByZone(zoneID){
         return 30;
     }

     function changeTemp(idealTemperature, temperatureInZone, zoneID){

         setTimeout(monitorTemperature(zoneID), temperatureTimeout);

     }

     function openWindowsInSummer(){
         var currentSeason = getCurrentSeason();
         if(currentSeason == Seasons.season.SUMMER){
             // add for loop for rooms in zone
             var roomName;
                 for(int i= 0; i < room_array.length; i++){
                    if(roomName ==  roomArray[i].getName()){
                       room_array[i].openWindow(); // no param opens all windows
                    }
                 }
         }
     }
}

