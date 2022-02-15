/** Globals **/
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


/** Renderers **/
const renderHomePage = () => {
    mainDiv().innerHTML = homePageTemplate();
    
};

const renderSearchPage = () => {
    mainDiv().innerHTML = searchPageTemplate()  //table tags are updated 
    renderStatesToDataList(); 
    renderTable(statesData);
};

const renderStatesToDataList = () => {   //possible change to autocomplete
    return statesData.map(elem => { 
        const option = document.createElement('option')
        option.value = elem.state
        matchList().appendChild(option)
    });
};

const renderTable = (statesData) => {
    
    return statesData.map(stateObj => { 

        tableBodyTemplate(stateObj)  //mapping objects/data to table 
    });
};


/** Event Handler  **/
const eventHandler = (event) => {
    let stateObjsArr = statesData

    let input = event

    if( input.length < 0 ) {
      
        renderTable(stateObjsArr)
    }
   
    let matches = stateObjsArr.filter(obj => { 
        const regex = new RegExp(`^${input}`, 'gi');
        return obj.state.match(regex)
        
                
    })
    tableBody().innerHTML = ""
    renderTable(matches);
    //filter the data and perform a match with if else stmts base on submit 
}


/** Events **/
const onChangeEvent = () => {
    lookUpState().addEventListener('input', (event) => {
    event.preventDefault();
    console.log(event.target.value)
     nIntervId = setInterval(eventHandler(event.target.value), 3000)
console.log(nIntervId)
    })

}

const submitEvent = () => {
    selectForm().addEventListener('submit', (event) => {
        event.preventDefault();
        eventHandler(event.target.stateSearch.value);
    });
}

const fetchApiData = async() => {
    const resp = await fetch(dataUrl)
    const data = await resp.json();
    statesData = data;
};

const homePageLinkEvent = () => {
    homePageLink().addEventListener('click', (event) => {
        event.preventDefault();
        renderHomePage();       //takes user back to homepage when clicked 
    });
};

const searchPageLinkEvent = () => {
    searchPageLink().addEventListener('click', async(e) => {
        e.preventDefault();
        await fetchApiData();
        renderSearchPage();
        submitEvent();
        onChangeEvent();
    });  
};


/*** When the DOM Loads ***/
document.addEventListener('DOMContentLoaded', () => {
    renderHomePage();  
    homePageLinkEvent();
    searchPageLinkEvent();         
})
