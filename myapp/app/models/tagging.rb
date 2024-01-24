class Tagging < ApplicationRecord
    belongs_to :discussion_thread
    belongs_to :tag
end
  