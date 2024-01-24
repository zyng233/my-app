class DiscussionThread < ApplicationRecord
  has_many :comments, dependent: :destroy
  has_many :taggings, dependent: :destroy
  has_many :tags, through: :taggings
  belongs_to :user, foreign_key: 'username'

  validates :title, presence: true
  validates :content, presence: true

  attr_accessor :tag_names
end