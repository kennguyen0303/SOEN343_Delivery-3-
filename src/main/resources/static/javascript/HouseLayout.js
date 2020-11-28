function renderLayout()//a function for rendering the layout of the house
{
     var xmlhttp = new XMLHttpRequest();//creating a request for AJAX to load the layout
         xmlhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {//when the layout file is successfully loaded, executes the below codes
             myObj = JSON.parse(this.responseText);//parse the JSON data to an JAvascript object
             var canvas = document.getElementById("myCanvas");//define the area to draw
             var ctx = canvas.getContext("2d");//a syntax concept, check the w3school
             //drawing starts here
             for (var key1 of Object.keys(myObj)) {//loop over each room in the JSON file, syntax here: loop over an object
                 for (var key2 of Object.keys(myObj[key1])) {//loop over each element of a room
                     //print room_name 
                     if(key2=="name"){//if the element is "name", need to print out
                         var temp_room=new room();//initialize a room
                         temp_room.setName(myObj[key1][key2][0]);//set the name for the room
                         ctx.font = "15px Arial";//set the font
                         ctx.fillText(myObj[key1][key2][0],myObj[key1][key2][1],myObj[key1][key2][2]);//format: [0]=room name, [1]: width, [2]: height
                         continue;//move on the other keys
                     }
                     //print the door
                     if(key1=="door"){
                         //each [key2] is an object of a door
                         var temp_door = new door(myObj[key1][key2][0], myObj[key1][key2][1], myObj[key1][key2][2], myObj[key1][key2][3], myObj[key1][key2][4],myObj[key1][key2][5]);
                         if( myObj[key1][key2][2]=="red") {
                             door_array.push(temp_door);//add door
                             room_array.forEach(a_room => {
                                 var room_name=a_room.getName();
                                 if(key2.includes(room_name))
                                     a_room.add_door(door_array.length-1);//take the index of the door
                             });
                         }
                         if( myObj[key1][key2][2]=="blue") {
                             window_array.push(temp_door);//add window 
                         }
                         continue;
                     }
                     //print the door
                     if(key1=="light"){
                         //each [key2] is an object of a door
                         var temp_door = new Light(myObj[key1][key2][0], myObj[key1][key2][1], myObj[key1][key2][2], myObj[key1][key2][3], myObj[key1][key2][4],myObj[key1][key2][5]);
                         light_array.push(temp_door);
                         room_array.forEach(a_room => {
                             var room_name=a_room.getName();
                             if(key2.includes(room_name))
                                 a_room.add_light(light_array.length-1);//take the index of the door
                         });
                         continue;
                     }
                     //draw the wall for a room
                     for(var i=0;i<myObj[key1][key2].length;i=i+4){
                         //store the height and width of a room
                         if(key2=="top"){
                             temp_room.set_min_height(myObj[key1][key2][1]);//the first point
                             temp_room.set_min_width(myObj[key1][key2][0]);//the first point
                             var last_index=myObj[key1][key2].length-1;
                             temp_room.set_max_width(myObj[key1][key2][last_index-1]);//consult the layout.json to know why -1
                         }
                         if(key2=="left"){
                             var last_index=myObj[key1][key2].length-1;
                             temp_room.set_max_height(myObj[key1][key2][last_index]);
                         }
                         ctx.moveTo(myObj[key1][key2][i],myObj[key1][key2][i+1]);
                         ctx.lineTo(myObj[key1][key2][i+2],myObj[key1][key2][i+3]);
                         ctx.stroke();
                         
                     }
                 };//finish rendering a room
                 if(key1!=="door"&&key1!=="light") {

                     room_array.push(temp_room);//add the room to the array
                    

                 }
             };
             startGame();//start the movement, challenge: Need to click to render door
         }
     };
     xmlhttp.open("GET", "layout.json", true);
     xmlhttp.send();
         
}

/**
*Header Load the information on the canvas
*@return a layout
*/
function loadCanvas(){
    timerStack=[];//a stack for timer
    document.getElementById("defaultOpen").click(); //choose SHS on load of the page
    myGameArea = {
            canvas: document.getElementById("myCanvas"),
            start: function () {
                this.context = this.canvas.getContext("2d");
                this.interval;
                //load all element once
                updateAll();
                window.addEventListener('keydown', function (e) {
                isOn = document.getElementById("slider").checked;
                myGameArea.key = e.keyCode;
                if (isOn) {
                    this.interval = setInterval(moveUser, 20);
                    timerStack.push(this.interval);
                    }
                })
                    window.addEventListener('keyup', function (e) {
                        myGameArea.key = false;
                        while(timerStack.length>0){
                            const element = timerStack.shift();
                            clearInterval(element);//let's try
                            
                        }
                        // clearInterval(this.interval);//let's try
                        user_array.forEach(user => {
                        user.speedX=0;
                        user.speedY=0;
                    });
                    })
                },
                clear: function (name) {
                    if (name == "door") {
                        door_array.forEach(a_door => {
                            if (a_door.move_mode == "horizontal") this.context.clearRect((a_door.x - 40), a_door.y, 60, 5);
                            if (a_door.move_mode == "vertical") this.context.clearRect(a_door.x, (a_door.y - 30), 5, 60);
                        });
                    }
                    else if (name == "window") {
                        window_array.forEach(a_window => {
                            if (a_window.move_mode == "horizontal") this.context.clearRect((a_window.x - 40), a_window.y, 60, 5);
                            if (a_window.move_mode == "vertical") this.context.clearRect(a_window.x, (a_window.y - 30), 5, 60);
                        });
                    }
                    else if (name == "light") {
                        light_array.forEach(a_light => {
                            //do something to remove the old light ? 
                            this.context.clearRect((a_light.x), a_light.y, 20, 20);
                        });
                    }
                    else if (name == "image") {
                        //clear human stick
                        user_array.forEach(user => {
                            this.context.clearRect(user.x, user.y, 15, 20);
                        });
                    }
                }
            }
    
}

function startGame() {
    myGameArea.start();
}


function moveUser() {
    myGameArea.clear("image"); 
    user_array.forEach(user => {
        user.speedX=0;
        user.speedY=0;
    });
    var option = document.getElementById("control_option").value - 1;//minus 1 since array start from 0
    //Moving the human stick 
    if (myGameArea.key && myGameArea.key == 37) {//move left
        user_array[option].speedX = -1;
    }
    if (myGameArea.key && myGameArea.key == 38) {//move up
        user_array[option].speedY = -1;
    }
    if (myGameArea.key && myGameArea.key == 39) {//move right
        user_array[option].speedX = 1;
    }
    if (myGameArea.key && myGameArea.key == 40) {//move down
        user_array[option].speedY = 1;
    }
        
    var count=0;
    user_array.forEach(user => {
        user.newPos();    
        user.update();
        //update location ?
        //---@TODO-D3: NEED METHOD EXTRACT todo
        room_array.forEach(a_room => {
            if(user.location!= a_room.getName()){
                if(a_room.insideRoom(user)){//if the user is inside a room
                    if(!a_room.get_occupant_list().includes(count)){//first time walk into the room
                        a_room.add_occupant(count);
                        //turn on light in the room on AUTO MODE
                        if(autoMode){
                            console.log("turning on light AUTO! ");
                            a_room.light_index_array.forEach(an_index => {
                                turnOnLight(an_index);
                            });
                        }
                    user.location=a_room.getName();//update the location
                    updateLocationToBackend(user);
                    console.log("New location detected: "+user.location+"New number detected: "+a_room.getNumberOfOccupant());
                    } 
                }
                else{//not inside the room
                    if(a_room.get_occupant_list().includes(count)){//not inside the room, but still on the list
                        a_room.remove_occupant(count);//remove the index from the list
                    }
                    if(autoMode && a_room.getNumberOfOccupant()==0){//turn off if empty
                        a_room.light_index_array.forEach(an_index => {
                            turnOffLight(an_index);
                        });
                    }
                }
            }
            else{//if the location matches a room, but not inside the room, in transition
                if(!a_room.insideRoom(user)){
                    user.location="outside";//update the location
                    updateLocationToBackend(user);
                    console.log("New location detected: "+user.location);
                }
            }
            count++;
        });
        
    });
}

function updateAll(){
    light_array.forEach(a_light => {
        a_light.update();
        });
        door_array.forEach(a_door => {
            a_door.newPos();
            a_door.update();
        });
        window_array.forEach(a_window => {
            a_window.newPos();
            a_window.update();
        });
}