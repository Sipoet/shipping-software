module ShipSchedulesHelper
  include ApplicationHelper

  def multi_datetime_format(dates,options)
    result = []
    dates.each.with_index(1) do |datetime,index|
      next if datetime.nil?
      prefix_key = "date#{index}_prefix".to_sym
      result << "#{options[prefix_key]} #{datetime_format(datetime)}"
    end
    result.join(', ')
  end

  def comparison_datetime(date1, date2)
    multi_datetime_format([date1,date2], date1_prefix: 'Estimasi', date2_prefix: 'Aktual')
  end

  def port_format(port)
    return '' if port.nil?
    "#{port.name} (#{port.city})"
  end

  def status_buttons(ship_schedule)
    buttons = []
    ShipSchedule.statuses.each do |key, value|
      next if ship_schedule.send("#{key}?")
      # && !ship_schedule.send("can_#{key}?")
      path = self.send("set_#{key}_ship_schedule_path",ship_schedule.id)
      title = I18n.t(key,scope: [:activerecord,:attributes,:ship_schedule,:status_enum])
      buttons << "<a href='#{path}' class='btn btn-#{ship_schedule_status_css(ship_schedule)}' data-turbo-method='post'>#{title}</a>"
    end
    buttons.join.html_safe
  end

  def ship_schedule_status_css(ship_schedule)
    if ship_schedule.draft?
      'light'
    elsif ship_schedule.cancelled?
      'danger'
    elsif ship_schedule.completed?
      'success'
    else
      'info'
    end
  end
end
