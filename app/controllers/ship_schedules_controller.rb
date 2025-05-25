class ShipSchedulesController < ApplicationController
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
    @record = ShipSchedule.new(permitted_params)
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

  ShipSchedule.statuses.each do |key, int_value|
    define_method("set_#{key}") do
      find_record!
      result = @record.send("#{key}!") rescue false
      if result == false
        get_error_record
        render :show
      else
        redirect_to ship_schedule_path(id: @record.id)
      end
    end
  end

  private

  def find_record!
    @record = ShipSchedule.find(params[:id])
  end

  def permit_params
    params
      .required(:ship_schedule)
      .permit(:ship_id, :loading_port_id, :destination_port_id, :voyage, :booking_code,
              :estimated_arrived_dest_at, :estimated_arrived_sour_at, :estimated_departure_sour_at)
  end

  def search_json
    result = extract_search_query(params, ShipSchedule)
    @records = ShipSchedule
      .all
      .includes(:ship,:loading_port,:destination_port)
      .order(result.order)
    result.filter.each do|query_filter|
      @records = @records.where(query_filter)
    end
    if result.search_text.present?
      columns = ['name', 'voyage', 'booking_code']
      query = columns.map{|column|"#{column} ilike ?"}.join(' OR ')
      @records = @records.where(query,*Array.new(columns.length){"%#{result.search_text}%"})
    end
    @records_filtered = @records.count
    @records = @records.page(result.page)
                       .per(result.limit)
    @records
  end
end
