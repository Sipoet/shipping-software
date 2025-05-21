class HomeController < ApplicationController
  before_action :authenticate_user!

  def dashboard
    render :dashboard, layout: 'application_react'
  end

  def dashboard2
    render :dashboard
  end
end
