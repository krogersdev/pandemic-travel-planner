    /** Globals **/
    const dataUrl = "https://disease.sh/v3/covid-19/states?sort=cases%2C%20tests%2C%20deaths%2C%20active%2C%20recovered%2C%20population&yesterday=yesterday"
    let allStates = [];
      
    /** NODE Getters **/
    const mainDiv = () => document.querySelector("#main");

    const homePageLink = () => document.querySelector("#home-page-link");

    const searchPageLink = () => document.querySelector ("#search-page-link");

    const tableBody = () => document.querySelector("#tableBody");
    
    // debugger;

    /** Templates **/
    const homePageTemplate = () => {
        return ` 
        <h2>Welcome to our Pandemic Travel Planner</h2>
        `
    };

    const searchPageTemplate = () => {
        return `
        <h2>Coronavirus and Weather data</h2>
        <div class="row">
            <form class="input-field col s6">
                <input type="search" id="stateSearch" placeholder="Lookup by state" size="50">
                <span class="helper-text">e.g. Florida</span><br>
                <input type="submit" value="Submit">
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
              </tr>
        </thead>
          <tbody id="tableBody">
            <tr>
                <td>state</td>
                <td>cases</td>
                <td>deaths</td>
                <td>active</td>
                <td>tests</td>
                <td>recovered</td>
                <td>population</td>
            </tr>
          </tbody>
        </table>
        `
    };
    
    /** Renderers **/
   const renderHomePage = () => {
       mainDiv().innerHTML = homePageTemplate();
   };

   const renderSearchPage = () => {
       mainDiv().innerHTML = searchPageTemplate();
   };
   
   /** Events **/
   const homePageLinkEvent = () => {
       homePageLink().addEventListener('click', (e) => {
           e.preventDefault();
           renderHomePage();
           
        });
    };
    
    const searchPageLinkEvent = () => {
        searchPageLink().addEventListener('click', (e) => {
            e.preventDefault();
            renderSearchPage();            
            
        });  
    };

    fetch(dataUrl)
    .then(response => response.json())
    .then(data => {
        allStates = data   
        console.log(allStates)
    });

    
    /** When the DOM Loads **/
   document.addEventListener('DOMContentLoaded', () => {
       renderHomePage();
       homePageLinkEvent();
       searchPageLinkEvent();
   });    
    

