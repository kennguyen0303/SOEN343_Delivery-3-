//-----------TABS-------------------------
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

//-------------POP-UP FORM
function openForm() {
    document.getElementById("myForm").style.display = "block";
}
  
function closeForm() {
    document.getElementById("myForm").style.display = "none";
}


//---------------- TIME ---------------
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
