class SuppliersController < ApplicationController
  before_action :root_breadcrumb, :authenticate_user!
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
    find_supplier!
    add_breadcrumb('', @supplier.name)
  end

  def create
    permitted_params = params.required(:supplier)
                             .permit(:name, :default_port_id, :address, :bank, :bank_account, :bank_register_name, :contact_number, :tax_account)
    @supplier = Supplier.new(permitted_params)
    if @supplier.save
      redirect_to supplier_path(id: @supplier.id)
    else
      add_breadcrumb('', 'Tambah Baru')
      flash[:alert] = @supplier.errors.full_messages
      render :new
    end
  end

  def update
    find_supplier!
    permitted_params = params.required(:supplier)
                             .permit(:name, :default_port_id, :address, :bank, :bank_account, :bank_register_name, :contact_number, :tax_account)
    if @supplier.update(permitted_params)
      redirect_to supplier_path(id: @supplier.id)
    else
      add_breadcrumb(supplier_path(id: @supplier.id), @supplier.name)
      add_breadcrumb('', 'Edit')
      flash[:alert] = @supplier.errors.full_messages
      render :edit
    end
  end

  def new
    add_breadcrumb('', 'Tambah Baru')
    @supplier = Supplier.new
  end

  def edit
    find_supplier!
    add_breadcrumb(supplier_path(id: @supplier.id), @supplier.name)
    add_breadcrumb('', 'Edit')
  end

  private

  def find_supplier!
    @supplier = Supplier.find(params[:id])
  end

  def root_breadcrumb
    add_breadcrumb(suppliers_path, Supplier.model_name.human)
  end

  def search_json
    result = extract_search_query(params, Supplier)
    @suppliers = Supplier.all
                         .includes(:default_port)
                         .order(result.order)
    if result.filter.present?
      @suppliers = @suppliers.where(result.filter)
    end
    if result.search_text.present?
      columns = ['name', 'default_ports.name', 'address']
      query = columns.map{|column|"#{column} ilike ?"}.join(' OR ')
      @suppliers = @suppliers.where(query,*Array.new(columns.length){"%#{result.search_text}%"})
    end
    @suppliers = @suppliers.page(result.page)
                           .per(result.limit)
  end
end
