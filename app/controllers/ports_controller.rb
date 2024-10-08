class PortsController < ApplicationController
  before_action :root_breadcrumb
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
    add_breadcrumb('', @port.name)
  end

  def create
    permitted_params = params.required(:port)
                             .permit(:name, :city, :country)
    @port = Port.new(permitted_params)
    if @port.save
      redirect_to port_path(id: @port.id)
    else
      add_breadcrumb('', 'Tambah Baru')
      flash[:alert] = @port.errors.full_messages
      render :new
    end
  end

  def update
    find_port!
    permitted_params = params.required(:port)
                             .permit(:name, :city, :country)
    if @port.update(permitted_params)
      redirect_to port_path(id: @port.id)
    else
      add_breadcrumb(port_path(id: @port.id), @port.name)
      add_breadcrumb('', 'Edit')
      flash[:alert] = @port.errors.full_messages
      render :edit
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
      @ports = @ports.where('name ilike ? OR city ilike ?',*Array.new(2){"%#{result.search_text}%"})
    end
    @records_filtered = @ports.count
    @ports = @ports.offset(result.offset)
                   .limit(result.limit)
  end
end
