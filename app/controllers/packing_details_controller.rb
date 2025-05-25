class PackingDetailsController < ApplicationController

  def index
    search_json
  end

  def show
    find_record!
    @record
  end

  def create
    permitted_params = permit_params
    @record = PackingDetail.new(permitted_params)
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
      render json: {message: 'sukses simpan',data: @record}, status: :ok
    else
      render_json_error(@record)
    end
  end

  private

  def permit_params
    params
      .required(:customer)
      .permit(:packing_list_id,
              :product_id,
              :quantity,
              :total_weight,
              :weight_uom,
              :total_volume,
              :volume_uom,
              :send_cost,
              :description,
              :total_dimension_p,
              :total_dimension_l,
              :total_dimension_t)
  end

  def find_record!
    @record = PackingDetail.find(params[:id])
  end

  def search_json
    result = extract_search_query(params, PackingDetail)
    @records = PackingDetail.all
                         .includes(:product,:packing_list)
                         .order(result.order)
    if result.filter.present?
      @records = @records.where(result.filter)
    end
    if result.search_text.present?
      columns = ['products.name', 'packing_lists.description', 'description']
      query = columns.map{|column|"#{column} ilike ?"}.join(' OR ')
      @records = @records.where(query,*Array.new(columns.length){"%#{result.search_text}%"})
    end
    @records = @records.page(result.page)
                           .per(result.limit)
  end
end
