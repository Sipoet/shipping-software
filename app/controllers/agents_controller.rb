class AgentsController < ApplicationController
  before_action :root_breadcrumb
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
    find_agent!
    add_breadcrumb('', @agent.name)
  end

  def create
    permitted_params = params.required(:agent)
                             .permit(:name, :default_port_id, :address, :bank, :bank_account, :bank_register_name, :contact_number, :tax_account)
    @agent = Agent.new(permitted_params)
    if @agent.save
      redirect_to agent_path(id: @agent.id)
    else
      add_breadcrumb('', 'Tambah Baru')
      flash[:alert] = @agent.errors.full_messages
      render :new
    end
  end

  def update
    find_agent!
    permitted_params = params.required(:agent)
                             .permit(:name, :default_port_id, :address, :bank, :bank_account, :bank_register_name, :contact_number, :tax_account)
    if @agent.update(permitted_params)
      redirect_to agent_path(id: @agent.id)
    else
      add_breadcrumb(agent_path(id: @agent.id), @agent.name)
      add_breadcrumb('', 'Edit')
      flash[:alert] = @agent.errors.full_messages
      render :edit
    end
  end

  def new
    add_breadcrumb('', 'Tambah Baru')
    @agent = Agent.new
  end

  def edit
    find_agent!
    add_breadcrumb(agent_path(id: @agent.id), @agent.name)
    add_breadcrumb('', 'Edit')
  end

  private

  def find_agent!
    @agent = Agent.find(params[:id])
  end

  def root_breadcrumb
    add_breadcrumb(agents_path, Agent.model_name.human)
  end

  def search_json
    result = extract_search_query(params, Agent)
    @agents = Agent.all
                         .includes(:default_port)
                         .order(result.order)
    if result.filter.present?
      @agents = @agents.where(result.filter)
    end
    if result.search_text.present?
      columns = ['name', 'default_ports.name', 'address']
      query = columns.map{|column|"#{column} ilike ?"}.join(' OR ')
      @agents = @agents.where(query,*Array.new(columns.length){"%#{result.search_text}%"})
    end
    @agents = @agents.page(result.page)
                     .per(result.limit)
  end
end
