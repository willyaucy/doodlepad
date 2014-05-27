class CreateStrokes < ActiveRecord::Migration
  def change
    create_table :strokes do |t|
      t.integer :clickx
      t.integer :clicky
      t.binary :clickdrag

      t.timestamps
    end
  end
end
