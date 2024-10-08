import { Controller } from "@hotwired/stimulus"
import {Sidebar} from "@coreui/coreui/dist/js/coreui.bundle.min"
export default class extends Controller {
  toggleSidebar(event){
    event.preventDefault()
    let sidebarEl = document.querySelector('#sidebar')
    console.log(sidebarEl)
    let sidebarInstance = Sidebar.getInstance(sidebarEl)
    console.log(sidebarInstance)
    sidebarInstance.toggle()
    // document.querySelector('#sidebar').classList.toggle('hide')
  }
}
