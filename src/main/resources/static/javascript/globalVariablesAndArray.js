var door_array=[];//the array for doors !
var locked_array_door= [ "false", "false", "false","false", "false","false", "false","false"];
var locked_array_window=["false", "false"];
var light_array=[];//array for lights
var window_array=[];//array for window
var room_array=[];//array for the rooms
var option;
var user_array=[];//an array for controlling the user in the house
var autoMode=false;//boolean for auto mode

// For Continuous Monitoring
var temperatureTimeout = 1000;

// var shh = new SHH('15.5');
var summer_month=[];
var winter_month=[];
var HVAC_array=[];
var desiredWinterTemp = 21;
var desiredSummerTemp = 21;

