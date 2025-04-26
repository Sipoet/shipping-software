import "@hotwired/turbo-rails"

// import * as bootstrap from "bootstrap"
// import "@coreui/coreui"
import "simplebar"

const header = document.querySelector('header.header');

document.addEventListener('scroll', () => {
  if (header) {
    header.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0);
  }
});
// import * from "@coreui/utils"
import "./controllers"
// import "chart.js"
// import "@coreui/chartjs"


