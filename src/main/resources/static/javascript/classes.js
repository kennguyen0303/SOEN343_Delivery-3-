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
                //display the name or role
                //ctx.fillText(color,this.x+15,this.y+50);//format: [0]=room name, [1]: width, [2]: height
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
    this.temperature;
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
    //---------------------------Setters--------------------------
    this.setName=(name)=>{
        this.name=name;
        return 1; //for testing, it works
    }
    this.setTemperature=(temperature)=>{
        this.temperature=temperature;
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