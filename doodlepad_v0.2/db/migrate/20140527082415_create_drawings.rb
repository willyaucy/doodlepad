class CreateDrawings < ActiveRecord::Migration
  def change
    create_table :drawings do |t|
      t.integer :layer
      t.string :color

      t.timestamps
    end
  end
end
