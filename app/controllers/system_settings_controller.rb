class SystemSettingsController < ApplicationController

  def index
    search_json
  end

  def show
    find_record!
    @record
  end

  def create
    permitted_params = permit_params
    @record = SystemSetting.new(permitted_params)
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

  def destroy
    find_record!
    permitted_params = permit_params
    if @record.destroy
      render json: {message: 'sukses simpan',data: @record}, status: :ok
    else
      render_json_error(@record)
    end
  end

  private

  def permit_params
    params
      .required(:system_setting)
      .permit(:keyname, :user_id, :value)
  end

  def find_customer!
    @record = SystemSetting.find(params[:id])
  end

  def search_json
    result = extract_search_query(params, SystemSetting)
    @records = SystemSetting.all
                         .includes(:user)
                         .order(result.order)
    result.filter.each do|query_filter|
      @records = @records.where(query_filter)
    end
    if result.search_text.present?
      columns = ['keyname', 'users.username']
      query = columns.map{|column|"#{column} ilike ?"}.join(' OR ')
      @records = @records.where(query,*Array.new(columns.length){"%#{result.search_text}%"})
    end
    @records = @records.page(result.page)
                           .per(result.limit)
  end

end
