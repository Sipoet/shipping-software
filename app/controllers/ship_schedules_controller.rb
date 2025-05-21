class ShipSchedulesController < ApplicationController
  before_action :root_breadcrumb, :authenticate_user!
  skip_before_action :verify_authenticity_token, only: [:create,:update]
  def index
    respond_to do |format|
      format.html {
        render :index
      }
      format.json {
        search_json
      }
    end

  end

  def show
    find_ship_schedule!
    respond_to do |format|
      format.html {
        add_breadcrumb('', @record.id)
      }
      format.json {
        @record
      }
    end

  end

  def create
    permitted_params = params
      .required(:ship_schedule)
      .permit(:ship_id, :loading_port_id, :destination_port_id, :voyage, :booking_code,
              :estimated_arrived_dest_at, :estimated_arrived_sour_at, :estimated_departure_sour_at)
    @record = ShipSchedule.new(permitted_params)
     respond_to do |format|
      format.html {
        if @record.save
          redirect_to ship_schedule_path(id: @record.id)
        else
          add_breadcrumb('', 'Tambah Baru')
          get_error_record
          render :new
        end
      }
      format.json {
        if @record.save
          render json: {message: 'sukses simpan',data: @record}, status: :created
        else
          render_json_error(@record)
        end
      }
    end
  end

  def update
    find_ship_schedule!
    permitted_params = params
      .required(:ship_schedule)
      .permit(:ship_id, :loading_port_id, :destination_port_id, :voyage, :booking_code,
              :estimated_arrived_dest_at, :estimated_arrived_sour_at, :estimated_departure_sour_at)
    respond_to do |format|
      format.html {
        if @record.update(permitted_params)
          redirect_to ship_schedule_path(id: @record.id)
        else
          add_breadcrumb(ship_schedule_path(id: @record.id), @record.id)
          add_breadcrumb('', 'Edit')
          get_error_record
          render :edit
        end
      }
      format.json {
        if @record.update(permitted_params)
          render json: {message: 'sukses simpan',data: @record}, status: :ok
        else
          render_json_error(@record)
        end
      }
    end

  end

  def new
    add_breadcrumb('', 'Tambah Baru')
    @record = ShipSchedule.new
  end

  def edit
    find_ship_schedule!
    add_breadcrumb(ship_schedule_path(id: @record.id), @record.id)
    add_breadcrumb('', 'Edit')
  end

  ShipSchedule.statuses.each do |key, int_value|
    define_method("set_#{key}") do
      find_ship_schedule!
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

  def get_error_record
    flash[:alert] = @record.errors.full_messages
  end

  def find_ship_schedule!
    @record = ShipSchedule.find(params[:id])
  end

  def root_breadcrumb
    add_breadcrumb(ship_schedules_path, ShipSchedule.model_name.human)
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
