class CreateDiscussionThreads < ActiveRecord::Migration[7.1]
  def change
    create_table :discussion_threads do |t|
      t.string :title
      t.text :content
      t.references :user, foreign_key: { column: :username, primary_key: :username }

      t.timestamps
    end
  end
end
