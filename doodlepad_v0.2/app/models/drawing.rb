class Drawing < ActiveRecord::Base
    has_one :user
    belongs_to :drawingpad
    has_many :stroke
end
