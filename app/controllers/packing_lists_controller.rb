class PackingListsController < ApplicationController
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
        add_breadcrumb('', @record.id)
      }
      format.json {
        @record
      }
    end

  end

  def create
    permitted_params = params
      .required(:packing_list)
      .permit(:container_id, :customer_schedule_id, :customer_id, :supplier_id, :product_id,
              :price, :unit_of_measurement, :total_dimension)
    @record = PackingList.new(permitted_params)
     respond_to do |format|
      format.html {
        if @record.save
          redirect_to packing_list_path(id: @record.id)
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
    find_record!
    permitted_params = params
      .required(:packing_list)
      .permit(:container_id, :customer_schedule_id, :customer_id, :supplier_id, :product_id,
              :price, :unit_of_measurement, :total_dimension)
    respond_to do |format|
      format.html {
        if @record.update(permitted_params)
          redirect_to packing_list_path(id: @record.id)
        else
          add_breadcrumb(packing_list_path(id: @record.id), @record.id)
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
    @record = PackingList.new
  end

  def edit
    find_record!
    add_breadcrumb(packing_list_path(id: @record.id), @record.id)
    add_breadcrumb('', 'Edit')
  end

  private

  def get_error_record
    flash[:alert] = @record.errors.full_messages
  end

  def find_record!
    @record = PackingList.find(params[:id])
  end

  def root_breadcrumb
    add_breadcrumb(packing_lists_path, PackingList.model_name.human)
  end

  def search_json
    result = extract_search_query(params, PackingList)
    @records = PackingList
      .all
      .includes(:product,:container,:supplier,:customer)
      .order(result.order)
    result.filter.each do|query_filter|
      @records = @records.where(query_filter)
    end
    if result.search_text.present?
      columns = ['products.name', 'containers.container_number', 'suppliers.name','customers.name']
      query = columns.map{|column|"#{column} ilike ?"}.join(' OR ')
      @records = @records.where(query,*Array.new(columns.length){"%#{result.search_text}%"})
    end
    @records_filtered = @records.count
    @records = @records.page(result.page)
                       .per(result.limit)
    @records
  end
end
