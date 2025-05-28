class HomeController < ApplicationController

  def dashboard
    render :dashboard
  end

  def company_image
    company = SystemSetting.get('company')
    send_file Rails.root.join(company[:company_image_path])
  end
end
