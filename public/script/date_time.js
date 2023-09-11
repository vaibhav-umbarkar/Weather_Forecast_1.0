function updateTime() 
{
    const date = new Date(); 
    let hours = date.getHours();
    let minutes = date.getMinutes(); 
    let ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeString = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    document.getElementById('time1').innerHTML = timeString;
    document.getElementById('time2').innerHTML = timeString;

};
setInterval(updateTime, 1000);
                
function updateDate()
{
    const now = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Frieday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Agu', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayOfWeek = daysOfWeek[now.getDay()];
    const month = months[now.getMonth()];
    const year = now.getFullYear()
    const dateString = `${dayOfWeek} ${month} ${year}`;
    document.getElementById('date1').innerHTML = dateString;
    document.getElementById('date2').innerHTML = dateString;
}
setInterval(updateDate, 1000);





