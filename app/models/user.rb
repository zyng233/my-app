class User < ApplicationRecord
    devise :database_authenticatable, :recoverable, 
            :rememberable, :validatable

    self.primary_key = 'username'
    validates :username, :matric_no, presence: true, uniqueness: true
    has_many :discussion_threads, foreign_key: 'username', dependent: :destroy
    has_many :comments, foreign_key: 'username', dependent: :destroy

    # decoding token
    def self.from_token_payload(payload)
        find(payload['username']) if payload['username'].present?
    end

    def inspect
      attributes_as_hash = attributes.transform_values do |value|
        value.is_a?(ActiveRecord::Base) ? value.attributes : value
      end
  
      "#<#{self.class} #{attributes_as_hash}>"
    end
    
    private

    def ensure_authentication_token
      self.authentication_token ||= generate_authentication_token
    end
  
    def generate_authentication_token
      loop do
        token = Devise.friendly_token
        break token unless User.exists?(authentication_token: token)
      end
    end
end
  