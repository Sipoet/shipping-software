module ApplicationHelper

  def current_page_group(controller_name, if_true)
    controller.controller_name == controller_name  ? if_true : ''
  end

  def datetime_format(datetime)
    return '' if datetime.nil?
    datetime.strftime("%d/%m/%y %H:%M")
  end

  def show_alert_if_exists
    return '' if flash[:alert].blank?
    list_message = flash[:alert]
    if flash[:alert].is_a?(Array)
      list_message = flash[:alert].map{|message| "<li>#{message}</li>"}.join
    end
    "<div class=\"alert alert-danger\" role=\"alert\"><ol>#{list_message}</ol></div>"

  end
end
