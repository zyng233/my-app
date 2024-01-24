class RemoveUserIdFromCommentsAndDiscussionThreads < ActiveRecord::Migration[7.1]
  def change
    remove_column :comments, :user_id
    remove_column :discussion_threads, :user_id
  end
end
