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
//Feature: Set/Reset months for Winter / Summer ------------
$( function() {
    $( ".draggable" ).draggable({helper:'clone'});
    $(".summer").droppable(
        {
            accept: ".draggable",
            drop: function(ev,ui){
              addMonth("summer",ui);
            }
        }
    );
    $(".winter").droppable(
        {
            accept: ".draggable",
            drop: function(ev,ui){
                addMonth("winter",ui);
            }
        }
    );
    $("#reset").click(function(){  
      $(".list").empty();
      while (winter_month.length!=0) {
          winter_month.pop();
      };
      while (summer_month.length!=0) {
        summer_month.pop();
    };
        alert("The months were reseted");
    })
  } );

function addMonth(season,ui){
        var array=[];
        var other_season;
        var other_array;
        var droppedItem = $(ui.draggable).clone();//make a clone of the hold item
        var id=droppedItem.text();//get the text
        //Check the season and set proper variables
        if(season=="summer") {
            array=summer_month;
            other_season="winter";
            other_array=winter_month;
        }
        else if(season=="winter") {
            array=winter_month;
            other_season="summer";
            other_array=summer_month;
        }
        //if the month is used by the other season
        if(other_array.indexOf(id)!=(-1)){
            alert("This month is being used for "+other_season);
        }
        else if(array.indexOf(id)==(-1)){//add if it is new
          array.push(id);
          droppedItem.attr('id', id);
          var temp_selector="."+season+" ul";
          $(temp_selector).append(droppedItem);
        }
        else{//it was used for this season
            alert(season+" time already had this month");
        }
}
