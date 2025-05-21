class ContainerTypesController < ApplicationController
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
    find_record!
    respond_to do |format|
      format.html {
        add_breadcrumb('', @record.name)
      }
      format.json {
        @record
      }
    end
  end

  def create
    permitted_params = permit_params
    @record = ContainerType.new(permitted_params)
    respond_to do |format|
      format.html {
        if @record.save
          redirect_to ship_path(id: @record.id)
        else
          add_breadcrumb('', 'Tambah Baru')
          flash[:alert] = @record.errors.full_messages
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
    find_record!
    permitted_params = permit_params
    respond_to do |format|
      format.html {
        if @record.update(permitted_params)
          redirect_to ship_path(id: @record.id)
        else
          add_breadcrumb(ship_path(id: @record.id), @record.name)
          add_breadcrumb('', 'Edit')
          flash[:alert] = @record.errors.full_messages
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
    @record = ContainerType.new
  end

  def edit
    find_record!
    add_breadcrumb(ship_path(id: @record.id), @record.name)
    add_breadcrumb('', 'Edit')
  end

  private

  def permit_params
    params.required(:container_type)
          .permit(:name,:weight,:dimension_p,:dimension_l,:dimension_t)
  end

  def find_record!
    @record = ContainerType.find(params[:id])
  end

  def root_breadcrumb
    add_breadcrumb(ships_path, ContainerType.model_name.human)
  end

  def search_json
    result = extract_search_query(params, ContainerType)
    @records = ContainerType.all.order(result.order)
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
