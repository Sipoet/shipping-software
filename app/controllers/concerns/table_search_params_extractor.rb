module TableSearchParamsExtractor

  def extract_search_query(params, klass)
    result = Result.new
    result.limit = extract_search_limit(params, klass)
    result.offset = extract_search_offset(params)
    result.filter = extract_search_filter(params)
    result.order = extract_search_order(params, klass)
    result.search_text = extract_search_text(params)
    result
  end

  class Result
    attr_accessor :offset,:limit,:filter,:order, :search_text
  end

  private

  def extract_search_filter(params)
    query_filter = []
    values = []
    columns = params[:columns] || []
    columns.each do |key, value|
      search = value[:search]
      next if search.blank?
      next if search[:value].blank?
      if search[:regex] == 'true'
        query_filter << "#{value[:data]} ilike ?"
        values << "%#{search[:value].strip}%"
      else
        query_filter << "#{value[:data]} = ?"
        values << search[:value].strip
      end
    end
    return [] if values.blank?
    query_filter = query_filter.join(' AND ')
    Rails.logger.debug "=====#{query_filter}"
    values.unshift query_filter
    ApplicationRecord.sanitize_sql_array(values)
  end

  def extract_search_offset(params)
    params[:start] || 0
  end

  def extract_search_limit(params, klass)
    params[:length] || klass.default_per_page
  end

  def extract_search_text(params)
    permitted_params = params.required(:search).permit(:value,:regex)
    permitted_params[:value].try(:strip)
  end

  def extract_search_order(params, klass)
    order_params = params[:order]
    order = {}
    return order if order_params.blank?
    order_params.each do|key,value|
      column_index = value['column']
      column = params[:columns][column_index]
      column_name = column.try(:[],:name).presence || column.try(:[],:data)
      order[column_name] = value['dir'].try(:downcase) == 'asc' ? :asc : :desc
    end
    order
  end
end
