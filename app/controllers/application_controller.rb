class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  include BreadcrumbGenerator
  include TableSearchParamsExtractor

  before_action :init_main_breadcrumbs, :set_locale
  # allow_browser versions: :modern

  private
  def init_main_breadcrumbs
    init_breadcrumb
    add_breadcrumb(root_path, 'Dashboard')
  end


  def set_locale
    I18n.locale = :id
  end
end
