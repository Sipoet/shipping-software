class ProductsController < ApplicationController
  before_action :authenticate_user!

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
    add_breadcrumb('', @product.name)
  end

  def create
    permitted_params = params.required(:product)
                             .permit(:name, :product_type,:dimension_p,:dimension_l,:dimension_t,:weight)
    @product = Product.new(permitted_params)
    if @product.save
      redirect_to product_path(id: @product.id)
    else
      add_breadcrumb('', 'Tambah Baru')
      flash[:alert] = @product.errors.full_messages
      render :new
    end
  end

  def update
    find_product!
    permitted_params = params.required(:product)
                             .permit(:name, :product_type,:dimension_p,:dimension_l,:dimension_t,:weight)
    if @product.update(permitted_params)
      redirect_to product_path(id: @product.id)
    else
      add_breadcrumb(product_path(id: @product.id), @product.name)
      add_breadcrumb('', 'Edit')
      flash[:alert] = @product.errors.full_messages
      render :edit
    end
  end

  def new
    add_breadcrumb('', 'Tambah Baru')
    @product = Product.new
  end

  def edit
    find_product!
    add_breadcrumb(product_path(id: @product.id), @product.name)
    add_breadcrumb('', 'Edit')
  end

  private

  def find_product!
    @product = Product.find(params[:id])
  end

  def root_breadcrumb
    add_breadcrumb(products_path, Product.model_name.human)
  end

  def search_json
    result = extract_search_query(params, Product)
    @products = Product.all
                       .order(result.order)
    if result.filter.present?
      @products = @products.where(result.filter)
    end
    if result.search_text.present?
      columns = ['name', 'default_ports.name', 'address']
      query = columns.map{|column|"#{column} ilike ?"}.join(' OR ')
      @products = @products.where(query,*Array.new(columns.length){"%#{result.search_text}%"})
    end
    @products = @products.page(result.page)
                           .per(result.limit)
  end
end
