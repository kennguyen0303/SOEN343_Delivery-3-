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

        var idealTemperature;

        var rooms = this.zone.getRooms();
        for(let i = 0; i< rooms.length; i++){
            var temperatureInRoom = rooms[i].temperature;
            var increase = (idealTemperature > temperatureInRoom);
            setHAVCState(idealTemperature, temperatureInRoom);

            if(this.state == HAVCStates.states.RUNNING){
                updateRoomTemperature(increase, 0.1, room);
            }
            else if(this.state == HAVCStates.states.PAUSED){
                updateRoomTemperature(increase, 0.05, room);
            }

            if(temperatureInRoom == 0){
                // alert console
            }

            if(temperatureInRoom > outsideTemperature){
                openWindowsInSummer(room);
            }
        }

        // TODO: figure how to get these temperatures
        setTimeout(monitorTemperature(), temperatureTimeout);
    }

    function setHAVCState(idealTemperature, temperatureInRoom)
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

     function openWindowsInSummer(room){
         var currentSeason = getCurrentSeason();
         if(currentSeason == Seasons.season.SUMMER){
             this.state = HAVCStates.states.STOPPED;
             room.openWindow(); // do I need to check for away mode???
         }
     }

     function updateRoomTemperature(increase, rate, room){
            var currentTemp =  room.getTemperature();
            var roomTemp = increase ? currentTemp + rate: currentTemp - rate;
            room.temperature = roomTemp;
     }
}

