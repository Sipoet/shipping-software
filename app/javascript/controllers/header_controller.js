import { Controller } from "@hotwired/stimulus"
import * as coreui from "@coreui/coreui"
export default class extends Controller {
  toggleSidebar(event){
    event.preventDefault()
    let sidebarEl = document.querySelector('#sidebar')
    let sidebarInstance = coreui.Sidebar.getInstance(sidebarEl)
    sidebarInstance.toggle()
    // document.querySelector('#sidebar').classList.toggle('hide')
  }
}
