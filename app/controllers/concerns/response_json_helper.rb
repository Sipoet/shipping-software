module ResponseJsonHelper
  def render_json_error(record)
    error_full_messages = record.errors.full_messages.join(', ')
    render json: {message: "gagal simpan: #{error_full_messages}",error: record.errors}, status: :unprocessable_entity
  end
end
