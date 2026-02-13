-- Insertar rutas de imágenes para los autos 9-29
-- Asumiendo que cada auto tiene una imagen llamada image1.jpg en su carpeta

DELETE FROM car_images WHERE car_id BETWEEN 9 AND 29;

INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(9, 'uploads/cars/9/image1.jpg', 1, 1),
(10, 'uploads/cars/10/image1.jpg', 1, 1),
(11, 'uploads/cars/11/image1.jpg', 1, 1),
(12, 'uploads/cars/12/image1.jpg', 1, 1),
(13, 'uploads/cars/13/image1.jpg', 1, 1),
(14, 'uploads/cars/14/image1.jpg', 1, 1),
(15, 'uploads/cars/15/image1.jpg', 1, 1),
(16, 'uploads/cars/16/image1.jpg', 1, 1),
(17, 'uploads/cars/17/image1.jpg', 1, 1),
(18, 'uploads/cars/18/image1.jpg', 1, 1),
(19, 'uploads/cars/19/image1.jpg', 1, 1),
(20, 'uploads/cars/20/image1.jpg', 1, 1),
(21, 'uploads/cars/21/image1.jpg', 1, 1),
(22, 'uploads/cars/22/image1.jpg', 1, 1),
(23, 'uploads/cars/23/image1.jpg', 1, 1),
(24, 'uploads/cars/24/image1.jpg', 1, 1),
(25, 'uploads/cars/25/image1.jpg', 1, 1),
(26, 'uploads/cars/26/image1.jpg', 1, 1),
(27, 'uploads/cars/27/image1.jpg', 1, 1),
(28, 'uploads/cars/28/image1.jpg', 1, 1),
(29, 'uploads/cars/29/image1.jpg', 1, 1);
