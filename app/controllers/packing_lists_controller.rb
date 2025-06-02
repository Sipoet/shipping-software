class PackingListsController < ApplicationController
  before_action :authorize_user_based_action!
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
    @record = PackingList.new(permitted_params)
    if @record.save
      render json: {message: 'sukses simpan',data: decorate_record(@record)}, status: :created
    else
      render_json_error(@record)
    end
  end

  def update
    find_record!
    permitted_params = permit_params
    if @record.update(permitted_params)
      render json: {message: 'sukses simpan',data: decorate_record(@record)}, status: :ok
    else
      render_json_error(@record)
    end
  end

  def destroy
    find_record!
    if @record.destroy
      render json: {message: 'sukses hapus'}, status: :ok
    else
      render_json_error(@record)
    end
  end

  private

  def permit_params
    params
      .required(:packing_list)
      .permit(:container_id, :sender_id, :receiver_id, :code,
              :transaction_date, :tax_amount,:description,
              packing_details_attributes:[
                :packing_list_id,
                :id,
                :product_id,
                :quantity,
                :total_weight,
                :weight_uom,
                :total_volume,
                :volume_uom,
                :send_cost,
                :description,
                :_destroy,
                :total_dimension_p,
                :total_dimension_l,
                :total_dimension_t
              ])
  end

  def decorate_record(record)
    attributes = record.attributes
    attributes[:packing_details_attributes] = record.packing_details
    attributes
  end

  def find_record!
    @record = PackingList.find(params[:id])
  end

  def search_json
    result = extract_search_query(params, PackingList)
    @records = PackingList
      .all
      .includes(:container,:sender,:receiver)
      .order(result.order)
    result.filter.each do|query_filter|
      @records = @records.where(query_filter)
    end
    if result.search_text.present?
      columns = ['products.name', 'containers.container_number', 'suppliers.name','customers.name']
      query = columns.map{|column|"#{column} ilike ?"}.join(' OR ')
      @records = @records.where(query,*Array.new(columns.length){"%#{result.search_text}%"})
    end
    @records_filtered = @records.count
    @records = @records.page(result.page)
                       .per(result.limit)
    @records
  end
end
