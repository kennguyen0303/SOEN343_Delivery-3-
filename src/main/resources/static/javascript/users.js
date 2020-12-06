//Daniela functions
function addProfile(str) {
    var xhttp;
    alert(str);
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       alert("added successfully");
    };
    }
    var obj = { "role" : str};
    obj = JSON.stringify(obj);
    console.log(obj);
    xhttp.open("POST", "http://localhost:8080/api/user", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(obj);
  
  }
  //get the profile !
  function getProfile() {
    var xhttp;
      window.alert("inside getProfile");
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       document.getElementById("showProfile").innerHTML=this.responseText;
    };
    }
    xhttp.open("GET", "http://localhost:8080/api/user", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
  
  }
  
  function removeAllChildNodes(element) {
  if(element){
  while(element.firstChild) {
       element.removeChild(element.lastChild);
     }
  }
  
  }
  
  function getUserById(id) {
      var xhttp;
      var user;
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          return user = JSON.parse(this.responseText);
      }
      };
  
      xhttp.open("GET", "http://localhost:8080/api/user/userRetrieval/" + id, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
  }
  
  // Retrieves users from backend as they are added and displays them in a dropdown list
  function getUsers() {
      var xhttp;
      var userArray;
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
  
          if (this.readyState == 4 && this.status == 200) {
              userArray = JSON.parse(this.responseText);
  
              var select = document.getElementById("currentUsersList");
              removeAllChildNodes(select);
  
              //alex attempt
              var select2 = document.getElementById("currentUsersList2");
              removeAllChildNodes(select2);
              //end
  
              var select3 = document.getElementById("currentUsersList3");
              removeAllChildNodes(select3);
  
              for( var i=0; i< userArray.length; i++) {
                  var option = document.createElement("option");
                  option.value = userArray[i].id;
                  option.innerHTML = userArray[i].role;
                  select.appendChild(option);
              }
  
              //alex attempt
              for( var i=0; i< userArray.length; i++) {
                  var option = document.createElement("option");
                  option.value = userArray[i].id;
                  option.innerHTML = userArray[i].role;
                  select2.appendChild(option);
              }//end
  
             for( var i=0; i< userArray.length; i++) {
                var option = document.createElement("option");
                  option.value = userArray[i].id;
                  option.innerHTML = userArray[i].role;
                  select3.appendChild(option);
                }
  
              var item = document.getElementById("availableUsers");
  
              removeAllChildNodes(item);
              item.appendChild(select);
  
              //alex attempt start
              var item2 = document.getElementById("availableUsers2");
              removeAllChildNodes(item2);
              item2.appendChild(select2);
              //attempt end
  
              var item3 = document.getElementById("availableUsers3");
              removeAllChildNodes(item3);
              item3.appendChild(select3);
          }
      };
  
      xhttp.open("GET", "http://localhost:8080/api/user/allUserRetrieval", true);
      xhttp.send();
  }
  
  // Submits the form to add a user
  function onAddUserSubmit() {
      var select = document.getElementById("roleSelect");
      var role = select.options[select.selectedIndex].value;
      addUser(role);
  }
  
  // Sends the http request to add a user to the backend
  function addUser(str) {
      var xhttp;
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              getUsers();
          }
      };
  
      var obj = { "role" : str};
      obj = JSON.stringify(obj);
      xhttp.open("POST", "http://localhost:8080/api/user/addUser", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(obj);
  }
  
  // Submits the user to delete
  function onSubmitDeleteUser() {
      var select = document.getElementById("currentUsersList");
      var userId = select.options[select.selectedIndex].value;
      deleteUser(userId);
  }
  
  // Sends the http request to delete a selected user
  function deleteUser(id) {
      var xhttp;
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              getUsers();
          }
      };
  
      xhttp.open("DELETE", "http://localhost:8080/api/user/userRemoval/" + id, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
  }
  
  // Submits the user to edit and the new role to change it with
  function onSubmitEditForm() {
      var select = document.getElementById("currentUsersList");
      var userId = select.options[select.selectedIndex].value;
      var newRoleSelect = document.getElementById("newRole")
      var newRole = newRoleSelect.options[newRoleSelect.selectedIndex].value;
      var currentRole = getUserById(userId);
  
      editUser(newRole, userId);
  }
  
  // sends the http request to edit a user role in the backend
  function editUser(newRole, id) {
      var xhttp;
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              getUsers();
          }
      };
  
      var obj = { "role" : newRole};
      obj = JSON.stringify(obj);
      xhttp.open("PUT", "http://localhost:8080/api/user/userUpdate/" + id, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(obj);
  }
  
  // Logs in the selected user and logs out old user, if necessary
  function onLoginSubmit() {
      var select = document.getElementById("currentUsersList");
      var userId = select.options[select.selectedIndex].value;
      var role = select.options[select.selectedIndex].innerHTML;
  
      logIn(userId,role);
  }
  
  // Performs the http request to log in the user
  function logIn(id, role) {
      var xhttp;
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              document.getElementById("userDisplay").innerHTML = role ;
          }
      };
  
      xhttp.open("PUT", "http://localhost:8080/api/user/logIn/" + id, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send();
  }
  
function grantPermissions()
{
    var currentRole = getCurrentUserRole();
    if(currentRole === "Parent")
    {
        var permissionDropDown = document.getElementById("permissionName");
        var permissionName = permissionDropDown.options[permissionDropDown.selectedIndex].value;

        var permissionValueDropDown = document.getElementById("permissionValue");
        var permissionValue = permissionValueDropDown.options[permissionValueDropDown.selectedIndex].value;

        var userSelect = document.getElementById("currentUsersList");
        var userId = userSelect.options[userSelect.selectedIndex].value;

          var xhttp;
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(this.response);
                }
            };

            xhttp.open("PUT", "http://localhost:8080/api/user/updateUserPermissions/"+userId +"/"+ permissionName +"/"+  permissionValue, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send();
    }
    else
    {
        alert("You do not have the permission to change user permissions");
    }
}

function saveProfiles()
{
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

     }
    };
    xhttp.open("POST", "http://localhost:8080/api/user/userSaving", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function loadProfiles()
{
     var xhttp;
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                getUsers();
            }
         };

        xhttp.open("POST", "http://localhost:8080/api/user/userLoading", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send();
}

function getUserPermissions(id)
{
        var xhttp;
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                 userPermissions = JSON.parse(this.responseText);
                 return userPermissions;
            }
        };

        xhttp.open("GET", "http://localhost:8080/api/user/userPermissions/"+id, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send();
}


function getCurrentUserPermissions()
{
        var xhttp;
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {

            }
        };

        xhttp.open("GET", "http://localhost:8080/api/user/currentUserPermissions", false);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send();
        var userPermissions = JSON.parse(xhttp.responseText);
        console.log(userPermissions);
        return userPermissions;
}

function getCurrentUserRole()
{
  var xhttp;
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {

            }
        };

        xhttp.open("GET", "http://localhost:8080/api/user/currentUser", false);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send();
        var role = JSON.parse(xhttp.responseText).role;
        return role;
}

function writePermissions()
{
    var userPermissions = getCurrentUserPermissions();
    document.getElementById("PermissionsTitle").innerHTML = "Current Permissions for Logged In Profile"
    document.getElementById("AllDoors").innerHTML = "Can lock and unlock all doors: " + userPermissions.lockDoors;
    document.getElementById("AllWindows").innerHTML = "Can open/close all windows: " + userPermissions.openAllWindows;
    document.getElementById("RestrictedWindows").innerHTML = "Can open close windows if in the same room: " + userPermissions.useRestrictedWindows;
    document.getElementById("AllLights").innerHTML = "Can open all lights: " +  userPermissions.useAllLights;
    document.getElementById("RestrictedLights").innerHTML = "Can open lights if in the same room: " + userPermissions.useRestrictedLights;
    document.getElementById("SetAwayMode").innerHTML = "Can set the simulation to away mode: " + userPermissions.canSetAwayMode;
    document.getElementById("SetZones").innerHTML = "Can define zones: " + userPermissions.canDefineZones;
    document.getElementById("SetAllTemperatures").innerHTML = "Can override all temperatures: " + userPermissions.canOverrideAllTemperatures;
    document.getElementById("SetRestrictedTemperature").innerHTML = "Can override temperature in the same room: " + userPermissions.canOverrideRestrictedTemperature;
}

function hidePermissions()
{
   document.getElementById("AllDoors").innerHTML = "";
   document.getElementById("AllWindows").innerHTML = "";
   document.getElementById("RestrictedWindows").innerHTML = "";
   document.getElementById("AllLights").innerHTML = "";
   document.getElementById("RestrictedLights").innerHTML = "";
   document.getElementById("SetAwayMode").innerHTML = "";
   document.getElementById("SetZones").innerHTML = "";
   document.getElementById("SetAllTemperatures").innerHTML = "";
   document.getElementById("SetRestrictedTemperature").innerHTML = "";

}