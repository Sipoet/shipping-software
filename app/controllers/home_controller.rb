class HomeController < ApplicationController
  before_action :authenticate_user!

  def dashboard
  end

  def dashboard2
    render :dashboard, layout: 'application_react'
  end
end
