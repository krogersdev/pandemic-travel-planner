/*** Globals ***/
const dataUrl = "https://disease.sh/v3/covid-19/states?sort=active&yesterday=yesterday"

let statesData = [];
    
/*** NODE Getters ***/
const mainDiv = () => document.querySelector("#main");

const homePageLink = () => document.querySelector("#home-page-link");

const searchPageLink = () => document.querySelector ("#search-page-link");

const tableBody = () => document.querySelector("#tableBody");

const selectForm = () => document.querySelector("form");

const lookUpState = () => document.querySelector('#stateSearch');//input comes from here 

const matchList = () => document.querySelector('#match-list');// output list of states names to auto populate

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
            <input type="text" list="match-list" id="stateSearch" onchange ="inputEvent()" name="stateSearch" size="50">
                <datalist id="match-list"></datalist>
                <span class="helper-text">e.g. Florida</span>
                <br>
            <input type="submit" id="submitEvent">
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

const searchInputTemplate = (name) => {   //possible change to autocomplete
    const option = document.createElement('option')
    option.value = name.state
    matchList().appendChild(option)
};

/*** Renderers ***/
const renderHomePage = () => {
    mainDiv().innerHTML = homePageTemplate();
};

const renderSearchPage = () => {
    let stateArray = statesData
    mainDiv().innerHTML = searchPageTemplate()
    renderTableBody(stateArray);
};

const renderTableBody = (stateArray) => {
    let data = stateArray
    data.map(stateObj => tableBodyTemplate(stateObj))   
};   

const renderSearchInput = (matchingObj) => {    
    let data = matchingObj
     matchList().innerHTML = ""
     data.map(name => searchInputTemplate(name)) //possible change to autocomplete
};

/** Event Handler */
const eventHandler = (searchText) => {
    let input = searchText.toLowerCase()

    let matchingObj = statesData.filter(name => {
        
        let stateName = (name.state).toLowerCase()
        return stateName.startsWith(input)
    })   
        return matchingObj
}

/*** Events ***/
const submitEvent = () => {
    selectForm().addEventListener('submit', (event) => {
        event.preventDefault();
        let stateInput = (event.target[0].value)
        let matchingObj = eventHandler(stateInput)
        tableBody().innerHTML = ""
        renderTableBody(matchingObj)
    })
}
const inputEvent = () => {
    lookUpState().addEventListener('input', (event) => {
        event.preventDefault()
        if(event.target.value === ""){
            renderSearchPage()
        }
       let inputText = (event.target.value)
       let matchingObj = eventHandler(inputText) 
       renderSearchInput(matchingObj)
    })    
};

const loadData = async() => {
    const resp = await fetch(dataUrl)
    const data = await resp.json();
    statesData = data;
};

const homePageLinkEvent = () => {
    homePageLink().addEventListener('click', (e) => {
        e.preventDefault();
        renderHomePage();       //takes user back to homepage when clicked 
    });
};

const searchPageLinkEvent = () => {
    searchPageLink().addEventListener('click', async(e) => {
        e.preventDefault();
        await loadData();
        await renderSearchPage();
        submitEvent();
    });  
};

/*** When the DOM Loads ***/
document.addEventListener('DOMContentLoaded', () => {
    renderHomePage();
    homePageLinkEvent();
    searchPageLinkEvent();        
})
