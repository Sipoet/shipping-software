class Role < ApplicationRecord

  validates :name, presence: true
  has_many :role_auths,inverse_of: :role, dependent: :destroy

  after_save :remove_cache
  after_destroy :remove_cache

  accepts_nested_attributes_for :role_auths, allow_destroy: true

  def remove_cache
    $redis.del("authorizations-#{id}")
  end
end
