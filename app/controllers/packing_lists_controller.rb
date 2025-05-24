class PackingListsController < ApplicationController
  before_action :authenticate_user!
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
      format.html {
        render_home
      }
      format.json {
        find_record!
        @record
      }
    end

  end

  def create
    permitted_params = permit_params
    @record = PackingList.new(permitted_params)
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

  def new
    render_home
  end

  def edit
    render_home
  end

  private

  def permit_params
    params
      .required(:packing_list)
      .permit(:container_id, :customer_schedule_id, :customer_id, :supplier_id, :product_id,
              :price, :unit_of_measurement, :quantity, :total_weight, :total_dimension_p,
              :total_dimension_l,:total_dimension_t)
  end

  def find_record!
    @record = PackingList.find(params[:id])
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
