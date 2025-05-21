class ContainersController < ApplicationController
  before_action :authenticate_user!

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
    permitted_params = permit_params
    @record = Container.new(permitted_params)
    respond_to do |format|
      format.html {
        if @record.save
          redirect_to container_path(id: @record.id)
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
    permitted_params = permit_params
    respond_to do |format|
      format.html {
        if @record.update(permitted_params)
          redirect_to container_path(id: @record.id)
        else
          add_breadcrumb(container_path(id: @record.id), @record.id)
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
    @record = Container.new
  end

  def edit
    find_ship_schedule!
    add_breadcrumb(container_path(id: @record.id), @record.id)
    add_breadcrumb('', 'Edit')
  end

  private

  def permit_params
    params
      .required(:container)
      .permit(:ship_schedule_id,:container_type_id, :container_number,
              :order_type, :seal_number, :agent_id)
  end

  def get_error_record
    flash[:alert] = @record.errors.full_messages
  end

  def find_ship_schedule!
    @record = Container.find(params[:id])
  end

  def root_breadcrumb
    add_breadcrumb(ship_schedules_path, Container.model_name.human)
  end

  def search_json
    result = extract_search_query(params, Container)
    @records = Container
      .all
      .includes(:ship_schedule,:agent)
      .order(result.order)
    result.filter.each do|query_filter|
      @records = @records.where(query_filter)
    end
    if result.search_text.present?
      columns = ['container_number', 'seal_number', 'order_type']
      query = columns.map{|column|"#{column} ilike ?"}.join(' OR ')
      @records = @records.where(query,*Array.new(columns.length){"%#{result.search_text}%"})
    end
    @records_filtered = @records.count
    @records = @records.page(result.page)
                       .per(result.limit)
    @records
  end
end
