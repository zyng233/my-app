class Tag < ApplicationRecord
  has_many :taggings, dependent: :destroy
  has_and_belongs_to_many :discussion_threads, through: :taggings
    
  validates :name, presence: true, uniqueness: true
end