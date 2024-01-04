class Comment < ApplicationRecord
    belongs_to :discusssion_thread

    validates :content, presence: true
  end