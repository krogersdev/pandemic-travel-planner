    /** Globals **/


    /** NODE Getters **/
    const mainDiv = () => document.getElementById("main");

    const homePageLink = () => document.getElementById("home-page-link");

    const searchPageLink = () => document.getElementById ("search-page-link");

    // debugger;

    /** Templates **/
    const homePageTemplate = () => {
        return ` 
        <h2 class="center-align">Welcome to our Pandemic Travel Planner</h2>
        `
    };

    const searchPageTemplate = () => {
        return `
        <h2>Coronavirus and Weather data</h2>
        <table class="highlight">
          <thead>
            <tr>
                <th>Cases</th>
                <th>Deaths</th>
                <th>Active</th>
                <th>Tests</th>
                <th>Recovered</th>
                <th>Population</th>
              </tr>
        </thead>
          <tbody>
            <tr>
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
   }

   const renderSearchPage = () => {
       mainDiv().innerhtml = searchPageTemplate();
   };

   /** When the DOM Loads **/
    document.addEventListener('DOMContentLoaded', () => {
        // renderHomePage();
        homePageLinkEvent();
        searchPageLinkEvent();
    });    

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
            //calls render search location table page with data 

        });  
    };
   


