/** Globals **/
const covidApiUrl = 'https://disease.sh/v3/covid-19/states?sort=active&yesterday=yesterday'


let statesData = [];

let weatherData = [];

/*** NODE Getters ***/
const mainDiv = () => document.querySelector("#main");

const homePageLink = () => document.querySelector("#home-page-link");

const searchPageLink = () => document.querySelector ("#search-page-link");

const tableBody = () => document.querySelector("#tableBody");

const selectForm = () => document.querySelector("form");

const lookUpState = () => document.querySelector('#stateSearch');//input comes from here 

const matchList = () => document.querySelector('#match-list');// output list of states names to auto populate

const forecastData = () => document.querySelector('#forecastData');// output list of states names to auto populate

const updateForecastData = () => document.querySelector('.responsive');// output list of states names to auto populate

/** Templates **/
const homePageTemplate = () => {
    return ` 
    <h2 class="center-align">Welcome to our Pandemic Travel Planner</h2>
    `
};

const searchPageTemplate = () => {
    return `
    <h2>Coronavirus and Weather data</h2>
    <div class="row">
        <form class="col s6">
            <label for="stateSearch" class="active">Lookup by state</label><br>
            <input type="text" list="match-list" id="stateSearch" name="stateSearch" size="50">
                <datalist id="match-list"></datalist>
                <span class="helper-text">e.g. Florida</span>
                <br>
            <input type="submit">
        </form>
    </div>
    <table class="highlight">
        <thead>
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

    console.log(forecast);
   
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

    if ( input.length < 1 ) {
      renderTable(stateObjsArr);
      clearInterval(nIntervId);
    }
   
    let matches = stateObjsArr.filter(obj => { 
        const regex = new RegExp(`^${input}`, 'gi');

       
        return obj.state.match(regex)
    })
    
        tableBody().innerHTML = "";
    
        renderTable(matches);
    
}

/** Events **/
const inputEvent = () => {

    lookUpState().addEventListener('onchange', (event) => {
        event.preventDefault();

        nIntervId = setInterval(eventHandler(event.target.value), 4000)
        console.log(nIntervId)
    })
}

const submitEvent = () => {

    selectForm().addEventListener('submit', (event) => {
        event.preventDefault();
        // updateForecastData().innerHTML=""
        weatherDataTemplate()
        getWeatherData(event.target.stateSearch.value);

        eventHandler(event.target.stateSearch.value);
        debugger
    });
}

const loadCovidApiData = async() => {
    const resp = await fetch(covidApiUrl)
    const data = await resp.json();
    statesData = data;
};

function getWeatherData(stateName) {
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=eaa20489464147259db164348221602&q=${stateName},America/Puerto_Rico&days=5&aqi=no&alerts=no`)
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
