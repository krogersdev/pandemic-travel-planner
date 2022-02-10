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
        <form class="input-field col s6">
            <label for="stateSearch">Lookup by state</label><br>
            <input list="match-list" id="stateSearch" onclick ="inputEvent()"  name="match-list" size="50">
            <datalist id="match-list"></datalist>
            <span class="helper-text">e.g. Florida</span><br>
            <input type="submit" >
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

const tableBodyTemplate = (stateData) => {
    let tableData = `
    <tr>
        <td>${stateData.state}</td>
        <td>${stateData.cases.toLocaleString('en-US')}</td>
        <td>${stateData.deaths.toLocaleString('en-US')}</td>
        <td>${stateData.active.toLocaleString('en-US')}</td>
        <td>${stateData.tests.toLocaleString('en-US')}</td>
        <td>${stateData.recovered.toLocaleString('en-US')}</td>
        <td>${stateData.population.toLocaleString('en-US')}</td>
        <td>${new Date(stateData.updated).toDateString()}</td>
        </tr>
    `
    tableBody().innerHTML+= tableData
}; 

const searchInputTemplate = (match) => {
    const option = document.createElement('option')
    option.value = match.state
    matchList().append(option)
};

/*** Renderers ***/
const renderHomePage = () => {
    mainDiv().innerHTML = homePageTemplate();
};

const renderSearchPage = () => {
    mainDiv().innerHTML = searchPageTemplate()
    renderTableBody();
    
};

const renderTableBody = () => {
return statesData.forEach(stateData => tableBodyTemplate(stateData))   
};   

const renderSearchInput = (match) => {
     matchList().innerHTML = ""
     match.map(state => searchInputTemplate(state))
};

/*** Events ***/
const inputEvent = () => {
    lookUpState().addEventListener('input', (event) => {
        event.preventDefault()
        let searchText = (event.target.value)
                       
        let match = statesData.filter(name => {
            let stateName = (name.state).toLowerCase()

            return stateName.startsWith(searchText)
        })
        renderSearchInput(match)
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
        renderHomePage();
        
    });
};

const searchPageLinkEvent = () => {
    searchPageLink().addEventListener('click', async(e) => {
        e.preventDefault();
        await loadData();
        await renderSearchPage();
        
        // submitEvent();          
    });  
};

/*** When the DOM Loads ***/
document.addEventListener('DOMContentLoaded', () => {
    renderHomePage();
    homePageLinkEvent();
    searchPageLinkEvent();
 }); 

