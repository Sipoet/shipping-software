class PortsController < ApplicationController
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
    find_port!
    respond_to do |format|
      format.html do
        add_breadcrumb('', @port.name)
      end
      format.json do
        render json: @port
      end
    end
  end

  def create
    permitted_params = params.required(:port)
                             .permit(:name, :city, :country)
    @port = Port.new(permitted_params)
    respond_to do |format|
      format.html do
        if @port.save
          redirect_to port_path(id: @port.id)
        else
          add_breadcrumb('', 'Tambah Baru')
          flash[:alert] = @port.errors.full_messages
          render :new
        end
      end
      format.json  do
        if @port.save
          render json: {message: 'sukses simpan',data: @port}, status: :created
        else
          render_json_error(@port)
        end
      end
    end
  end

  def update
    find_port!
    permitted_params = params.required(:port)
                             .permit(:name, :city, :country)
    respond_to do |format|
      format.html {
        if @port.update(permitted_params)
          redirect_to port_path(id: @port.id)
        else
          add_breadcrumb(port_path(id: @port.id), @port.name)
          add_breadcrumb('', 'Edit')
          flash[:alert] = @port.errors.full_messages
          render :edit
        end
      }
      format.json {
        if @port.update(permitted_params)
          render json: {message: 'sukses simpan',data: @port}, status: :ok
        else
          render_json_error(@port)
        end
      }
    end
  end

  def new
    add_breadcrumb('', 'Tambah Baru')
    @port = Port.new
  end

  def edit
    find_port!
    add_breadcrumb(port_path(id: @port.id), @port.name)
    add_breadcrumb('', 'Edit')
  end

  private

  def find_port!
    @port = Port.find(params[:id])
  end

  def root_breadcrumb
    add_breadcrumb(ports_path, Port.model_name.human)
  end

  def search_json
    result = extract_search_query(params, Port)
    @ports = Port.all.order(result.order)
    if result.filter.present?
      @ports = @ports.where(result.filter)
    end
    if result.search_text.present?
      columns = ['name', 'city']
      query = columns.map{|column|"#{column} ilike ?"}.join(' OR ')
      @ports = @ports.where(query,*Array.new(columns.length){"%#{result.search_text}%"})
    end
    @ports = @ports.page(result.page)
                   .per(result.limit)
  end
end
