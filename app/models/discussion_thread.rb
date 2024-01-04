class DiscussionThread < ApplicationRecord
  # self.table_name = "threads"
  has_many :comments, dependent: :destroy
  has_many :taggings, dependent: :destroy
  has_many :tags, through: :taggings

  validates :title, presence: true
  validates :content, presence: true
end