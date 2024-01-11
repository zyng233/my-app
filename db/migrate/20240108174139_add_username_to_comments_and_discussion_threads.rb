class AddUsernameToCommentsAndDiscussionThreads < ActiveRecord::Migration[7.1]
  def change
    add_column :comments, :username, :string
    add_column :discussion_threads, :username, :string
  end
end
