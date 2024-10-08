class ShipsController < ApplicationController
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
    find_ship!
    add_breadcrumb('', @ship.name)
  end

  def create
    permitted_params = params.required(:ship).permit(:name)
    @ship = Ship.new(permitted_params)
    if @ship.save
      redirect_to ship_path(id: @ship.id)
    else
      add_breadcrumb('', 'Tambah Baru')
      flash[:alert] = @ship.errors.full_messages
      render :new
    end
  end

  def update
    find_ship!
    permitted_params = params.required(:ship).permit(:name)
    if @ship.update(permitted_params)
      redirect_to ship_path(id: @ship.id)
    else
      add_breadcrumb(ship_path(id: @ship.id), @ship.name)
      add_breadcrumb('', 'Edit')
      flash[:alert] = @ship.errors.full_messages
      render :edit
    end
  end

  def new
    add_breadcrumb('', 'Tambah Baru')
    @ship = Ship.new
  end

  def edit
    find_ship!
    add_breadcrumb(ship_path(id: @ship.id), @ship.name)
    add_breadcrumb('', 'Edit')
  end

  private

  def find_ship!
    @ship = Ship.find(params[:id])
  end

  def root_breadcrumb
    add_breadcrumb(ships_path, Ship.model_name.human)
  end

  def search_json
    result = extract_search_query(params, Ship)
    @ships = Ship.all.order(result.order)
    if result.filter.present?
      @ships = @ships.where(result.filter)
    end
    if result.search_text.present?
      @ships = @ships.where('name ilike ?',"%#{result.search_text}%")
    end
    @records_filtered = @ships.count
    @ships = @ships.offset(result.offset)
                   .limit(result.limit)
  end
end
