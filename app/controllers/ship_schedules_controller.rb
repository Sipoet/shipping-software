class ShipSchedulesController < ApplicationController
  before_action :root_breadcrumb, :authenticate_user!

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
    add_breadcrumb('', @ship_schedule.id)
  end

  def create
    permitted_params = params
      .required(:ship_schedule)
      .permit(:ship_id, :loading_port_id, :destination_port_id, :voyage, :booking_code,
              :estimated_arrived_dest_at, :estimated_arrived_sour_at, :estimated_departure_sour_at)
    @ship_schedule = ShipSchedule.new(permitted_params)
    if @ship_schedule.save
      redirect_to ship_schedule_path(id: @ship_schedule.id)
    else
      add_breadcrumb('', 'Tambah Baru')
      get_error_record
      render :new
    end
  end

  def update
    find_ship_schedule!
    permitted_params = params
      .required(:ship_schedule)
      .permit(:ship_id, :loading_port_id, :destination_port_id, :voyage, :booking_code,
              :estimated_arrived_dest_at, :estimated_arrived_sour_at, :estimated_departure_sour_at)
    if @ship_schedule.update(permitted_params)
      redirect_to ship_schedule_path(id: @ship_schedule.id)
    else
      add_breadcrumb(ship_schedule_path(id: @ship_schedule.id), @ship_schedule.id)
      add_breadcrumb('', 'Edit')
      get_error_record
      render :edit
    end
  end

  def new
    add_breadcrumb('', 'Tambah Baru')
    @ship_schedule = ShipSchedule.new
  end

  def edit
    find_ship_schedule!
    add_breadcrumb(ship_schedule_path(id: @ship_schedule.id), @ship_schedule.id)
    add_breadcrumb('', 'Edit')
  end

  ShipSchedule.statuses.each do |key, int_value|
    define_method("set_#{key}") do
      find_ship_schedule!
      result = @ship_schedule.send("#{key}!") rescue false
      if result == false
        get_error_record
        render :show
      else
        redirect_to ship_schedule_path(id: @ship_schedule.id)
      end
    end
  end

  private

  def get_error_record
    flash[:alert] = @ship_schedule.errors.full_messages
  end

  def find_ship_schedule!
    @ship_schedule = ShipSchedule.find(params[:id])
  end

  def root_breadcrumb
    add_breadcrumb(ship_schedules_path, ShipSchedule.model_name.human)
  end

  def search_json
    result = extract_search_query(params, ShipSchedule)
    @ship_schedules = ShipSchedule
      .all
      .includes(:ship,:loading_port,:destination_port)
      .order(result.order)
    if result.filter.present?
      @ship_schedules = @ship_schedules.where(result.filter)
    end
    if result.search_text.present?
      @ship_schedules = @ship_schedules.where('ships.name ilike ? OR voyage ilike ? OR booking_code ilike ?',*Array.new(3){"%#{result.search_text}%"})
    end
    @records_filtered = @ship_schedules.count
    @ship_schedules = @ship_schedules.page(result.page)
                                     .per(result.limit)
  end
end
