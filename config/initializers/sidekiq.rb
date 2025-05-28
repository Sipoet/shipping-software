redis_host = ENV['REDIS_HOST'] || 'shipping_redis'
redis_port = ENV['REDIS_PORT'] || '6369'
Sidekiq.configure_server do |config|
  config.redis = { url: "redis://#{redis_host}:#{redis_port}/1" }
  config.logger.level = Rails.logger.level
  # config.on(:startup) do
  #   schedule_file = "#{Rails.root}/config/sidekiq_schedule.yml"

  #   if File.exist?(schedule_file)
  #     schedule = YAML.load_file(schedule_file)

  #     Sidekiq::Cron::Job.load_from_hash!(schedule, source: "schedule")
  #   end
  # end
end

Sidekiq.configure_client do |config|
  config.redis = { url: "redis://#{redis_host}:#{redis_port}/1" }
end
