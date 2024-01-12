class Comment < ApplicationRecord
    belongs_to :discussion_thread
    belongs_to :user, foreign_key: 'username'

    validates :content, presence: true
  end