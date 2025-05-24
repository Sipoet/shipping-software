class PortsController < ApplicationController
  before_action :root_breadcrumb, :authenticate_user!
  skip_before_action :verify_authenticity_token, only: [:create,:update]
  def index
    respond_to do |format|
      format.html {
        render_home
      }
      format.json {
        search_json
      }
    end
  end

  def show
    respond_to do |format|
      format.html do
        render_home
      end
      format.json do
        find_record!
        @record
      end
    end
  end

  def create
    permitted_params = params.required(:port)
                             .permit(:name, :city, :country)
    @record = Port.new(permitted_params)
    if @record.save
      render json: {message: 'sukses simpan',data: @record}, status: :created
    else
      render_json_error(@record)
    end
  end

  def update
    find_record!
    permitted_params = params.required(:port)
                             .permit(:name, :city, :country)
    if @record.update(permitted_params)
      render json: {message: 'sukses simpan',data: @record}, status: :ok
    else
      render_json_error(@record)
    end
  end

  def new
    render_home
  end

  def edit
    render_home
  end

  private

  def find_record!
    @record = Port.find(params[:id])
  end

  def search_json
    result = extract_search_query(params, Port)
    @records = Port.all.order(result.order)
    if result.filter.present?
      @records = @records.where(result.filter)
    end
    if result.search_text.present?
      columns = ['name', 'city']
      query = columns.map{|column|"#{column} ilike ?"}.join(' OR ')
      @records = @records.where(query,*Array.new(columns.length){"%#{result.search_text}%"})
    end
    @records = @records.page(result.page)
                   .per(result.limit)
  end
end
