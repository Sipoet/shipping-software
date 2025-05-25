# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  before_action :configure_sign_in_params, only: [:create]

  # GET /resource/sign_in
  def new
    # super
    render_home
  end

  # POST /resource/sign_in
  def create
    permitted_params = params.required(:user).permit(:username,:password)
    user = User.find_for_authentication(username: permitted_params[:username])
    if user.blank?
      render_invalid_username_or_password
      return
    end
    if user.valid_password?(permitted_params[:password])
      sign_in user, store: false
      render json: {token: user.jti, location: after_sign_in_path_for(user)}
    else
      render_invalid_username_or_password
    end

  end

  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end

  protected

  # If you have extra params to permit, append them to the sanitizer.
  def configure_sign_in_params
    devise_parameter_sanitizer.permit(:sign_in, keys: [:username,:remember_me])
  end

  private

  def render_invalid_username_or_password
    render json:{message: "username atau password salah"}, status: :unprocessable_entity
  end

  def respond_with(resource, opts = {})
    if resource.is_a?(User)
      render json: {user: resource, location: opts[:location]}
    end
  end

end
