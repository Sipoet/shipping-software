class ProductsController < ApplicationController
  before_action :authenticate_user!
  skip_before_action :verify_authenticity_token, only: [:create,:update,:destroy]
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
    @record = Product.new(permitted_params)
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

  def destroy
    find_record!
    if @record.destroy
      head :no_content
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
    permitted_params = params.required(:product)
                             .permit(:name, :product_type,:dimension_p,:dimension_l,:dimension_t,:weight)
  end

  def find_record!
    @record = Product.find(params[:id])
  end

  def search_json
    result = extract_search_query(params, Product)
    @records = Product.all
                       .order(result.order)
    result.filter.each do|query_filter|
      @records = @records.where(query_filter)
    end
    if result.search_text.present?
      columns = ['name']
      query = columns.map{|column|"#{column} ilike ?"}.join(' OR ')
      @records = @records.where(query,*Array.new(columns.length){"%#{result.search_text}%"})
    end
    @records = @records.page(result.page)
                           .per(result.limit)
  end
end
