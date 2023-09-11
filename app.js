//Import STD Modules
import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

//Set express
const app = express();

//Set body-parser
app.use(bodyParser.urlencoded({extended : true}));

//To make Static Folder Visible
app.use(express.static('public'));

//Set EJS Template
app.set('view engine', 'ejs');

//Variables Declration (Weather)
var temp, description, icon_no, icon_url, humidity, air_pressure, wind_speed, location_name='Pune';  

//Variables Declration (AQI)
var aqi, aqi_text, o3, co, no2;

//Variables Decleration (Other)
var msg = "";


//Error Page
app.get('/error', (req, res) => {
    res.render('error_404');
});

//Welcome Page
app.get('/', (req, res) => {
    res.render('welcome');
});

//Submit
app.post('/submit', (req, res) => {
    location_name = req.body.location;
    res.redirect('/home');
});

//Home Page
app.get('/home', async (req, res) => {

    try 
    {
        const url1 = 'https://api.openweathermap.org/data/2.5/weather?appid=12373943e2d014434396e51558183738&q='+ location_name +'&units=metric'

        // Use a library like Axios to make the HTTP request
        const response = await axios.get(url1);
        
        // Set Message Empty
        msg = "";

        // AQI Data found, process data
        const url2 = 'https://api.openweathermap.org/data/2.5/air_pollution?lat='+ response.data.coord.lat +'&lon=' + response.data.coord.lon + '&appid=12373943e2d014434396e51558183738';
        
        // Use a library like Axios to make the HTTP request
        const aqi_res = await axios.get(url2);

        // Location found, process data
        console.log("Code from Dev: 200");

        //Declare into Variable (Weather) 
        temp = response.data.main.temp;
        description = response.data.weather[0].description;
        humidity = response.data.main.humidity;
        air_pressure = response.data.main.pressure;
        wind_speed = response.data.wind.speed;
        location_name = response.data.name;
        icon_no = response.data.weather[0].icon;
        icon_url = "https://openweathermap.org/img/wn/" + icon_no + "@2x.png"
        
        //Declare into Variable (AQI)
        aqi = aqi_res.data.list[0].main.aqi;
        o3 = aqi_res.data.list[0].components.o3;
        co = aqi_res.data.list[0].components.co;
        no2 = aqi_res.data.list[0].components.no2;
    } 
    
    catch (error) 
    {
        if (error.code === 'ENOTFOUND')
        {
            // Handle internet connection issue
            console.log('Please check the internet connection!');
            // res.redirect('/error');
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
            // res.redirect('/error');
        }
    }


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
});

//Local Port 3000
const port = 3000;
app.listen(port, () => {
    console.log(`Server Running at : http://localhost:${port}`);
});
