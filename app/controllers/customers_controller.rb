class CustomersController < ApplicationController
  before_action :authenticate_user!
  skip_before_action :verify_authenticity_token

  def index
    search_json
  end

  def show
    find_record!
    @record
  end

  def create
    permitted_params = permit_params
    @record = Customer.new(permitted_params)
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

  private

  def permit_params
    params
      .required(:customer)
      .permit(:name, :default_port_id, :address, :bank, :bank_account,
              :bank_register_name, :contact_number, :tax_account)
  end

  def find_record!
    @record = Customer.find(params[:id])
  end

  def search_json
    result = extract_search_query(params, Customer)
    @records = Customer.all
                         .includes(:default_port)
                         .order(result.order)
    if result.filter.present?
      @records = @records.where(result.filter)
    end
    if result.search_text.present?
      columns = ['name', 'default_ports.name', 'address','contact_number']
      query = columns.map{|column|"#{column} ilike ?"}.join(' OR ')
      @records = @records.where(query,*Array.new(columns.length){"%#{result.search_text}%"})
    end
    @records = @records.page(result.page)
                           .per(result.limit)
  end
end
