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
        var increase = (idealTemperature > temperatureInZone);

        if(Math.abs(idealTemperature - temperatureInZone) > 1){
           this.state = HAVCStates.states.RUNNING;

           updateRoomTemperature(increase, 0.1);
        }
        else if(Math.abs(idealTemperature - temperatureInZone) >= 0.25){
            this.state = HAVCStates.states.RUNNING;
            updateRoomTemperature(increase, 0.1);
        }
        else if(idealTemperature == temperatureInZone){
            this.state = HAVCStates.states.STOPPED;
            updateRoomTemperature(increase, 0.05);
        }

        if(temperatureInZone > outsideTemperature){
            openWindowsInSummer();
        }

        setTimeout(monitorTemperature(), temperatureTimeout);
     }

     function getDesiredTemperatureByZone(zoneID){
         return 30;
     }

     function openWindowsInSummer(){
         var currentSeason = getCurrentSeason();
         if(currentSeason == Seasons.season.SUMMER){
             for(let i = 0; i < rooms.length; i++){
                     rooms[i].openWindow();
                 }
         }
     }

     function updateRoomTemperature(increase, rate){
        var rooms = this.zone.getRooms();

        for(let i = 0; i < rooms.length; i++){
            var room =  rooms[i];
            var currentTemp =  room.getTemperature();
            var roomTemp = increase ? currentTemp + rate: currentTemp - rate;
            room.temperature = roomTemp;
        }
     }
}

