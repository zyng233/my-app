class Comment < ApplicationRecord
    belongs_to :discusssion_thread
    belongs_to :user, foreign_key: 'username'

    validates :content, presence: true
  end