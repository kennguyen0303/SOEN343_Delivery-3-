// enum for HAVC States
class HAVCStates{
    static const states = {
      PAUSED: 'paused',
      RUNNING: 'running',
      STOPPED: 'stopped' // might be redundant
    }
}

class  HAVCController{

    constructor(newZone){
        this.zone = newZone;
        this.id = newZone.zoneID;
        this.state = HAVCStates.states.STOPPED; // paused?
    }

    this.startMonitoring = function(){
        monitorTemperature();
    }

    this.monitorTemperature = function(){
        var outsideTemperature = SHH.outdoorTemp; //TODO: Get outside temperature

        // TODO: Get ideal temperature in a zone
        var idealTemperature;

        var rooms = this.zone.getRooms();
        for(let i = 0; i< rooms.length; i++){
            var temperatureInRoom = rooms[i].getTemperature();
            var increase;
            setHAVCState(idealTemperature, temperatureInRoom);

            if(this.state == HAVCStates.states.RUNNING){
                increase = (idealTemperature > temperatureInRoom);
                updateRoomTemperature(increase, 0.1, room);
            }
            else if(this.state == HAVCStates.states.PAUSED){
                increase = (outsideTemperature > temperatureInRoom);
                updateRoomTemperature(increase, 0.05, room);
            }

            if(temperatureInRoom == 0){
                // TODO: send to application console and log file
                alert("Get your house temperature under control plz thx");
            }

            if(temperatureInRoom > outsideTemperature){
                openWindowsInSummer(room);
            }
        }

        setTimeout(monitorTemperature(), temperatureTimeout);
    }

    this.setHAVCState = function(idealTemperature, temperatureInRoom)
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

    this.openWindowsInSummer = function(room){
         var currentSeason = getCurrentSeason();
         if(currentSeason == Seasons.season.SUMMER){
             this.state = HAVCStates.states.STOPPED;

             // do I need to check for away modes?
             room.openWindow(); // no parameters opens all windows in room
         }
     }

     this.updateRoomTemperature = function(increase, rate, room){
            var currentTemp =  room.getTemperature();

            if(!this.state == HAVCStates.states.PAUSED || !currentTemp == outsideTemp){
                room.temperature = increase ? (currentTemp + rate): (currentTemp - rate);
            }
     }
}

