class AgentsController < ApplicationController
  before_action :root_breadcrumb
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
    find_customer!
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
    @record = Agent.new(permitted_params)
    respond_to do |format|
      format.html {
        if @record.save
          redirect_to customer_path(id: @record.id)
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
    find_customer!
    permitted_params = permit_params
    respond_to do |format|
      format.html {
        if @record.update(permitted_params)
          redirect_to customer_path(id: @record.id)
        else
          add_breadcrumb(customer_path(id: @record.id), @record.name)
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
    @record = Agent.new
  end

  def edit
    find_customer!
    add_breadcrumb(customer_path(id: @record.id), @record.name)
    add_breadcrumb('', 'Edit')
  end

  private

  def permit_params
    params
      .required(:agent)
      .permit(:name, :default_port_id, :address, :bank, :bank_account, :bank_register_name, :contact_number, :tax_account)
  end

  def find_customer!
    @record = Agent.find(params[:id])
  end

  def root_breadcrumb
    add_breadcrumb(agents_path, Agent.model_name.human)
  end

  def search_json
    result = extract_search_query(params, Agent)
    @records = Agent.all
                    .left_outer_joins(:default_port)
                    .includes(:default_port)
                    .order(result.order)
    result.filter.each do|query_filter|
      @records = @records.where(query_filter)
    end
    if result.search_text.present?
      columns = ['clients.name', 'ports.name', 'address','contact_number']
      query = columns.map{|column|"#{column} ilike ?"}.join(' OR ')
      @records = @records.where(query,*Array.new(columns.length){"%#{result.search_text}%"})
    end

    @records = @records.page(result.page)
                           .per(result.limit)
  end
end
