namespace :db do
    desc 'Migrate passwords from password_digest to encrypted_password'
    task migrate_passwords: :environment do
      User.find_each do |user|
        if user.attribute_names.include?('username') && user.read_attribute(:password_digest).present?
          encrypted_password = Devise::Encryptor.digest(User, user.read_attribute(:password_digest))
          user.update_columns(encrypted_password: encrypted_password)
        end
      end
    end
  end
  
  
  
  
  
  