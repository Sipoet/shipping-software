def load_dummy
  Dir[File.join(Rails.root, 'db', 'seeds','dummy', '*.rb')].sort.each do |seed|
    load seed
  end
end
puts 'seeds master'
Dir[File.join(Rails.root, 'db', 'seeds','master', '*.rb')].sort.each do |seed|
  load seed
end
include_dummy_seeds = ENV['INCLUDE'].split(',').map(&:strip) rescue []
include_dummy_seeds.each do |key|
  puts "seeds #{key}"
  if key == 'dummy'
    load_dummy
    break
  end
  load Rails.root.join('db', 'seeds','dummy', "#{key}_dummy.rb")
end
