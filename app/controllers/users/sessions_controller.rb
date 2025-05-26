# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  before_action :configure_sign_in_params, only: [:create]
  skip_before_action :verify_authenticity_token, only:[:refresh_token, :destroy]
  rescue_from ActionController::InvalidAuthenticityToken do
      render json:{code:'csrf'}, status: :unprocessable_entity
  end

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
    if !user.active?
      render_user_not_active
      return
    end
    if user.valid_password?(permitted_params[:password])
      sign_in user, store: false
      response.set_cookie("refresh_token", RefreshTokenGenerator.new(user).cookie)
      render json: {token: user.jti, location: after_sign_in_path_for(user)}
    else
      render_invalid_username_or_password
    end
  end

  def refresh_token
    refresh_token = request.cookies["refresh_token"]

    return render json: {message: "Token is required"}, status: :unauthorized if refresh_token.nil?

    begin
      payload = JWT.decode(refresh_token, Rails.application.credentials.devise_jwt_secret_key, true)[0]

      current_user = User.find_by(id: payload["sub"], jti: payload["jti"])

      return render json: {message: "Token is invalid"}, status: :unauthorized if current_user.nil?

      current_user.update(jti: SecureRandom.uuid)
      new_token = Warden::JWTAuth::UserEncoder.new.call(current_user, :user, nil).first

      response.set_cookie("refresh_token", RefreshTokenGenerator.new(current_user).cookie)
      response.set_header("Authorization", "Bearer #{new_token}")
      render json: {message: "Token refreshed"}, status: :ok
    rescue JWT::VerificationError
      render json: {message: "Token is invalid"}, status: :unauthorized
    end
  end

  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  def configure_sign_in_params
    devise_parameter_sanitizer.permit(:sign_in, keys: [:username,:remember_me])
  end

  def respond_to_on_destroy
    response.delete_cookie("refresh_token")
    head :no_content
  end

  private

  def render_invalid_username_or_password
    render json:{message: "username atau password salah"}, status: :unprocessable_entity
  end

  def render_user_not_active
    render json:{message: "User belum aktif. Hubungi Admin untuk mengaktifkan user"}, status: :unprocessable_entity
  end

  def respond_with(resource, opts = {})
    if resource.is_a?(User)
      render json: {user: resource, location: opts[:location]}
    end
  end

end
