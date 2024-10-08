import "@hotwired/turbo-rails"

// import * as bootstrap from "bootstrap"
import "@coreui/coreui/dist/js/coreui.bundle.min"
import "simplebar/dist/simplebar.min"

const header = document.querySelector('header.header');

document.addEventListener('scroll', () => {
  if (header) {
    header.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0);
  }
});
import "./controllers"
// import "chart.js/dist/chart"
// import "@coreui/chartjs/dist/js/coreui-chartjs.min"
// import "@coreui/utils/dist/umd/index"

