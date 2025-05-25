class SystemSetting < ApplicationRecord
  validates :keyname, presence: true, unique: true

  belongs_to :user, optional: true
end
