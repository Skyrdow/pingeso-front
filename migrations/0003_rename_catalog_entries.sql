-- Renombra el catálogo conservando fórmulas, precios y demás atributos.

UPDATE Quincalleria
SET desc_quin = CASE id_quincalleria
    WHEN 1 THEN 'Sello de marco Lumen'
    WHEN 2 THEN 'Junta izquierda Vela'
    WHEN 3 THEN 'Junta derecha Vela'
    WHEN 4 THEN 'Felpa deslizante Brisa'
    WHEN 5 THEN 'Burlete continuo Nube'
    WHEN 6 THEN 'Caja de aguja Alba'
    WHEN 7 THEN 'Guía superior Prisma'
    WHEN 8 THEN 'Guía inferior Prisma'
    WHEN 9 THEN 'Cierre compacto Boreal'
    WHEN 10 THEN 'Retén de hoja Norte'
    WHEN 11 THEN 'Enganche curvo Lazo'
    WHEN 12 THEN 'Tope amortiguador Aurora'
    WHEN 13 THEN 'Tope superior Alerce'
    WHEN 14 THEN 'Tope inferior Alerce'
    WHEN 15 THEN 'Tornillo de fijación Nival'
    WHEN 16 THEN 'Tope superior Luma'
    WHEN 17 THEN 'Tope inferior Luma'
    WHEN 18 THEN 'Burlete en U Bruma'
    WHEN 19 THEN 'Caja de aguja Faro'
    WHEN 20 THEN 'Cierre deslizante Boreal'
    WHEN 21 THEN 'Suplemento de marco Alba'
    WHEN 22 THEN 'Enganche de hoja Viento'
    WHEN 23 THEN 'Mecanismo de punto único Faro'
    WHEN 24 THEN 'Manilla de cierre Marfil'
    WHEN 25 THEN 'Retén para marco Ladera'
    WHEN 26 THEN 'Seguro antielevación Cumbre'
    WHEN 27 THEN 'Tapa izquierda Nacar'
    WHEN 28 THEN 'Tapa derecha Nacar'
    WHEN 29 THEN 'Amortiguador de hoja Horizonte'
    WHEN 30 THEN 'Tornillo corto Nival'
    WHEN 31 THEN 'Retén de marco Boreal'
    WHEN 32 THEN 'Unión angular Prisma'
    WHEN 33 THEN 'Burlete de base Vela'
    WHEN 34 THEN 'Burlete de cuña Vela'
    WHEN 35 THEN 'Clip sencillo Lazo'
    WHEN 36 THEN 'Unión angular Alba'
    WHEN 37 THEN 'Manilla cremona Celeste'
    WHEN 38 THEN 'Kit de cierre doble Alba'
    WHEN 39 THEN 'Brazo proyectante Horizonte'
    WHEN 40 THEN 'Burlete de doble contacto Nube'
    WHEN 41 THEN 'Conector exterior Viento'
    WHEN 42 THEN 'Perno de ocho milímetros Nival'
    WHEN 43 THEN 'Burlete de base Bruma'
    WHEN 44 THEN 'Burlete de cuña Bruma'
    WHEN 45 THEN 'Clip sencillo Boreal'
    WHEN 46 THEN 'Bisagra triple Aurora'
    WHEN 47 THEN 'Manillón de apertura Marfil'
    WHEN 48 THEN 'Cerradura de seguridad Faro'
    WHEN 49 THEN 'Clip doble Lazo'
    WHEN 50 THEN 'Burlete EPDM Nube'
    WHEN 51 THEN 'Tornillo largo Nival'
    WHEN 52 THEN 'Soporte de perfil Prisma'
    ELSE desc_quin
END
WHERE id_quincalleria BETWEEN 1 AND 52;

UPDATE Color
SET nombre_color = CASE id_color
    WHEN 1 THEN 'Madera Bruma'
    WHEN 2 THEN 'Titanio Cobalto'
    WHEN 3 THEN 'Mate Perla'
    WHEN 4 THEN 'Blanco Lino'
    WHEN 5 THEN 'Antracita Nocturna'
    WHEN 6 THEN 'Roble Miel'
    WHEN 7 THEN 'Negro Ónix'
    ELSE nombre_color
END
WHERE id_color BETWEEN 1 AND 7;

UPDATE Material
SET nombre_material = CASE id_material
    WHEN 1 THEN 'Aluminio Aurora'
    WHEN 2 THEN 'PVC Boreal'
    WHEN 3 THEN 'Aluminio Prisma'
    ELSE nombre_material
END
WHERE id_material BETWEEN 1 AND 3;

UPDATE Tipo
SET descripcion_tipo = CASE id_tipo
    WHEN 1 THEN 'Ventana Aurora Corredera Compacta'
    WHEN 2 THEN 'Ventana Aurora Corredera Panorámica'
    WHEN 3 THEN 'Ventana Aurora Paño Fijo'
    WHEN 4 THEN 'Ventana Aurora Proyectante'
    WHEN 5 THEN 'Ventana Aurora Abatible'
    WHEN 6 THEN 'Puerta Aurora Batiente'
    WHEN 7 THEN 'Ventana Boreal Marco Fijo'
    WHEN 8 THEN 'Puerta Boreal Abatible'
    WHEN 9 THEN 'Ventana Boreal Abatible'
    WHEN 10 THEN 'Ventana Boreal Corredera Compacta'
    WHEN 11 THEN 'Ventana Boreal Corredera Panorámica'
    WHEN 12 THEN 'Ventana Prisma Corredera Compacta'
    WHEN 13 THEN 'Ventana Prisma Corredera Panorámica'
    WHEN 14 THEN 'Ventana Prisma Paño Fijo'
    WHEN 15 THEN 'Ventana Prisma Proyectante'
    WHEN 16 THEN 'Ventana Prisma Abatible'
    WHEN 17 THEN 'Puerta Prisma Batiente'
    ELSE descripcion_tipo
END
WHERE id_tipo BETWEEN 1 AND 17;

UPDATE Cristal
SET desc_cristal = substr(desc_cristal, 8)
WHERE id_cristal BETWEEN 1 AND 14 AND desc_cristal LIKE 'DEMO · %';
