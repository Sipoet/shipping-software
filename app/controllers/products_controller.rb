class ProductsController < ApplicationController
  before_action :authenticate_user!
  skip_before_action :verify_authenticity_token, only: [:create,:update,:destroy]
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
    find_product!
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
    @record = Product.new(permitted_params)
    respond_to do |format|
      format.html {
        if @record.save
          redirect_to product_path(id: @record.id)
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
    find_product!
    permitted_params = permit_params
    respond_to do |format|
      format.html {
        if @record.update(permitted_params)
          redirect_to product_path(id: @record.id)
        else
          add_breadcrumb(product_path(id: @record.id), @record.name)
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

  def destroy
    find_product!
    if @record.destroy
      head :no_content
    else
      render_json_error(@record)
    end
  end

  def new
    add_breadcrumb('', 'Tambah Baru')
    @record = Product.new
  end

  def edit
    find_product!
    add_breadcrumb(product_path(id: @record.id), @record.name)
    add_breadcrumb('', 'Edit')
  end

  private

  def permit_params
    permitted_params = params.required(:product)
                             .permit(:name, :product_type,:dimension_p,:dimension_l,:dimension_t,:weight)
  end

  def find_product!
    @record = Product.find(params[:id])
  end

  def root_breadcrumb
    add_breadcrumb(products_path, Product.model_name.human)
  end

  def search_json
    result = extract_search_query(params, Product)
    @records = Product.all
                       .order(result.order)
    result.filter.each do|query_filter|
      @records = @records.where(query_filter)
    end
    if result.search_text.present?
      columns = ['name', 'product_tpe']
      query = columns.map{|column|"#{column} ilike ?"}.join(' OR ')
      @records = @records.where(query,*Array.new(columns.length){"%#{result.search_text}%"})
    end
    @records = @records.page(result.page)
                           .per(result.limit)
  end
end
