// Winter = December, January, February 0 - 2
// Spring =  March, April, May 3 -5
// Summer = June, July, August 6 - 8
// Autumn = September, October, November 9 -11
class Seasons{
    static const season = {
      SUMMER: 'summer',
      WINTER: 'winter',
      SPRING: 'spring',
      FALL: 'fall'
    }
}

function getCurrentSeason()
{
    var seasonNum = varCurrentTime.getMonth(); // 0 -11
    var seasonName;

    if(seasonNum >= 0 || seasonNum <= 2){
        seasonName = Seasons.season.WINTER;
    }
    if(seasonNum >= 3 || seasonNum <= 5){
        seasonName = Seasons.season.SPRING;
    }
    if(seasonNum >= 6 || seasonNum <= 8){
        seasonName = Seasons.season.SUMMER;
    }
    else{
        seasonName = Seasons.season.FALL;
    }

    return seasonName;
}