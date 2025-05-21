module TableSearchParamsExtractor

  def extract_search_query(params, klass)
    if params[:params].present?
      params = JSON.parse(params[:params], symbolize_names: true)
    end
    result = Result.new
    result.limit = extract_search_limit(params, klass)
    result.page = extract_search_page(params)
    result.filter = extract_search_filter(params)
    result.order = extract_search_sort(params, klass)
    Rails.logger.debug "==order: #{result.order}"
    result.search_text = extract_search_text(params)
    result
  end

  class Result
    attr_accessor :offset, :limit, :page,
                  :filter, :order, :search_text
  end

  private

  def extract_search_filter(params)
    query_filter = []
    return query_filter if params[:filter].blank?
    params[:filter].each do |filter|
      value = filter[:value]
      next if value.blank?
      if filter[:type] == 'like'
        query_filter << ApplicationRecord.sanitize_sql_array(["#{filter[:field]} ilike ?","%#{value.strip}%"])
      elsif filter[:type] == 'eq'
        query_filter << {filter[:field] => value}
      elsif filter[:type] == 'gt'
        query_filter << ApplicationRecord.sanitize_sql_array(["#{filter[:field]} > ?",value.strip])
      elsif filter[:type] == 'gte'
        query_filter << {filter[:field] => value..}
      elsif filter[:type] == 'lt'
        query_filter << {filter[:field] => ..value}
      elsif filter[:type] == 'lte'
        query_filter << {filter[:field] => ...value}
      elsif filter[:type] == 'btw'
        query_filter << {filter[:field] => value[0]..(value[1])}
      end
    end
    Rails.logger.debug "=====#{query_filter}"
    query_filter
  end

  def extract_search_page(params)
    (params[:page] || 1).to_i
  end

  def extract_search_limit(params, klass)
    (params[:length] || params[:limit] || klass.default_per_page).to_i
  end

  def extract_search_text(params)
    ApplicationRecord.sanitize_sql(params[:term].try(:strip))
  end

  def extract_search_sort(params, klass)
    order_params = params[:sort]
    order = {}
    return order if order_params.blank?
    order_params.each do|sort|
      field_name = sort[:field]
      next if field_name.nil?
      order[field_name] = sort[:dir].try(:downcase) == 'asc' ? :asc : :desc
    end
    order
  end
end
