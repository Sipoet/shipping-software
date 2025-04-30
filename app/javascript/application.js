// import "@hotwired/turbo-rails"

// // import * as bootstrap from "bootstrap"
// // import "@coreui/coreui"
// import "simplebar"

// const header = document.querySelector('header.header');

// document.addEventListener('scroll', () => {
//   if (header) {
//     header.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0);
//   }
// });
// // import * from "@coreui/utils"
// import "./controllers"
// // import "chart.js"
// import "@coreui/chartjs"
console.log('masuk')

import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

import App from './App'
import store from '@coreui/coreui-free-react-admin-template/src/store'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
     <App />
  </Provider>,

)