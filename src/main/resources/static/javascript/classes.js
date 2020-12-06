//a constructor
function door(width, height, color, x, y,move_mode) {//in case of human-stick, color=name
    this.gamearea = document.getElementById("myCanvas");
    this.move_mode=move_mode;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.boundary=[]; //boundary for movement
    this.status = "closed";// for doorsm windows and lights
    if(this.move_mode=="horizontal"){//make a boundary for movement
        this.boundary=[this.x,(this.x+this.width)];//inital point + width
    }
    if(this.move_mode=="vertical"){//make a boundary for movement
        this.boundary=[this.y,(this.y+this.height)]
    }        
    this.update = function() {
        ctx = myGameArea.canvas.getContext("2d");
        if(move_mode=="image"||move_mode == "light"){
                //display the human stick
                ctx.drawImage(this.image, 
                    this.x, 
                    this.y,
                    this.width, this.height);
        }
        else if(move_mode=="HVAC"){
            ctx.fillStyle = '#ffffff'; // or whatever color the background is.
            ctx.fillText(this.output, this.x,this.y);
            this.output=this.status+"||"+this.room.getTemperature();//print ON/OFF status
            console.log("HVAC for "+this.room.getName()+" x:"+this.x+" y:"+this.y);
            ctx.fillStyle = '#000000'; // or whatever color the text should be.
            ctx.fillText(this.output,this.x,this.y);
        }
        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }
}


//New function for D2 - for Ken

function room(){
    //List of attributes
    this.name; //name of the room
    this.min_width;//min width of the room
    this.max_width;//max width of the room
    this.min_height;//min height
    this.max_height;//max height
    this.door_index_array=[]; // array of index corresponding to the global array "door_array"
    this.window_index_array=[];// array of index corresponding to the global array "window_array"
    this.light_index_array=[];// array of index corresponding to the global array "light_array"
    this.occupant=[];//array of indexes of user_array
    this.temperature = 15.5;//temperature of the room
    this.desiredTemperature;
    this.isOverriden = false;
    //methods 
    /**
     * check if the person is inside the room
     * @param {*} a_person 
     */
    this.inside=(a_person)=>{
        if(a_person.x>=this.min_width&&a_person.x<=this.max_width&&
            a_person.y>=this.min_height&&a_person.y<=this.max_height)
                return true;
        else return false;
    }
    //getter
    this.getName=()=>{
        return this.name;
    }
    this.getTemperature=()=>{
        return this.temperature;
    }
    this.getDesiredTemperature=()=>{
        if (this.isOverriden) {
            return this.desiredTemperature;
        } else {
            // obtain the zone
            for (let i = 0; i < shh.zones.length; i++) {
                const zone = shh.zones[i];
                if (zone.rooms.length > 0 && zone.getPeriodicTempSettings().length > 0) {
                    for (let j = 0; j < zone.rooms.length; j++) {
                        const room = zone.rooms[j];
                        if (room.getName() == this.getName()) {
                            // console.log(zone.getPeriodicTempSettings());
                            return zone.getPeriodicTempSettings();
                        }
                    }
                }
            }
            //no corresponding zone is found
            console.log(this.getName()+" has no zone");
            return 24;
        }
    }
    //---------------------------Setters--------------------------
    this.setName=(name)=>{
        this.name=name;
        return 1; //for testing, it works
    }
    this.setTemperature=(temperature)=>{
        this.temperature=temperature;
        console.log("setTemperature() works");
    }
    this.setDesiredTemperature=(temperature)=>{
        this.desiredTemperature=temperature;
        this.isOverriden = true;
    }
    this.set_min_width=(min_width)=>{
        this.min_width=min_width;
        return 1;
    }
    this.set_max_width=(max_width)=>{
        this.max_width=max_width;
        return 1;
    }
    this.set_min_height=(min_height)=>{
        this.min_height=min_height;
        return 1;
    }
    this.set_max_height=(max_height)=>{
        this.max_height=max_height;
        return 1;
    }
    this.resetOverriden=()=>{
        this.isOverriden = false;
    }
    //---------------------------- Add items -------------------------
    this.add_window=(index)=>{
        this.window_index_array.push(index);
        return index;
    }
    this.add_door=(index)=>{
        this.door_index_array.push(index);
        return index;
    }
    this.add_occupant=(index)=>{
        this.occupant.push(index);
        return this.occupant.length;
    }
    this.get_occupant_list=()=>{
        return this.occupant;
    }
    this.getNumberOfOccupant=()=>{
        return this.occupant.length;
    }
    this.remove_occupant=(val)=>{
        var index=this.occupant.indexOf(val);
        this.occupant.splice(index,1);//remove
    }
    this.add_light=(index)=>{
        this.light_index_array.push(index);
        return this.light_index_array.length;
    }
    this.insideRoom = (a_person)=>{
        if(a_person.x>this.min_width&&a_person.x<this.max_width&&a_person.y<this.max_height&&
            a_person.y>this.min_height){
                return true;
            } 
        return false;
        //wait need to turn on the light and update location    
    }
    /**
     * This method will open/close a window for the room calling it. A parameter is used to ask
     * for the number of windows need to be opened. 
     * If no parameter is passed, 
     * the function will apply the change to all window inside the room. 
     * Created for Daniela's need
     * @param {*} numberOfWindow 
     */
    this.openWindow=(numberOfWindow)=>{
        var max_number=this.window_index_array.length;
        if(numberOfWindow==null){//no parameter passed, open all then
            this.window_index_array.forEach(an_index => {
                controlWindow(an_index);
            });
            return;
        }
        try{
            for(var i=0;i<numberOfWindow;i++){
                var an_index=this.window_index_array[i];//pick a window from the array
                controlWindow(an_index);//open/close that window
            } 
        }
        catch(e){
            console.log(e);//if there are error, might be index out of bound due to the input
            console.log("Number of windows need to open: "+numberOfWindow);
            console.log("Number of windows inside the room: "+this.window_index_array.length);
        }
    }

    

}

//ADDING for D3


class humanStick extends door{
    constructor(width, height, name, x, y){
        super(width, height, "", x, y,"image");
        this.image = new Image();
        this.image.src = "../pictures/human_stick.png";
        this.name=name;//set the name
        this.location="outside";//Initialize at outside
        this.id="";//user id
        this.image.onload=()=>{
            ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
        }
    }
}

class Light extends door{
    constructor(width, height, name, x, y){
        super(width, height, "", x, y,"image");
        this.image = new Image();
        this.image.src = "../pictures/off_bulb.png";
        this.name=name
        this.image.onload=()=>{
                ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
        }
    }
}

class HVAC extends door{
    constructor(a_room){
        super("", "", "", a_room.min_width+15,a_room.min_height+15 ,"HVAC");
        this.room=a_room;//a "room" object
        this.x=parseInt(a_room.min_width)+10+"";
        this.y=parseInt(a_room.min_height)+30+"";
        this.temp=this.room.getTemperature();
        console.log("room temp: "+this.temp);
        this.status="OFF"; //hardcode right now, later on will be based on the HVAC controller 
        this.output=this.status+" || "+this.temp;//print ON/OFF status
    }
    // update(){
    //     //display the text
    //     var ctx = myGameArea.canvas.getContext("2d");
    //     this.output=this.status+" || "+this.room.getTemperature();//print ON/OFF status 
    //     ctx.fillText(this.output,this.x,this.y);
    // }
}