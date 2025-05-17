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
    values = []
    return nil if params[:filter].blank?
    params[:filter].each do |filter|
      next if filter[:value].blank?
      if filter[:type] == 'like'
        query_filter << "#{filter[:field]} ilike ?"
        values << "%#{filter[:value].strip}%"
      elsif filter[:value].is_a?(Array)
        query_filter << "#{filter[:field]} IN (?)"
        values << filter[:value]
      else
        query_filter << "#{filter[:field]} = ?"
        values << filter[:value].strip
      end
    end
    return [] if values.blank?
    query_filter = query_filter.join(' AND ')
    Rails.logger.debug "=====#{query_filter}"
    values.unshift query_filter
    ApplicationRecord.sanitize_sql_array(values)
  end

  def extract_search_page(params)
    params[:page] || 1
  end

  def extract_search_limit(params, klass)
    params[:length] || klass.default_per_page
  end

  def extract_search_text(params)
    params[:term].try(:strip)
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
