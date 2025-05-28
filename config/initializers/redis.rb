redis_host = ENV['REDIS_HOST'] || 'shipping_redis'
redis_port = ENV['REDIS_PORT'] || '6369'
$redis = Redis.new(host: redis_host, port: redis_port, db: 2)
