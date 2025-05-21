module ResponseJsonHelper
  def render_json_error(record)
    error_full_messages = record.errors.full_messages.join(', ')
    render json: {message: "gagal simpan: #{error_full_messages}",error: transform_error(record.errors)}, status: :unprocessable_entity
  end

  private
  def transform_error(error)
    error.as_json.transform_values!{|value|value.join(', ')}
  end
end
