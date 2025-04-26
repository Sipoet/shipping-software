class CustomersController < ApplicationController
  before_action :authenticate_user!,:root_breadcrumb
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
    find_customer!
    add_breadcrumb('', @customer.name)
  end

  def create
    permitted_params = params.required(:customer)
                             .permit(:name, :default_port_id, :address, :bank, :bank_account, :bank_register_name, :contact_number, :tax_account)
    @customer = Customer.new(permitted_params)
    if @customer.save
      redirect_to customer_path(id: @customer.id)
    else
      add_breadcrumb('', 'Tambah Baru')
      flash[:alert] = @customer.errors.full_messages
      render :new
    end
  end

  def update
    find_customer!
    permitted_params = params.required(:customer)
                             .permit(:name, :default_port_id, :address, :bank, :bank_account, :bank_register_name, :contact_number, :tax_account)
    if @customer.update(permitted_params)
      redirect_to customer_path(id: @customer.id)
    else
      add_breadcrumb(customer_path(id: @customer.id), @customer.name)
      add_breadcrumb('', 'Edit')
      flash[:alert] = @customer.errors.full_messages
      render :edit
    end
  end

  def new
    add_breadcrumb('', 'Tambah Baru')
    @customer = Customer.new
  end

  def edit
    find_customer!
    add_breadcrumb(customer_path(id: @customer.id), @customer.name)
    add_breadcrumb('', 'Edit')
  end

  private

  def find_customer!
    @customer = Customer.find(params[:id])
  end

  def root_breadcrumb
    add_breadcrumb(customers_path, Customer.model_name.human)
  end

  def search_json
    result = extract_search_query(params, Customer)
    @customers = Customer.all
                         .includes(:default_port)
                         .order(result.order)
    if result.filter.present?
      @customers = @customers.where(result.filter)
    end
    if result.search_text.present?
      columns = ['name', 'default_ports.name', 'address']
      query = columns.map{|column|"#{column} ilike ?"}.join(' OR ')
      @customers = @customers.where(query,*Array.new(columns.length){"%#{result.search_text}%"})
    end
    @customers = @customers.page(result.page)
                           .per(result.limit)
  end
end
