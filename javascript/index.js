    /** Globals **/


    /** NODE Getters **/

    const mainDiv = () => document.getElementById("main");

    const homePageLink = () => document.getElementById("home-page-link");



    /** Templates **/

    const homePageTemplate = () => {
        return ` 
        <h2>Welcome to our Pandemic Travel Planner</h2>
        `
    }


    /** Renderers **/

   function renderHomePage () {
       mainDiv().innerHTML = homePageTemplate()
   }


   /** When the DOM Loads **/

    document.addEventListener('DOMContentLoaded', () => {
        renderHomePage();
       
    })    


    /** Events **/

    const homePageLinkEvent = () => {
        homePageLink().addEventListener('click', (e) => {
            e.preventDefault();
            renderHomePage();
        })
    }

