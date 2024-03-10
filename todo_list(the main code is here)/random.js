
function random_day(){
    let day=['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let random=Math.floor(Math.random()*7)+1;
    return day[random];
}
module.exports=random_day;
