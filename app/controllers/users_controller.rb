class UsersController < ApplicationController
  before_action :authorize_user_based_action!, except:[:profile,:update]
  skip_before_action :verify_authenticity_token
  def index
    search_json
  end

  def show
    find_record!
    @record
  end

  def profile
    authenticate_user!
    @record = current_user
  end

  def create
    permitted_params = permit_params
    @record = User.new(permitted_params)
    if @record.save
      render json: {message: 'sukses simpan',data: @record}, status: :created
    else
      render_json_error(@record)
    end
  end

  def update
    authenticate_user!
    if params[:id] == 'profile'
      @record = current_user
    else
      authorize_user_based_action!
      find_record!
    end
    permitted_params = permit_params
    if @record.update(permitted_params)
      render json: {message: 'sukses simpan',data: @record}, status: :ok
    else
      render_json_error(@record)
    end
  end

  def set_active
    find_record!
    if @record.update(is_active: true)
      render json: {message: 'sukses aktivasi',data: @record}, status: :ok
    else
      render_json_error(@record)
    end
  end

  def set_inactive
    find_record!
    if @record.update(is_active: false)
      render json: {message: 'sukses deaktivasi',data: @record}, status: :ok
    else
      render_json_error(@record)
    end
  end

  def force_sign_out
    find_record!
    if @record.update(jti: SecureRandom.uuid)
      render json: {message: 'sukses simpan',data: @record}, status: :ok
    else
      render_json_error(@record)
    end
  end

  private

  def permit_params
    params
      .required(:user)
      .permit(:username, :password, :password_confirmation,:role_id,:email)
  end

  def find_record!
    @record = User.find(params[:id])
  end

  def search_json
    result = extract_search_query(params, User)
    @records = User.all
                  .includes(:role)
                  .order(result.order)
    result.filter.each do|query_filter|
      @records = @records.where(query_filter)
    end
    if result.search_text.present?
      columns = ['email', 'username']
      query = columns.map{|column|"#{column} ilike ?"}.join(' OR ')
      @records = @records.where(query,*Array.new(columns.length){"%#{result.search_text}%"})
    end
    @records = @records.page(result.page)
                           .per(result.limit)
  end
end
