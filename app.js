//import std modules
import express  from "express";
import bodyParser from "body-parser";
import axios from "axios";

//set express
const app = express();

//set body-parser
app.use(bodyParser.urlencoded({extended : true}));

//static folder visible
app.use(express.static('public'));

//set EJS template engine
app.set('view engine', 'ejs');

//var declaration (use for globally)
var location;
var url1;
var url2;
var weather_obj;
var aqi_obj;
var msg="";

//var declaration (use for weather data)
var location_name;
var temp;
var description;
var icon_no;
var icon_url;
var humidity;
var air_pressure;
var wind_speed;

//var declaration (use for aqi data)
var aqi;
var aqi_text;
var o3, co, no2;

//Welcome Page
app.get('/', async(req, res) => {
    
    location = "Pune";

    try{
        url1 = 'https://api.openweathermap.org/data/2.5/weather?appid=12373943e2d014434396e51558183738&q='+ location +'&units=metric'
        weather_obj = await axios.get(url1);

        //AQI Data found, process data
        url2 = 'https://api.openweathermap.org/data/2.5/air_pollution?lat='+ weather_obj.data.coord.lat +'&lon=' + weather_obj.data.coord.lon + '&appid=12373943e2d014434396e51558183738';
        aqi_obj = await axios.get(url2);

        //Declare into Variable (Weather) 
        temp = weather_obj.data.main.temp;
        description = weather_obj.data.weather[0].description;
        humidity = weather_obj.data.main.humidity;
        air_pressure = weather_obj.data.main.pressure;
        wind_speed = weather_obj.data.wind.speed;
        location_name = weather_obj.data.name;
        icon_no = weather_obj.data.weather[0].icon;
        icon_url = "https://openweathermap.org/img/wn/" + icon_no + "@2x.png"
        
        //Declare into Variable (AQI)
        aqi = aqi_obj.data.list[0].main.aqi;
        o3 = aqi_obj.data.list[0].components.o3;
        co = aqi_obj.data.list[0].components.co;
        no2 = aqi_obj.data.list[0].components.no2;

    }catch(error){

        if (error.code === 'ENOTFOUND')
        {
            // Handle internet connection issue
            console.log('Please check the internet connection!');
        }

        else if(error.code === 'ERR_BAD_REQUEST')
        {
            msg = "Location Not Found!";

            //Set value if location are not found (Weather)
            temp='NA';
            description = 'NA';
            humidity = 'NA';
            air_pressure = 'NA'; 
            wind_speed = 'NA';
            icon_url = 'NA'

            //Set value if location are not found (AQI)
            aqi='NA';
            aqi_text='NA'; 
            o3='NA'; 
            co='NA';
            no2='NA';
        }

        else 
        {
            // Handle other errors
            console.error('An error occurred:', error.message);
        }
    }

    res.render('welcome');
});

//User Input Req. Handle
app.post('/submit', async(req, res) => {
    
   try{
        url1 = 'https://api.openweathermap.org/data/2.5/weather?appid=12373943e2d014434396e51558183738&q='+ req.body.location +'&units=metric';
        weather_obj = await axios.get(url1);

        url2 = 'https://api.openweathermap.org/data/2.5/air_pollution?lat='+ weather_obj.data.coord.lat +'&lon=' + weather_obj.data.coord.lon + '&appid=12373943e2d014434396e51558183738';
        aqi_obj = await axios.get(url2);

        msg="";

        //Declare into Variable (Weather) 
        temp = weather_obj.data.main.temp;
        description = weather_obj.data.weather[0].description;
        humidity = weather_obj.data.main.humidity;
        air_pressure = weather_obj.data.main.pressure;
        wind_speed = weather_obj.data.wind.speed;
        location_name = weather_obj.data.name;
        icon_no = weather_obj.data.weather[0].icon;
        icon_url = "https://openweathermap.org/img/wn/" + icon_no + "@2x.png"
        
        //Declare into Variable (AQI)
        aqi = aqi_obj.data.list[0].main.aqi;
        o3 = aqi_obj.data.list[0].components.o3;
        co = aqi_obj.data.list[0].components.co;
        no2 = aqi_obj.data.list[0].components.no2;

   }catch(error){
         if (error.code === 'ENOTFOUND')
        {
            // Handle internet connection issue
            console.log('Please check the internet connection!');
        }

        else if(error.code === 'ERR_BAD_REQUEST')
        {
            msg = "Location Not Found!";

            //Set value if location are not found (Weather)
            temp='NA';
            description = 'NA';
            humidity = 'NA';
            air_pressure = 'NA'; 
            wind_speed = 'NA';
            icon_url = 'NA'

            //Set value if location are not found (AQI)
            aqi='NA';
            aqi_text='NA'; 
            o3='NA'; 
            co='NA';
            no2='NA';
        }

        else 
        {
            // Handle other errors
            console.error('An error occurred:', error.message);
        }

   }

    res.redirect('/home');
});

//Home Page
app.get('/home', (req, res) => {
    
    //AQI Description
    switch(aqi)
    {
        case 1:
            aqi_text = "Good";
            break;
        case 2:
            aqi_text = "Fair";
            break;
        case 3:
            aqi_text = "Moderate";
            break;
        case 4:
            aqi_text = "Poor";
            break;
        case 5:
            aqi_text = "Very Poor";
            break;
        default:
            aqi_text = "NA";
            break;
    }

    res.render('index', {
        
        //Render Data (Weather)
        temp : temp,
        description : description,
        humidity : humidity,
        air_pressure : air_pressure,
        wind_speed : wind_speed,
        location : location_name,
        icon : icon_url,

        //Render Data (AQI)
        aqi : aqi_text,
        o3 : o3,
        co : co,
        no2 : no2,

        //Render Data (Other)
        msg : msg

    });
})

//Page Not Found
app.get('/error', (req, res) => {
    res.render('error_404');
});

//Local Port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    // console.log(`Server Running at : http://localhost:${port}`);
    console.log("Server is Online...");
});