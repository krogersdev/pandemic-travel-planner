/** Globals **/
const covidApiUrl = 'https://disease.sh/v3/covid-19/states?sort=todayCases&yesterday=yesterday';

const baseUrl = 'http://api.weatherapi.com/v1';

const apiKey = 'eaa20489464147259db164348221602';

const endPoint = 'America/Puerto_Rico&days=5&aqi=no&alerts=no';

let statesData = [];

let weatherData = [];

const forDeletion = ['Veteran Affairs', 'Diamond Princess Ship', 'Wuhan Repatriated', 'Grand Princess Ship', 'Federal Prisons', 'US Military', 'American Samoa'];

/*** NODE Getters ***/
const mainDiv = () => document.querySelector("#main");

const homePageLink = () => document.querySelector("#home-page-link");

const searchPageLink = () => document.querySelectorAll ("a#search-page-link");

const covidDataTableBody = () => document.querySelector("#tableBody");

const selectForm = () => document.querySelector("form");

const autocompleteList = () => document.querySelector('#state-name');// output list of states names to auto populate

const forecastData = () => document.querySelector('#forecastData');// output weather information for single state

/** Templates **/
const homePageTemplate = () => {
    return ` 
    <h1 class="center-align">Welcome to our Pandemic Travel Planner</h1>
    <br>
    <p class="center-align, "flow-text">This pandemic travel planner was created for domestic united states travelers. The search locations feature allows users to compare updated statistics and weather forecast by state, assisting you to make informed trip decisions.</p>
    <div class="valign-wrapper">
    <img class="materialboxed, responsive-img"  width="auto" src="img/Picture1.png" alt="logo">
    </div>
    `
};

const searchPageTemplate = () => {
    return `
    <h1>Location data and weather forecast</h1>
    <div class="row">
        <form class="col s6">
            <label for="stateSearch" class="active">Lookup by state</label><br>
            <input list="state-name" id="stateSearch" name="stateSearch" size="50">
                <datalist id="state-name"></datalist>
                <span class="helper-text">Data and weather per state: e.g. Florida</span>
                <br>
            <input type="submit">
        </form>
    </div>
    <table class="highlight responsive-table">
        <thead>
        <small>Sorted by: New Cases</small>
        <tr>
            <th>State Name</th>
            <th>New Cases</th>
            <th>New Deaths</th>
            <th>Total Cases</th>
            <th>Total Tests</th>
            <th>Total Recovered</th>
            <th>Total Deaths</th>
            <th>Population</th>
            <th>Updated</th>
            </tr>
    </thead>
        <tbody id="tableBody">
        </tbody>
        <br>  

    </table>
    <table class="centered responsive-table">
        <tbody>
            <tr id="forecastData"> </tr>
        </tbody>
    </table>  
    `
};

const tableBodyTemplate = (stateObj) => {
     let tableData = `
    <tr>
    <td>${stateObj.state}</td>
    <td>${stateObj.todayCases.toLocaleString('en-US')}</td>
    <td>${stateObj.todayDeaths.toLocaleString('en-US')}</td>
    <td>${stateObj.cases.toLocaleString('en-US')}</td>
    <td>${stateObj.tests.toLocaleString('en-US')}</td>
    <td>${stateObj.recovered.toLocaleString('en-US')}</td>
    <td>${stateObj.deaths.toLocaleString('en-US')}</td>
    <td>${stateObj.population.toLocaleString('en-US')}</td>
    <td>${new Date(stateObj.updated - 8.64e+7).toDateString()}</td>
    </tr>
    
    `
    covidDataTableBody().innerHTML+= tableData;
}; 

const weatherForecastData = (forecast) => {
     let weatherCard = `
    <td>
        <p class="p"> 
            <strong>
            ${new Date((forecast.date).replace(/-/g, '\/')).toDateString()}
            </strong>
        </p> 
        <img style="width: 64px;" src='https:${forecast.day.condition.icon}' alt="${forecast.day.condition.text}"> 
        <br>
            ${forecast.day.condition.text}
        <br>
        <span style="color:red;">Hi: ${forecast.day.maxtemp_f} F
        </span>
            "/"
        <span style="color:blue;">Lo: ${forecast.day.mintemp_f} F
        </span>
    </td>`
    
    forecastData().innerHTML += weatherCard
};

/** Renderers **/
const renderWeatherData = (forecast) => {
    forecastData().innerHTML ="";
    forecast.forEach(map => weatherForecastData(map))
}

const renderHomePage = () => mainDiv().innerHTML = homePageTemplate();

const renderSearchPage = () => {
    mainDiv().innerHTML = searchPageTemplate();  
    renderAutocompleteList(); 
    renderCovidData(statesData);
};

const renderAutocompleteList = () => {   
    return statesData.map(elem => { 

        const option = document.createElement('option');
        option.value = elem.state

        autocompleteList().append(option);
    });
};

const renderCovidData = (statesData) => {
    covidDataTableBody().innerHTML ="";

    statesData.map(stateObj => tableBodyTemplate(stateObj));
};

/** Event Handler  **/
const eventHandler = (userInput) => {
    let matches = statesData.filter(obj => { 
        const regex = new RegExp(`^${userInput}`, 'gi');
        
        return obj.state.match(regex)
    })
    if (matches.length === 1) {
        renderCovidData(matches);
        getWeatherData(matches)

    } else if (matches.length > 1) {
        forecastData().innerHTML =""; 
        renderCovidData(matches)
    }
}

const initalizeMaterialize = () => {      
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, {})
}

/** Events **/
const submitEvent = () => {
    selectForm().addEventListener('submit', (event) => {
        event.preventDefault();
        eventHandler(event.target.stateSearch.value);
    });
}

const loadCovidApiData = async() => {
    const resp = await fetch(covidApiUrl)
    const data = await resp.json()
    statesData = data

    statesData = statesData.filter(item => !forDeletion.includes(item.state))
};

const getWeatherData = async(stateName) => {
    const resp = await fetch(`${baseUrl}/forecast.json?key=${apiKey}&q=${stateName[0].state},${endPoint}`)
    const data = await resp.json()
    weatherData = data
    
    let weatherArray = Object.entries(weatherData.forecast)
    weatherArray.map(forecast => renderWeatherData(forecast[1]))  //forEach does not wait for promises
}

const homePageLinkEvent = () => {
    homePageLink().addEventListener('click', (event) => {
        event.preventDefault();
        renderHomePage();       
    });
};

const searchPageLinkEvent = () => {
    searchPageLink().forEach(link => {
        link.addEventListener('click', async(e) => {
            e.preventDefault();
            await loadCovidApiData();
            renderSearchPage();
            submitEvent();
        });  

    })
}

/*** When the DOM Loads ***/
document.addEventListener('DOMContentLoaded', () => {
    renderHomePage();  
    homePageLinkEvent();
    searchPageLinkEvent(); 
    initalizeMaterialize();
})
// debugger
