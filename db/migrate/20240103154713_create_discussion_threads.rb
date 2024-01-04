class CreateDiscussionThreads < ActiveRecord::Migration[7.1]
  def change
    create_table :discussion_threads do |t|
      t.string :title
      t.text :content

      t.timestamps
    end
  end
end
