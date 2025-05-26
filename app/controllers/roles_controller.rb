class RolesController < ApplicationController
  before_action :authenticate_user!
  skip_before_action :verify_authenticity_token

  def index
    search_json
  end

  def show
    find_record!
    @record
  end

  def create
    permitted_params = permit_params
    @record = Role.new(permitted_params)
    if @record.save
      render json: {message: 'sukses simpan',data: @record}, status: :created
    else
      render_json_error(@record)
    end
  end

  def update
    find_record!
    permitted_params = permit_params
    if @record.update(permitted_params)
      render json: {message: 'sukses simpan',data: @record}, status: :ok
    else
      render_json_error(@record)
    end
  end

  private

  def permit_params
    params.required(:role).permit(:name)
  end

  def find_record!
    @record = Role.find(params[:id])
  end

  def search_json
    result = extract_search_query(params, Role)
    @records = Role.all.order(result.order)
    result.filter.each do|query_filter|
      @records = @records.where(query_filter)
    end
    if result.search_text.present?
      @records = @records.where('name ilike ?',"%#{result.search_text}%")
    end
    @records = @records.page(result.page)
                   .per(result.limit)
  end
end
