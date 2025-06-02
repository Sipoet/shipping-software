class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  include BreadcrumbGenerator
  include TableSearchParamsExtractor
  include ResponseJsonHelper

  before_action :set_locale
  allow_browser versions: :modern

  class ApplicationController::UnauthorizedUser < StandardError; end

  rescue_from ActiveRecord::RecordNotFound, with: :json_not_found
  rescue_from UnauthorizedUser, with: :response_not_authorize

  protected

  def authorize_user!(resource, *actions)
    authenticate_user!
    list = get_authorize_list(current_user.role_id)
    authorize_action!(actions: actions.flatten,resource: resource.to_s, list: list)
  end

  def render_home
    render 'home/dashboard'
  end
  # default authorize for DRY
  def authorize_user_based_action!
    resource = self.controller_name.singularize.underscore
    case self.action_name
    when 'index'
      Rails.logger.debug "masuk index #{resource}"
      authorize_user!(resource, [:read,:select_read])
    when 'show'
      authorize_user!(resource, :read)
    when 'create', 'new'
      authorize_user!(resource, :create)
    when 'update', 'edit'
      authorize_user!(resource, :update)
    when 'destroy'
      authorize_user!(resource, :delete)
    else
      authorize_user!(resource, self.action_name)
    end
  end

  protected

  def get_authorize_list(role_id)
    cache = $redis.get("authorizations-#{role_id}")
    return JSON.parse(cahe) if cache.present?
    RoleAuth.where(role_id: role_id)
            .group_by(&:auth_controller)
            .each_with_object({}) do |(resource,values),obj|
      obj[resource] = {}
      values.each do |auth|
        obj[resource][auth.auth_action] = true
      end
    end
  end

  private
  def response_not_authorize
    render json: {message:'Not Authorized. Contact your admin for permission'}, status: :forbidden
  end

  def authorize_action!(actions: ,resource:, list:)
    return if list['all']
    Rails.logger.debug"=== not all"
    raise UnauthorizedUser if list[resource].nil?
    Rails.logger.debug"=== resource #{resource} exists"
    return if list.dig(resource,'all')
    Rails.logger.debug"=== resource #{resource} action not all"
    actions.each do |action|
      Rails.logger.debug"=== resource #{resource} action #{action}"
      return if list.dig(resource,action.to_s)
    end
    raise UnauthorizedUser
  end

  def set_locale
    I18n.locale = :id
  end

  def json_not_found
    render json:{message:"data #{params[:id]} tidak ditemukan"},status: :not_found
  end


end
