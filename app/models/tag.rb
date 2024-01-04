class Tag < ApplicationRecord
    has_many :discussion_threads, through: :taggings
    has_many :taggings, dependent: :destroy

    validates :name, presence: true, uniqueness: true
  end