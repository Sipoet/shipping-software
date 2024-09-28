import { Application } from "@hotwired/stimulus"

const application = Application.start()

// Configure Stimulus development experience
application.debug = false
window.Stimulus   = application

export { application }
import $ from 'jquery'
$('.btn-expand-collapse').click(function(e) {
  $('.navbar-primary').toggleClass('collapsed');
});