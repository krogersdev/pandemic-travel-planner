/** Globals **/
const covidApiUrl = 'https://disease.sh/v3/covid-19/states?sort=active&yesterday=yesterday'

let statesData = [];

let weatherData = [];

let forDeletion = ['Veteran Affairs', 'Diamond Princess Ship', 'Wuhan Repatriated', 'Grand Princess Ship', 'Federal Prisons', 'US Military', 'American Samoa']

/*** NODE Getters ***/
const mainDiv = () => document.querySelector("#main");

const homePageLink = () => document.querySelector("#home-page-link");

const searchPageLink = () => document.querySelector ("#search-page-link");

const tableBody = () => document.querySelector("#tableBody");

const selectForm = () => document.querySelector("form");

const lookUpState = () => document.querySelector('#stateSearch');//input comes from here 

const matchList = () => document.querySelector('#match-list');// output list of states names to auto populate

const forecastData = () => document.querySelector('#forecastData');// output weather information for single state

const updateForecastData = () => document.querySelector('.responsive');

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
    <h1>Coronavirus Travel location and weather forecast</h1>
    <div class="row">
        <form class="col s6">
            <label for="stateSearch" class="active">Lookup by state</label><br>
            <input type="text" list="match-list" id="stateSearch" name="stateSearch" size="50">
                <datalist id="match-list"></datalist>
                <span class="helper-text">Cases and weather per state: e.g. Florida</span>
                <br>
            <input type="submit">
        </form>
    </div>
    <table class="highlight">
        <thead>
        <div>Sorted by: Active cases</div>

        <tr>
            <th>State</th>
            <th>Cases</th>
            <th>Deaths</th>
            <th>Active</th>
            <th>Tests</th>
            <th>Recovered</th>
            <th>Population</th>
            <th>Updated</th>
            </tr>
    </thead>
        <tbody id="tableBody">
        
        
        </tbody>
    </table>
    `
};

const tableBodyTemplate = (stateObj) => {

     let tableData = `
    <tr>
    <td>${stateObj.state}</td>
    <td>${stateObj.cases.toLocaleString('en-US')}</td>
    <td>${stateObj.deaths.toLocaleString('en-US')}</td>
    <td>${stateObj.active.toLocaleString('en-US')}</td>
    <td>${stateObj.tests.toLocaleString('en-US')}</td>
    <td>${stateObj.recovered.toLocaleString('en-US')}</td>
    <td>${stateObj.population.toLocaleString('en-US')}</td>
    <td>${new Date(stateObj.updated).toDateString()}</td>
    </tr>
    
    `
    
    tableBody().innerHTML+= tableData
}; 

const weatherDataTemplate = () => {
    let table = document.createElement('TABLE');
    table.className = "responsive"
    
    const weatherTemplate = `
    <tbody>
    <tr id="forecastData"></tr>
    </tbody>
    `    

    table.innerHTML = weatherTemplate

    mainDiv().append(table)
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
    </td>
    
`
    forecastData().innerHTML += weatherCard
};

/** Renderers **/
const renderWeatherData = (forecast) => {
    forecastData().innerHTML =""
    
    forecast.forEach(map => weatherForecastData(map))
}

const renderHomePage = () => {
    mainDiv().innerHTML = homePageTemplate();
};

const renderSearchPage = () => {
    mainDiv().innerHTML = searchPageTemplate();  
    renderAutocompleteList(); 
    renderTable(statesData);
};

const renderAutocompleteList = () => {   
    return statesData.map(elem => { 

        const option = document.createElement('option');
        option.value = elem.state

        matchList().append(option);
    });
};

const renderTable = (statesData) => {
    return statesData.map( stateObj => tableBodyTemplate(stateObj) );
};

/** Event Handler  **/
const eventHandler = (event) => {
    let stateObjsArr = statesData;
    let input = event;

    let matches = stateObjsArr.filter(obj => { 
        const regex = new RegExp(`^${input}`, 'gi');
        
        return obj.state.match(regex)
    })

    if ( matches.length === 1 ) {
        tableBody().innerHTML = "";
        renderTable(matches);
        weatherDataTemplate()
        getWeatherData(matches)

    } else if(matches.length > 1) {
        tableBody().innerHTML = "";
        renderTable(matches)
        forecastData().innerHTML =""
    }
    
}

/** Events **/
const inputEvent = () => {

    lookUpState().addEventListener('onchange', (event) => {
        event.preventDefault();
        eventHandler(event.target.value)
    })
}

const submitEvent = () => {

    selectForm().addEventListener('submit', (event) => {
        event.preventDefault();
        eventHandler(event.target.stateSearch.value);
    });
}

const loadCovidApiData = async() => {
    const resp = await fetch(covidApiUrl)
    const data = await resp.json();
    statesData = data
    
    statesData = statesData.filter(item => !forDeletion.includes(item.state));
};

function getWeatherData(stateName) {
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=eaa20489464147259db164348221602&q=${stateName[0].state},America/Puerto_Rico&days=5&aqi=no&alerts=no`)
    .then(res => res.json())
    .then(data => {
        let weatherData = Object.entries(data.forecast)
        weatherData.forEach(forecast => renderWeatherData(forecast[1]))
    })
}

const homePageLinkEvent = () => {
    homePageLink().addEventListener('click', (event) => {
        event.preventDefault();
        renderHomePage();       //takes user back to homepage when clicked 
    });
};

const searchPageLinkEvent = () => {
    searchPageLink().addEventListener('click', async(e) => {
        e.preventDefault();
        await loadCovidApiData();
        renderSearchPage();
        submitEvent();
        inputEvent();
    });  
};

/*** When the DOM Loads ***/
document.addEventListener('DOMContentLoaded', () => {
    renderHomePage();  
    homePageLinkEvent();
    searchPageLinkEvent();   
          
})
