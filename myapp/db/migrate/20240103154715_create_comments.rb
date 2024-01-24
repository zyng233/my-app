class CreateComments < ActiveRecord::Migration[7.1]
  def change
    create_table :comments do |t|
      t.text :content
      t.references :discussion_thread, null: false, foreign_key: true
      t.references :user, foreign_key: { column: :username, primary_key: :username }
      
      t.timestamps
    end
  end
end
