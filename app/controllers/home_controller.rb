class HomeController < ApplicationController
  before_action :authenticate_user!

  def dashboard
    render :dashboard
  end

  def dashboard2
    render :dashboard, layout: 'application_old'
  end

  def company_image

  end
end
