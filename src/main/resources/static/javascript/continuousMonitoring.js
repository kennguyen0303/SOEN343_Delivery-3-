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
        this.state = HAVCStates.states.PAUSED;
    }

    this.startMonitoring = function(){
        monitorTemperature();
    }

    this.monitorTemperature = function(){
        var outsideTemperature = SHH.outdoorTemp; //TODO: Get outside temperature

        // TODO: Get ideal temperature in a zone
        var idealTemperature = this.zone.getIdealTemperature();

        var rooms = this.zone.getRooms();
        for(let i = 0; i< rooms.length; i++){

            // check if windows have been closed since last temperature reading
            if(this.state == HAVCStates.states.STOPPED){
                 var index = rooms[i].window_index_array();
                 if( window_index_array[i].status == 'closed'){ // TODO: VERIFY THAT THIS IS ACCURATE. Do we only have 1 window per room?
                    this.state = HAVCStates.states.RUNNING;
                 }
            }

            // adjust temperature if the simulation is not stopped
            if(!this.state == HAVCStates.states.STOPPED){
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
            }

            monitorPipes(temperatureInRoom);
            monitorWindows(temperatureInRoom, outsideTemperature);
        }

        setTimeout(monitorTemperature(), temperatureTimeout);
    }

    this.monitorPipes = function(temperatureInRoom){
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

    this.monitorWindows = function(temperatureInRoom, outsideTemperature){
        if(temperatureInRoom > outsideTemperature){
            openWindowsInSummer(room);
        }
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
             if(!awayMode){
                this.state = HAVCStates.states.STOPPED;
                room.openWindow(); // no parameters opens all windows in room
             }
         }
     }

    this.updateRoomTemperature = function(increase, rate, room){
        var currentTemp =  room.getTemperature();

       if(!this.state == HAVCStates.states.PAUSED || !currentTemp == outsideTemp){
          room.temperature = increase ? (currentTemp + rate): (currentTemp - rate);
       }
    }
}

