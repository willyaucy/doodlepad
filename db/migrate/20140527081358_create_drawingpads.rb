class CreateDrawingpads < ActiveRecord::Migration
  def change
    create_table :drawingpads do |t|
      t.string :title
      t.string :background

      t.timestamps
    end
  end
end
