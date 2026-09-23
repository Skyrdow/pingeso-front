-- Marca los nombres del catálogo de demostración sin alterar sus datos de cálculo o precios.
UPDATE Quincalleria
SET desc_quin = 'DEMO · ' || desc_quin
WHERE id_quincalleria BETWEEN 1 AND 52 AND desc_quin NOT LIKE 'DEMO · %';

UPDATE Cristal
SET desc_cristal = 'DEMO · ' || desc_cristal
WHERE id_cristal BETWEEN 1 AND 14 AND desc_cristal NOT LIKE 'DEMO · %';

UPDATE Color
SET nombre_color = 'DEMO · ' || nombre_color
WHERE id_color BETWEEN 1 AND 7 AND nombre_color NOT LIKE 'DEMO · %';

UPDATE Material
SET nombre_material = 'DEMO · ' || nombre_material
WHERE id_material BETWEEN 1 AND 3 AND nombre_material NOT LIKE 'DEMO · %';

UPDATE Tipo
SET descripcion_tipo = 'DEMO · ' || descripcion_tipo
WHERE id_tipo BETWEEN 1 AND 17 AND descripcion_tipo NOT LIKE 'DEMO · %';
