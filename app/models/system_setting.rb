class SystemSetting < ApplicationRecord

  attr_readonly :keyname, :user_id
  validates :keyname, presence: true, uniqueness: true

  belongs_to :user, optional: true

  before_save :remove_cache
  before_destroy :remove_cache

  def self.get(keyname,user_id: nil)
    cache = $redis.get(generate_cache_name(keyname, user_id: user_id))
    return JSON.parse(cache) if cache.present?
    record = self.find_by(keyname: keyname, user_id: user_id)
    return nil if record.nil?
    record.set_cache
    record.value
  end

  def self.set!(keyname,value,user_id: nil)
    record = self.find_or_initialize_by(keyname:keyname,user_id: user_id)
    record.value = value
    record.save!
  end

  def self.delete(keyname,user_id: nil)
    record = self.find_by(keyname: keyname, user_id: user_id)
    return nil if record.nil?
    record.destroy
  end

  def set_cache
    $redis.set(cache_name, value.to_json)
  end

  def remove_cache
    $redis.del(cache_name)
  end

  def self.generate_cache_name(keyname,user_id: nil)
    "setting-#{keyname}-#{user_id}"
  end

  private

  def cache_name
    @cache_name ||= self.class.generate_cache_name(keyname,user_id: user_id)
  end
end
