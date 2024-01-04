class User < ApplicationRecord
    validates :username, :matric_no, presence: true, uniqueness: true
    validates :password, presence: true
    
    has_secure_password 
    self.primary_key = 'matric_no'

    # decoding token
    def self.from_token_payload(payload)
        find(payload['user_id'])
    end

    def authenticate(entered_password)
        BCrypt::Password.new(password_digest).is_password?(entered_password)
    end

    def password=(new_password)
        super
      end

end
  