//Nathan+Abdala function


function changeTabs(evt, SmartHomeTab) {
    // Declare all variables
    var i, tabcontent, tablinks;
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(SmartHomeTab).style.display = "block";
    evt.currentTarget.className += " active";
}
  

//--------------------------------------
//alex functions
function showContext() {
    document.getElementById('SHSystem').style.display = 'none';
}

//************Function for Alex part prepared by Ken  */

function openForm() {
    document.getElementById("myForm").style.display = "block";
  }
  
  function closeForm() {
    document.getElementById("myForm").style.display = "none";
  }

  var xAxis = 0;
  var yAxis = 0;
  var obstacle = null;
  function onCoordinatesSubmit() {
    xAxis = document.getElementById('xAxis').value;
    yAxis = document.getElementById('yAxis').value;

    //validation
    if (xAxis < 0 || yAxis < 0) {
        alert("input error");
        xAxis = 0;
        yAxis = 0;
        document.getElementById('xAxis').value = null;
        document.getElementById('yAxis').value = null;
    }
    else {
        //add human/image: choose the last parameter as image
        //add obstacle: "put sthing else"
        obstacle = new door(10, 10, "green", xAxis, yAxis, "horizontal");
        obstacle.update();
    }

    
    if(xAxis>360 && xAxis<390 && yAxis>40 && yAxis<60) {
        //change the boundary of bathroom
        //door_array[0].boundary = [door_array[0].x, xAxis-20];
        locked_array_door[0] = "true";
    }
    if(xAxis>285 && xAxis<310 && yAxis>60 && yAxis<100) {
        //change the boundary of bedroom
        //door_array[1].boundary = [door_array[1].y, yAxis-20];
        locked_array_door[1] = "true";
    }
    if(xAxis>205 && xAxis<230 && yAxis>60 && yAxis<100) {
        //change the boundary of backyard
       // door_array[3].boundary = [door_array[3].y, yAxis-20];
        locked_array_door[2] = "true";
    }
    if(xAxis>285 && xAxis<310 && yAxis>260 && yAxis<315) {
        //change the boundary of kitchen
        //door_array[3].boundary = [door_array[3].y, yAxis-20];
        locked_array_door[3] = "true";
    }
    if(xAxis>210 && xAxis<225 && yAxis>260 && yAxis<300) {
        //change the boundary of garage inside
        //door_array[3].boundary = [door_array[3].y, yAxis-20];
        locked_array_door[4] = "true";
    }
    if(xAxis>235 && xAxis<255 && yAxis>340 && yAxis<360) {
        //change the boundary of entrance
        //door_array[3].boundary = [door_array[3].y, yAxis-20];
        locked_array_door[5] = "true";
    }
    if(xAxis>135 && xAxis<155 && yAxis>340 && yAxis<360) {
        //change the boundary of garage outside
        //door_array[3].boundary = [door_array[3].y, yAxis-20];
        locked_array_door[6] = "true";
    }
    if(xAxis>390 && xAxis<410 && yAxis>60 && yAxis<115){
        //change the boundary of window room
        //door_array[1].boundary = [door_array[1].y, yAxis-20];
        locked_array_window[0] = "true";

    }
    if(xAxis>390 && xAxis<410 && yAxis>260 && yAxis<315){
        //change the boundary of window room
        //door_array[1].boundary = [door_array[1].y, yAxis-20];
        locked_array_window[1] = "true";

    }

}

//Nathan and alex functions
function resetCoordinates() {
    document.getElementById('xAxis').value = null;
    document.getElementById('yAxis').value = null;
    //the following code does not work for now
    xAxis = 0;
    yAxis = 0;
    obstacle.width = 0;
    obstacle.height = 0;
    obstacle.update();
    renderLayout();
}

var user_array=[];//an array for controlling the user in the house
function placeUser(){
    //obtain the user
    var userIndex = document.getElementById('currentUsersList2').selectedIndex;
    var userID = document.getElementById('currentUsersList2').options[userIndex].value;
    var userName = document.getElementById('currentUsersList2').options[userIndex].innerHTML;
    
    //obtain the room
    var roomName = document.getElementById('availableRooms').value;

    //determine the coordinates of the user for each room
    var positionX = 0;
    var positionY = 0;
    //NEED TO UPDATE FOR THE NEW LAYOUT !
    if(roomName == "entrance") {
        positionX = 240;
        positionY = 360;
    } 
    if(roomName == "kitchen") {
        positionX = 350;
        positionY = 300;
    }
    if(roomName == "hallway") {
        positionX = 250;
        positionY = 200;
    }
    if(roomName == "garage") {
        positionX = 160;
        positionY = 250;
    }
    if(roomName == "backyard") {
        positionX = 120;
        positionY = 100;
    }
    if(roomName == "bedroom") {
        positionX = 350;
        positionY = 100;
    }
    if(roomName == "bathroom") {
        positionX = 375;
        positionY = 28;
    }

    //place img in the layout
    var selectedUser = new humanStick(15, 20, "", positionX, positionY);
    selectedUser.id=userID;//store ID 
    user_array.push(selectedUser);//push into the array

    //by Ken
    var temp_element=document.createElement("option");
    var element = document.getElementById("control_option");//access the dropdown box
    temp_element.value=user_array.length;
    temp_element.innerHTML=userName;
    element.appendChild(temp_element);//add to the dropdown
    selectedUser.update();

    //store user location into backend
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            getUsers();
        }
    };
    xhttp.open("PUT", "http://localhost:8080/api/user/updateUserLocation/" + userID + "/" + roomName, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();

    //observe the location
    if (document.getElementById('awayModeButton').innerHTML == 'ON') {
        UserObserver.update();
    }
    
}
/**
 * Update location of a user to the backend
 * @param {*} user 
 */
function updateLocationToBackend(user){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            getUsers();
        }
    };
    xhttp.open("PUT", "http://localhost:8080/api/user/updateUserLocation/" + user.id + "/" + user.location, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    UserObserver.update();
}
var varCurrentTime = new Date();

function refreshTime() {
    setInterval(() => {
        //currentTime + 1
        tikTok();
    }, 1000);
}

function newTime() {
	var y = prompt("enter a year (October 13, 2014 11:13:00)", 0);
	varCurrentTime = new Date(y);
}

function tikTok() {

    var second = varCurrentTime.getSeconds() + 1;
    varCurrentTime.setSeconds(second);
    document.getElementById('time').innerHTML = varCurrentTime.toLocaleString("en-US");

    if (document.getElementById('awayModeButton').innerHTML == 'ON') {
        if (lightSchedule.length == 0) {
            return;
        }
        else{
            var timeNow = new CurrentTime();
            var timeObserver = new TimeObserver();
            timeNow.addObserver(timeObserver)
            timeNow.setCurrentTime();
        }
        
    }
    

}

// CONFLICT RESOLVED !

//user should be able to set the time to pass before sending notification
var eclipsedTime = 0;
function setEclipseTime(){
    eclipsedTime = document.getElementById('eclipseTime').value;
}



//obversers classes here
class UserObserver {
    constructor(){
        // this.eclipsedTime = eclipsedTime;
    }

    static update(){

        const currentTime = new Date();
        var timeInfo = currentTime.toUTCString();

        //obtain the users
        var xhttp = new XMLHttpRequest();
        var userDB;

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                userDB = JSON.parse(this.responseText);
                
                for (let i = 0; i < userDB.length; i++) {
                    if (userDB[i].location != "none" && userDB[i].location != "entrance" && userDB[i].location != "outside") {
                        //generate information
                        var info = timeInfo + "\tNotification to Parent: " + userDB[i].role + " is in the house's " + userDB[i].location;

                        //TODO obtain user eclipsed time
                        while(new Date() - currentTime < eclipsedTime);

                        //notify the user
                        // alert(info);

                        //append info to output console
                        var outputConsole = document.getElementById('outputConsole');
                        var pTag = document.createElement('P');
                        var contents = document.createTextNode(info);
                        pTag.appendChild(contents);
                        outputConsole.appendChild(pTag);
                        
                    }
                }
            }
        }

        xhttp.open("GET", "http://localhost:8080/api/user/allUserRetrieval", true);
        xhttp.send();
    }
}