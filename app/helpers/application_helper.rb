module ApplicationHelper

  def current_page_group(controller_name, if_true)
    controller.controller_name == controller_name  ? if_true : ''
  end

  def datetime_format(datetime)
    return '' if datetime.nil?
    datetime.strftime("%d/%m/%y %H:%M")
  end

  def phone_format(phone)
    phone.scan(/.{1,4}/).join('-')
  end

  def show_alert_if_exists
    return '' if flash[:alert].blank?
    list_message = flash[:alert]
    if flash[:alert].is_a?(Array)
      list_message = flash[:alert].map{|message| "<li>#{message}</li>"}.join
    end
    "<div class=\"alert alert-danger\" role=\"alert\"><ol>#{list_message}</ol></div>".html_safe
  end

  def enum_list(klass, enum_key)
    values = klass.send(enum_key.to_s.pluralize)
    values.each_with_object({}) do |(value, key), obj|
      obj[key] = I18n.t(value, scope:['activerecord','attributes',klass.name.underscore,"#{enum_key}_enum"])
    end
  end
end
