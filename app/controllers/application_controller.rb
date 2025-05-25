class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  include BreadcrumbGenerator
  include TableSearchParamsExtractor
  include ResponseJsonHelper

  before_action :init_main_breadcrumbs, :set_locale
  # allow_browser versions: :modern
  rescue_from ActiveRecord::RecordNotFound, with: :json_not_found

  private
  def init_main_breadcrumbs
    init_breadcrumb
    add_breadcrumb(root_path, 'Dashboard')
  end

  def render_home
    render 'home/dashboard'
  end

  def set_locale
    I18n.locale = :id
  end

  def json_not_found
    render json:{message:"data #{params[:id]} tidak ditemukan"},status: :not_found
  end
end
