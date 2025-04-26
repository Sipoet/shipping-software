class Client < ApplicationRecord

  validates :name, presence: true

  belongs_to :default_port, class_name:'Port', optional: true
end
