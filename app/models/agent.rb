class Agent < Client

  belongs_to :default_port, class_name: 'Port', optional: true
end
