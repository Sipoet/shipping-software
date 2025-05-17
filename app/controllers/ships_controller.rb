class ShipsController < ApplicationController
  before_action :root_breadcrumb, :authenticate_user!
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
    find_ship!
    respond_to do |format|
      format.html {
        add_breadcrumb('', @ship.name)
      }
      format.json {
        render json: @ship
      }
    end
  end

  def create
    permitted_params = params.required(:ship).permit(:name)
    @ship = Ship.new(permitted_params)
    respond_to do |format|
      format.html {
        if @ship.save
          redirect_to ship_path(id: @ship.id)
        else
          add_breadcrumb('', 'Tambah Baru')
          flash[:alert] = @ship.errors.full_messages
          render :new
        end
      }
      format.json {
        if @ship.save
          render json: {message: 'sukses simpan',data: @ship}, status: :created
        else
          render_json_error(@ship)
        end
      }
    end

  end

  def update
    find_ship!
    permitted_params = params.required(:ship).permit(:name)
    respond_to do |format|
      format.html {
        if @ship.update(permitted_params)
          redirect_to ship_path(id: @ship.id)
        else
          add_breadcrumb(ship_path(id: @ship.id), @ship.name)
          add_breadcrumb('', 'Edit')
          flash[:alert] = @ship.errors.full_messages
          render :edit
        end
      }
      format.json {
        if @ship.update(permitted_params)
          render json: {message: 'sukses simpan',data: @ship}, status: :ok
        else
          render_json_error(@ship)
        end
      }
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
    @ships = @ships.page(result.page)
                   .per(result.limit)
  end
end
