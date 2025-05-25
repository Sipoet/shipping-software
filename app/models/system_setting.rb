class SystemSetting < ApplicationRecord
  validates :keyname, presence: true, uniqueness: true

  belongs_to :user, optional: true
end
