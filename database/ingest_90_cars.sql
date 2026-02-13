USE takeoffauto_db;

-- Chevrolet Agile 2016
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Chevrolet', 'Agile', '1.4 Ls', 2016, 14994000, 120917, 'manual', 'gasolina', '1.4', '92 hp', 2, 4063, 1835, 1549, 3085, 54, 1, 'Conductor y pasajero', 1, 1, 1, 1, 'Hidráulica', 'Delantera', 1, 1, 1, 'hatchback', 'Plateado', 5, 5, 'Córdoba Capital', 'disponible', 1);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/chevrolet_agile_1_4_ls_2016_120917km_foto_01.webp', 1, 0),
(@car_id, 'uploads/cars/chevrolet_agile_1_4_ls_2016_120917km_foto_04.webp', 0, 1),
(@car_id, 'uploads/cars/chevrolet_agile_1_4_ls_2016_120917km_foto_07.webp', 0, 2),
(@car_id, 'uploads/cars/chevrolet_agile_1_4_ls_2016_120917km_foto_08.webp', 0, 3),
(@car_id, 'uploads/cars/chevrolet_agile_1_4_ls_2016_120917km_foto_09.webp', 0, 4),
(@car_id, 'uploads/cars/chevrolet_agile_1_4_ls_2016_120917km_foto_10.webp', 0, 5),
(@car_id, 'uploads/cars/chevrolet_agile_1_4_ls_2016_120917km_foto_11.webp', 0, 6),
(@car_id, 'uploads/cars/chevrolet_agile_1_4_ls_2016_120917km_foto_12.webp', 0, 7),
(@car_id, 'uploads/cars/chevrolet_agile_1_4_ls_2016_120917km_foto_13.webp', 0, 8),
(@car_id, 'uploads/cars/chevrolet_agile_1_4_ls_2016_120917km_foto_14.webp', 0, 9),
(@car_id, 'uploads/cars/chevrolet_agile_1_4_ls_2016_120917km_foto_15.webp', 0, 10),
(@car_id, 'uploads/cars/chevrolet_agile_1_4_ls_2016_120917km_foto_16.webp', 0, 11),
(@car_id, 'uploads/cars/chevrolet_agile_1_4_ls_2016_120917km_foto_17.webp', 0, 12),
(@car_id, 'uploads/cars/chevrolet_agile_1_4_ls_2016_120917km_foto_18.webp', 0, 13),
(@car_id, 'uploads/cars/chevrolet_agile_1_4_ls_2016_120917km_foto_19.webp', 0, 14),
(@car_id, 'uploads/cars/chevrolet_agile_1_4_ls_2016_120917km_foto_20.webp', 0, 15),
(@car_id, 'uploads/cars/chevrolet_agile_1_4_ls_2016_120917km_foto_21.webp', 0, 16);

-- Chevrolet Cruze 2022
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Chevrolet', 'Cruze', '1.4 Ltz At Sedan', 2022, 29890000, 57176, 'automatico', 'gasolina', '1.4', '153 hp', 4, 4665, 2042, 1484, 2700, 52, 1, 'Conductor y pasajero', 1, 0, 0, 0, 'Eléctrica', 'Delantera', 0, 0, 0, 'sedan', 'Blanco', 4, 5, 'Córdoba Capital', 'disponible', 1);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/chevrolet_cruze_1_4_ltz_at_sedan_2022_57176km_foto_01.webp', 1, 0),
(@car_id, 'uploads/cars/chevrolet_cruze_1_4_ltz_at_sedan_2022_57176km_foto_02.webp', 0, 1),
(@car_id, 'uploads/cars/chevrolet_cruze_1_4_ltz_at_sedan_2022_57176km_foto_03.webp', 0, 2),
(@car_id, 'uploads/cars/chevrolet_cruze_1_4_ltz_at_sedan_2022_57176km_foto_04.webp', 0, 3),
(@car_id, 'uploads/cars/chevrolet_cruze_1_4_ltz_at_sedan_2022_57176km_foto_05.webp', 0, 4),
(@car_id, 'uploads/cars/chevrolet_cruze_1_4_ltz_at_sedan_2022_57176km_foto_06.webp', 0, 5),
(@car_id, 'uploads/cars/chevrolet_cruze_1_4_ltz_at_sedan_2022_57176km_foto_07.webp', 0, 6),
(@car_id, 'uploads/cars/chevrolet_cruze_1_4_ltz_at_sedan_2022_57176km_foto_08.webp', 0, 7),
(@car_id, 'uploads/cars/chevrolet_cruze_1_4_ltz_at_sedan_2022_57176km_foto_09.webp', 0, 8),
(@car_id, 'uploads/cars/chevrolet_cruze_1_4_ltz_at_sedan_2022_57176km_foto_10.webp', 0, 9),
(@car_id, 'uploads/cars/chevrolet_cruze_1_4_ltz_at_sedan_2022_57176km_foto_11.webp', 0, 10),
(@car_id, 'uploads/cars/chevrolet_cruze_1_4_ltz_at_sedan_2022_57176km_foto_12.webp', 0, 11),
(@car_id, 'uploads/cars/chevrolet_cruze_1_4_ltz_at_sedan_2022_57176km_foto_13.webp', 0, 12),
(@car_id, 'uploads/cars/chevrolet_cruze_1_4_ltz_at_sedan_2022_57176km_foto_14.webp', 0, 13),
(@car_id, 'uploads/cars/chevrolet_cruze_1_4_ltz_at_sedan_2022_57176km_foto_15.webp', 0, 14),
(@car_id, 'uploads/cars/chevrolet_cruze_1_4_ltz_at_sedan_2022_57176km_foto_16.webp', 0, 15),
(@car_id, 'uploads/cars/chevrolet_cruze_1_4_ltz_at_sedan_2022_57176km_foto_17.webp', 0, 16),
(@car_id, 'uploads/cars/chevrolet_cruze_1_4_ltz_at_sedan_2022_57176km_foto_18.webp', 0, 17);

-- Chevrolet Equinox 2019
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Chevrolet', 'Equinox', '1.5t Premier 4wd', 2019, 30870000, 75787, 'automatico', 'gasolina', '1.5', '172 hp', 4, 4651, 1844, 1661, 2725, 59, 1, 'Conductor y pasajero', 1, 1, 1, 1, 'Hidráulica', '4x4', 0, 1, 0, 'suv', 'Plateado', 5, 5, 'Córdoba Capital', 'disponible', 1);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/chevrolet_equinox_1_5t_premier_4wd_2019_75787km_foto_01.webp', 1, 0),
(@car_id, 'uploads/cars/chevrolet_equinox_1_5t_premier_4wd_2019_75787km_foto_02.webp', 0, 1),
(@car_id, 'uploads/cars/chevrolet_equinox_1_5t_premier_4wd_2019_75787km_foto_03.webp', 0, 2),
(@car_id, 'uploads/cars/chevrolet_equinox_1_5t_premier_4wd_2019_75787km_foto_04.webp', 0, 3),
(@car_id, 'uploads/cars/chevrolet_equinox_1_5t_premier_4wd_2019_75787km_foto_05.webp', 0, 4),
(@car_id, 'uploads/cars/chevrolet_equinox_1_5t_premier_4wd_2019_75787km_foto_06.webp', 0, 5),
(@car_id, 'uploads/cars/chevrolet_equinox_1_5t_premier_4wd_2019_75787km_foto_07.webp', 0, 6),
(@car_id, 'uploads/cars/chevrolet_equinox_1_5t_premier_4wd_2019_75787km_foto_08.webp', 0, 7),
(@car_id, 'uploads/cars/chevrolet_equinox_1_5t_premier_4wd_2019_75787km_foto_09.webp', 0, 8),
(@car_id, 'uploads/cars/chevrolet_equinox_1_5t_premier_4wd_2019_75787km_foto_10.webp', 0, 9),
(@car_id, 'uploads/cars/chevrolet_equinox_1_5t_premier_4wd_2019_75787km_foto_11.webp', 0, 10),
(@car_id, 'uploads/cars/chevrolet_equinox_1_5t_premier_4wd_2019_75787km_foto_12.webp', 0, 11),
(@car_id, 'uploads/cars/chevrolet_equinox_1_5t_premier_4wd_2019_75787km_foto_13.webp', 0, 12),
(@car_id, 'uploads/cars/chevrolet_equinox_1_5t_premier_4wd_2019_75787km_foto_14.webp', 0, 13),
(@car_id, 'uploads/cars/chevrolet_equinox_1_5t_premier_4wd_2019_75787km_foto_15.webp', 0, 14),
(@car_id, 'uploads/cars/chevrolet_equinox_1_5t_premier_4wd_2019_75787km_foto_16.webp', 0, 15),
(@car_id, 'uploads/cars/chevrolet_equinox_1_5t_premier_4wd_2019_75787km_foto_17.webp', 0, 16),
(@car_id, 'uploads/cars/chevrolet_equinox_1_5t_premier_4wd_2019_75787km_foto_18.webp', 0, 17);

-- Chevrolet Onix 2020
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Chevrolet', 'Onix', '1.2 Ls', 2020, 19110000, 97897, 'manual', 'gasolina', '1.2', '90 hp', 2, 3930, 1656, 1484, 2465, 54, 1, 'Conductor y pasajero', 0, 1, 0, 0, 'Asistida', 'Delantera', 0, 1, 0, 'hatchback', 'Blanco', 5, 5, 'Córdoba Capital', 'disponible', 1);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/chevrolet_onix_1_2_ls_2020_97897km_foto_01.webp', 1, 0),
(@car_id, 'uploads/cars/chevrolet_onix_1_2_ls_2020_97897km_foto_02.webp', 0, 1),
(@car_id, 'uploads/cars/chevrolet_onix_1_2_ls_2020_97897km_foto_03.webp', 0, 2),
(@car_id, 'uploads/cars/chevrolet_onix_1_2_ls_2020_97897km_foto_04.webp', 0, 3),
(@car_id, 'uploads/cars/chevrolet_onix_1_2_ls_2020_97897km_foto_05.webp', 0, 4),
(@car_id, 'uploads/cars/chevrolet_onix_1_2_ls_2020_97897km_foto_06.webp', 0, 5),
(@car_id, 'uploads/cars/chevrolet_onix_1_2_ls_2020_97897km_foto_07.webp', 0, 6),
(@car_id, 'uploads/cars/chevrolet_onix_1_2_ls_2020_97897km_foto_08.webp', 0, 7),
(@car_id, 'uploads/cars/chevrolet_onix_1_2_ls_2020_97897km_foto_09.webp', 0, 8),
(@car_id, 'uploads/cars/chevrolet_onix_1_2_ls_2020_97897km_foto_10.webp', 0, 9),
(@car_id, 'uploads/cars/chevrolet_onix_1_2_ls_2020_97897km_foto_11.webp', 0, 10),
(@car_id, 'uploads/cars/chevrolet_onix_1_2_ls_2020_97897km_foto_12.webp', 0, 11),
(@car_id, 'uploads/cars/chevrolet_onix_1_2_ls_2020_97897km_foto_13.webp', 0, 12),
(@car_id, 'uploads/cars/chevrolet_onix_1_2_ls_2020_97897km_foto_14.webp', 0, 13),
(@car_id, 'uploads/cars/chevrolet_onix_1_2_ls_2020_97897km_foto_15.webp', 0, 14),
(@car_id, 'uploads/cars/chevrolet_onix_1_2_ls_2020_97897km_foto_16.webp', 0, 15),
(@car_id, 'uploads/cars/chevrolet_onix_1_2_ls_2020_97897km_foto_17.webp', 0, 16);

-- Chevrolet Onix 2020
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Chevrolet', 'Onix', '1.4 Joy Ls', 2020, 18130000, 76732, 'manual', 'gasolina', '1.4', '98 hp', 2, 3930, 1656, 1484, 2465, 54, 1, 'Conductor y pasajero', 0, 0, 0, 0, 'Asistida', 'Delantera', 0, 1, 0, 'hatchback', 'Blanco', 5, 5, 'Córdoba Capital', 'disponible', 1);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_76732km_foto_01.webp', 1, 0),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_76732km_foto_02.webp', 0, 1),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_76732km_foto_03.webp', 0, 2),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_76732km_foto_04.webp', 0, 3),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_76732km_foto_05.webp', 0, 4),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_76732km_foto_06.webp', 0, 5),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_76732km_foto_07.webp', 0, 6),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_76732km_foto_08.webp', 0, 7),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_76732km_foto_09.webp', 0, 8),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_76732km_foto_10.webp', 0, 9),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_76732km_foto_11.webp', 0, 10),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_76732km_foto_12.webp', 0, 11),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_76732km_foto_13.webp', 0, 12),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_76732km_foto_14.webp', 0, 13),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_76732km_foto_15.webp', 0, 14),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_76732km_foto_16.webp', 0, 15),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_76732km_foto_17.webp', 0, 16),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_76732km_foto_18.webp', 0, 17),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_76732km_foto_19.webp', 0, 18);

-- Chevrolet Onix 2020
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Chevrolet', 'Onix', '1.4 Joy Ls', 2020, 18130000, 81694, 'manual', 'gasolina', '1.4', '98 hp', 2, 3930, 1656, 1484, 2465, 54, 1, 'Conductor y pasajero', 0, 0, 0, 0, 'Asistida', 'Delantera', 0, 1, 0, 'hatchback', 'Gris', 5, 5, 'Córdoba Capital', 'disponible', 1);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_81694km_foto_01.webp', 1, 0),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_81694km_foto_02.webp', 0, 1),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_81694km_foto_03.webp', 0, 2),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_81694km_foto_04.webp', 0, 3),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_81694km_foto_05.webp', 0, 4),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_81694km_foto_06.webp', 0, 5),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_81694km_foto_07.webp', 0, 6),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_81694km_foto_08.webp', 0, 7),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_81694km_foto_09.webp', 0, 8),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_81694km_foto_10.webp', 0, 9),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_81694km_foto_11.webp', 0, 10),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_81694km_foto_12.webp', 0, 11),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_81694km_foto_13.webp', 0, 12),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_81694km_foto_14.webp', 0, 13),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_81694km_foto_15.webp', 0, 14),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_81694km_foto_16.webp', 0, 15),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_81694km_foto_17.webp', 0, 16),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_2020_81694km_foto_18.webp', 0, 17);

-- Chevrolet Onix 2018
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Chevrolet', 'Onix', '1.4 Joy Ls 98cv', 2018, 15778000, 102263, 'manual', 'gasolina', '1.4', '98 hp', 2, 3930, 1656, 1484, 2465, 54, 1, 'Conductor y pasajero', 0, 0, 0, 0, 'Asistida', 'Delantera', 0, 1, 0, 'hatchback', 'Gris', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_102263km_foto_01.webp', 1, 0),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_102263km_foto_02.webp', 0, 1),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_102263km_foto_03.webp', 0, 2),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_102263km_foto_04.webp', 0, 3),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_102263km_foto_05.webp', 0, 4),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_102263km_foto_06.webp', 0, 5),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_102263km_foto_07.webp', 0, 6),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_102263km_foto_08.webp', 0, 7),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_102263km_foto_09.webp', 0, 8),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_102263km_foto_10.webp', 0, 9),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_102263km_foto_11.webp', 0, 10),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_102263km_foto_12.webp', 0, 11),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_102263km_foto_13.webp', 0, 12),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_102263km_foto_14.webp', 0, 13),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_102263km_foto_15.webp', 0, 14),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_102263km_foto_16.webp', 0, 15),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_102263km_foto_17.webp', 0, 16),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_102263km_foto_18.webp', 0, 17),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_102263km_foto_19.webp', 0, 18),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_102263km_foto_20.webp', 0, 19),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_102263km_foto_21.webp', 0, 20),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_102263km_foto_22.webp', 0, 21),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_102263km_foto_23.webp', 0, 22);

-- Chevrolet Onix 2018
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Chevrolet', 'Onix', '1.4 Joy Ls 98cv', 2018, 16660000, 72964, 'manual', 'gasolina', '1.4', '98 hp', 2, 3930, 1656, 1484, 2465, 54, 1, 'Conductor y pasajero', 0, 0, 0, 0, 'Asistida', 'Delantera', 0, 1, 0, 'hatchback', 'Blanco', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_72964km_foto_01.webp', 1, 0),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_72964km_foto_02.webp', 0, 1),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_72964km_foto_03.webp', 0, 2),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_72964km_foto_04.webp', 0, 3),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_72964km_foto_05.webp', 0, 4),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_72964km_foto_06.webp', 0, 5),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_72964km_foto_07.webp', 0, 6),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_72964km_foto_08.webp', 0, 7),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_72964km_foto_09.webp', 0, 8),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_72964km_foto_10.webp', 0, 9),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_72964km_foto_11.webp', 0, 10),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_72964km_foto_12.webp', 0, 11),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_72964km_foto_13.webp', 0, 12),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_72964km_foto_14.webp', 0, 13),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_72964km_foto_15.webp', 0, 14),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_72964km_foto_16.webp', 0, 15),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_72964km_foto_17.webp', 0, 16),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_72964km_foto_18.webp', 0, 17),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_72964km_foto_19.webp', 0, 18),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_72964km_foto_20.webp', 0, 19),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_72964km_foto_21.webp', 0, 20),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_72964km_foto_22.webp', 0, 21),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_72964km_foto_23.webp', 0, 22),
(@car_id, 'uploads/cars/chevrolet_onix_1_4_joy_ls_98cv_2018_72964km_foto_24.webp', 0, 23);

-- Chevrolet Spin 2019
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Chevrolet', 'Spin', '1.8 Activ Ltz 5as 105cv', 2019, 20090000, 115430, 'manual', 'gasolina', '1.8', '105 hp', 2, 4360, 1810, 1664, 2580, 53, 1, 'Conductor y pasajero', 1, 1, 0, 1, '', 'Delantera', 0, 1, 0, 'sedan', 'Gris', 5, 7, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/chevrolet_spin_1_8_activ_ltz_5as_105cv_2019_115430km_foto_01.webp', 1, 0),
(@car_id, 'uploads/cars/chevrolet_spin_1_8_activ_ltz_5as_105cv_2019_115430km_foto_02.webp', 0, 1),
(@car_id, 'uploads/cars/chevrolet_spin_1_8_activ_ltz_5as_105cv_2019_115430km_foto_03.webp', 0, 2),
(@car_id, 'uploads/cars/chevrolet_spin_1_8_activ_ltz_5as_105cv_2019_115430km_foto_04.webp', 0, 3),
(@car_id, 'uploads/cars/chevrolet_spin_1_8_activ_ltz_5as_105cv_2019_115430km_foto_05.webp', 0, 4),
(@car_id, 'uploads/cars/chevrolet_spin_1_8_activ_ltz_5as_105cv_2019_115430km_foto_06.webp', 0, 5),
(@car_id, 'uploads/cars/chevrolet_spin_1_8_activ_ltz_5as_105cv_2019_115430km_foto_07.webp', 0, 6),
(@car_id, 'uploads/cars/chevrolet_spin_1_8_activ_ltz_5as_105cv_2019_115430km_foto_08.webp', 0, 7),
(@car_id, 'uploads/cars/chevrolet_spin_1_8_activ_ltz_5as_105cv_2019_115430km_foto_09.webp', 0, 8),
(@car_id, 'uploads/cars/chevrolet_spin_1_8_activ_ltz_5as_105cv_2019_115430km_foto_10.webp', 0, 9),
(@car_id, 'uploads/cars/chevrolet_spin_1_8_activ_ltz_5as_105cv_2019_115430km_foto_11.webp', 0, 10),
(@car_id, 'uploads/cars/chevrolet_spin_1_8_activ_ltz_5as_105cv_2019_115430km_foto_12.webp', 0, 11),
(@car_id, 'uploads/cars/chevrolet_spin_1_8_activ_ltz_5as_105cv_2019_115430km_foto_13.webp', 0, 12),
(@car_id, 'uploads/cars/chevrolet_spin_1_8_activ_ltz_5as_105cv_2019_115430km_foto_14.webp', 0, 13),
(@car_id, 'uploads/cars/chevrolet_spin_1_8_activ_ltz_5as_105cv_2019_115430km_foto_15.webp', 0, 14),
(@car_id, 'uploads/cars/chevrolet_spin_1_8_activ_ltz_5as_105cv_2019_115430km_foto_16.webp', 0, 15),
(@car_id, 'uploads/cars/chevrolet_spin_1_8_activ_ltz_5as_105cv_2019_115430km_foto_17.webp', 0, 16),
(@car_id, 'uploads/cars/chevrolet_spin_1_8_activ_ltz_5as_105cv_2019_115430km_foto_18.webp', 0, 17),
(@car_id, 'uploads/cars/chevrolet_spin_1_8_activ_ltz_5as_105cv_2019_115430km_foto_19.webp', 0, 18);

-- Chevrolet Spin 2020
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Chevrolet', 'Spin', '1.8 Premier Mt', 2020, 22540000, 134904, 'manual', 'gasolina', '1.8', '', 0, 0, 0, 0, 0, 0, 0, 'No', 0, 0, 0, 0, '', 'Delantera', 0, 0, 0, 'sedan', 'Negro', 5, 0, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/chevrolet_spin_1_8n_premier_mt_2020_2020_134904km_foto_01.webp', 1, 0),
(@car_id, 'uploads/cars/chevrolet_spin_1_8n_premier_mt_2020_2020_134904km_foto_02.webp', 0, 1),
(@car_id, 'uploads/cars/chevrolet_spin_1_8n_premier_mt_2020_2020_134904km_foto_03.webp', 0, 2),
(@car_id, 'uploads/cars/chevrolet_spin_1_8n_premier_mt_2020_2020_134904km_foto_04.webp', 0, 3),
(@car_id, 'uploads/cars/chevrolet_spin_1_8n_premier_mt_2020_2020_134904km_foto_05.webp', 0, 4),
(@car_id, 'uploads/cars/chevrolet_spin_1_8n_premier_mt_2020_2020_134904km_foto_06.webp', 0, 5),
(@car_id, 'uploads/cars/chevrolet_spin_1_8n_premier_mt_2020_2020_134904km_foto_07.webp', 0, 6),
(@car_id, 'uploads/cars/chevrolet_spin_1_8n_premier_mt_2020_2020_134904km_foto_08.webp', 0, 7),
(@car_id, 'uploads/cars/chevrolet_spin_1_8n_premier_mt_2020_2020_134904km_foto_09.webp', 0, 8),
(@car_id, 'uploads/cars/chevrolet_spin_1_8n_premier_mt_2020_2020_134904km_foto_10.webp', 0, 9),
(@car_id, 'uploads/cars/chevrolet_spin_1_8n_premier_mt_2020_2020_134904km_foto_11.webp', 0, 10),
(@car_id, 'uploads/cars/chevrolet_spin_1_8n_premier_mt_2020_2020_134904km_foto_12.webp', 0, 11),
(@car_id, 'uploads/cars/chevrolet_spin_1_8n_premier_mt_2020_2020_134904km_foto_13.webp', 0, 12),
(@car_id, 'uploads/cars/chevrolet_spin_1_8n_premier_mt_2020_2020_134904km_foto_14.webp', 0, 13),
(@car_id, 'uploads/cars/chevrolet_spin_1_8n_premier_mt_2020_2020_134904km_foto_15.webp', 0, 14),
(@car_id, 'uploads/cars/chevrolet_spin_1_8n_premier_mt_2020_2020_134904km_foto_16.webp', 0, 15),
(@car_id, 'uploads/cars/chevrolet_spin_1_8n_premier_mt_2020_2020_134904km_foto_17.webp', 0, 16),
(@car_id, 'uploads/cars/chevrolet_spin_1_8n_premier_mt_2020_2020_134904km_foto_18.webp', 0, 17),
(@car_id, 'uploads/cars/chevrolet_spin_1_8n_premier_mt_2020_2020_134904km_foto_19.webp', 0, 18),
(@car_id, 'uploads/cars/chevrolet_spin_1_8n_premier_mt_2020_2020_134904km_foto_20.webp', 0, 19),
(@car_id, 'uploads/cars/chevrolet_spin_1_8n_premier_mt_2020_2020_134904km_foto_21.webp', 0, 20);

-- Chevrolet Tracker 2023
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Chevrolet', 'Tracker', '1.2 Turbo Ltz At', 2023, 31360000, 72272, 'automatico', 'gasolina', '1.2', '132 hp', 4, 4270, 1791, 1626, 2570, 44, 1, 'Conductor y pasajero', 1, 1, 0, 1, 'Eléctrica', '4x2', 0, 1, 0, 'suv', 'Blanco', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/chevrolet_tracker_1_2_turbo_ltz_at_2023_72272km_foto_01.webp', 1, 0),
(@car_id, 'uploads/cars/chevrolet_tracker_1_2_turbo_ltz_at_2023_72272km_foto_02.webp', 0, 1),
(@car_id, 'uploads/cars/chevrolet_tracker_1_2_turbo_ltz_at_2023_72272km_foto_03.webp', 0, 2),
(@car_id, 'uploads/cars/chevrolet_tracker_1_2_turbo_ltz_at_2023_72272km_foto_04.webp', 0, 3),
(@car_id, 'uploads/cars/chevrolet_tracker_1_2_turbo_ltz_at_2023_72272km_foto_05.webp', 0, 4),
(@car_id, 'uploads/cars/chevrolet_tracker_1_2_turbo_ltz_at_2023_72272km_foto_06.webp', 0, 5),
(@car_id, 'uploads/cars/chevrolet_tracker_1_2_turbo_ltz_at_2023_72272km_foto_07.webp', 0, 6),
(@car_id, 'uploads/cars/chevrolet_tracker_1_2_turbo_ltz_at_2023_72272km_foto_08.webp', 0, 7),
(@car_id, 'uploads/cars/chevrolet_tracker_1_2_turbo_ltz_at_2023_72272km_foto_09.webp', 0, 8),
(@car_id, 'uploads/cars/chevrolet_tracker_1_2_turbo_ltz_at_2023_72272km_foto_10.webp', 0, 9),
(@car_id, 'uploads/cars/chevrolet_tracker_1_2_turbo_ltz_at_2023_72272km_foto_11.webp', 0, 10),
(@car_id, 'uploads/cars/chevrolet_tracker_1_2_turbo_ltz_at_2023_72272km_foto_12.webp', 0, 11),
(@car_id, 'uploads/cars/chevrolet_tracker_1_2_turbo_ltz_at_2023_72272km_foto_13.webp', 0, 12),
(@car_id, 'uploads/cars/chevrolet_tracker_1_2_turbo_ltz_at_2023_72272km_foto_14.webp', 0, 13),
(@car_id, 'uploads/cars/chevrolet_tracker_1_2_turbo_ltz_at_2023_72272km_foto_15.webp', 0, 14),
(@car_id, 'uploads/cars/chevrolet_tracker_1_2_turbo_ltz_at_2023_72272km_foto_16.webp', 0, 15),
(@car_id, 'uploads/cars/chevrolet_tracker_1_2_turbo_ltz_at_2023_72272km_foto_17.webp', 0, 16);

-- Chevrolet Tracker 2018
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Chevrolet', 'Tracker', '1.8 Ltz', 2018, 20090000, 113160, 'manual', 'gasolina', '1.8', '141 hp', 4, 4248, 1657, 1674, 2465, 53, 1, 'Conductor y pasajero', 0, 1, 0, 0, '', '4x2', 0, 1, 0, 'suv', 'Gris', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/chevrolet_tracker_1_8_ltz_2018_113160km_foto_01.webp', 1, 0),
(@car_id, 'uploads/cars/chevrolet_tracker_1_8_ltz_2018_113160km_foto_02.webp', 0, 1),
(@car_id, 'uploads/cars/chevrolet_tracker_1_8_ltz_2018_113160km_foto_03.webp', 0, 2),
(@car_id, 'uploads/cars/chevrolet_tracker_1_8_ltz_2018_113160km_foto_04.webp', 0, 3),
(@car_id, 'uploads/cars/chevrolet_tracker_1_8_ltz_2018_113160km_foto_05.webp', 0, 4),
(@car_id, 'uploads/cars/chevrolet_tracker_1_8_ltz_2018_113160km_foto_06.webp', 0, 5),
(@car_id, 'uploads/cars/chevrolet_tracker_1_8_ltz_2018_113160km_foto_07.webp', 0, 6),
(@car_id, 'uploads/cars/chevrolet_tracker_1_8_ltz_2018_113160km_foto_08.webp', 0, 7),
(@car_id, 'uploads/cars/chevrolet_tracker_1_8_ltz_2018_113160km_foto_09.webp', 0, 8),
(@car_id, 'uploads/cars/chevrolet_tracker_1_8_ltz_2018_113160km_foto_10.webp', 0, 9),
(@car_id, 'uploads/cars/chevrolet_tracker_1_8_ltz_2018_113160km_foto_11.webp', 0, 10),
(@car_id, 'uploads/cars/chevrolet_tracker_1_8_ltz_2018_113160km_foto_12.webp', 0, 11),
(@car_id, 'uploads/cars/chevrolet_tracker_1_8_ltz_2018_113160km_foto_13.webp', 0, 12),
(@car_id, 'uploads/cars/chevrolet_tracker_1_8_ltz_2018_113160km_foto_14.webp', 0, 13),
(@car_id, 'uploads/cars/chevrolet_tracker_1_8_ltz_2018_113160km_foto_15.webp', 0, 14),
(@car_id, 'uploads/cars/chevrolet_tracker_1_8_ltz_2018_113160km_foto_16.webp', 0, 15),
(@car_id, 'uploads/cars/chevrolet_tracker_1_8_ltz_2018_113160km_foto_17.webp', 0, 16),
(@car_id, 'uploads/cars/chevrolet_tracker_1_8_ltz_2018_113160km_foto_18.webp', 0, 17);

-- Citroën C3 2017
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Citroën', 'C3', '1.5 Feel 90cv', 2017, 18130000, 53781, 'manual', 'gasolina', '1.5', '90 hp', 2, 3850, 1645, 1533, 2443, 47, 1, 'Conductor y pasajero', 0, 1, 1, 1, 'Eléctrica', 'Delantera', 1, 0, 0, 'hatchback', 'Rojo', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/citro_n_c3_1_5_feel_90cv_2017_53781km_foto_01.webp', 1, 0),
(@car_id, 'uploads/cars/citro_n_c3_1_5_feel_90cv_2017_53781km_foto_02.webp', 0, 1),
(@car_id, 'uploads/cars/citro_n_c3_1_5_feel_90cv_2017_53781km_foto_03.webp', 0, 2),
(@car_id, 'uploads/cars/citro_n_c3_1_5_feel_90cv_2017_53781km_foto_04.webp', 0, 3),
(@car_id, 'uploads/cars/citro_n_c3_1_5_feel_90cv_2017_53781km_foto_05.webp', 0, 4),
(@car_id, 'uploads/cars/citro_n_c3_1_5_feel_90cv_2017_53781km_foto_06.webp', 0, 5),
(@car_id, 'uploads/cars/citro_n_c3_1_5_feel_90cv_2017_53781km_foto_07.webp', 0, 6),
(@car_id, 'uploads/cars/citro_n_c3_1_5_feel_90cv_2017_53781km_foto_08.webp', 0, 7),
(@car_id, 'uploads/cars/citro_n_c3_1_5_feel_90cv_2017_53781km_foto_09.webp', 0, 8),
(@car_id, 'uploads/cars/citro_n_c3_1_5_feel_90cv_2017_53781km_foto_10.webp', 0, 9),
(@car_id, 'uploads/cars/citro_n_c3_1_5_feel_90cv_2017_53781km_foto_11.webp', 0, 10),
(@car_id, 'uploads/cars/citro_n_c3_1_5_feel_90cv_2017_53781km_foto_12.webp', 0, 11),
(@car_id, 'uploads/cars/citro_n_c3_1_5_feel_90cv_2017_53781km_foto_13.webp', 0, 12),
(@car_id, 'uploads/cars/citro_n_c3_1_5_feel_90cv_2017_53781km_foto_14.webp', 0, 13),
(@car_id, 'uploads/cars/citro_n_c3_1_5_feel_90cv_2017_53781km_foto_15.webp', 0, 14),
(@car_id, 'uploads/cars/citro_n_c3_1_5_feel_90cv_2017_53781km_foto_16.webp', 0, 15),
(@car_id, 'uploads/cars/citro_n_c3_1_5_feel_90cv_2017_53781km_foto_17.webp', 0, 16),
(@car_id, 'uploads/cars/citro_n_c3_1_5_feel_90cv_2017_53781km_foto_18.webp', 0, 17),
(@car_id, 'uploads/cars/citro_n_c3_1_5_feel_90cv_2017_53781km_foto_19.webp', 0, 18),
(@car_id, 'uploads/cars/citro_n_c3_1_5_feel_90cv_2017_53781km_foto_20.webp', 0, 19),
(@car_id, 'uploads/cars/citro_n_c3_1_5_feel_90cv_2017_53781km_foto_21.webp', 0, 20);

-- Citroën C3 2019
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Citroën', 'C3', '1.6 Vti 115 Urban Trail', 2019, 19355000, 63303, 'manual', 'gasolina', '1.6', '115 hp', 4, 3944, 1728, 1521, 2460, 55, 1, 'Conductor y pasajero', 0, 1, 1, 1, 'Eléctrica', 'Delantera', 1, 1, 1, 'hatchback', 'Rojo', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/citro_n_c3_1_6_vti_115_urban_trail_2019_63303km_foto_01.webp', 1, 0),
(@car_id, 'uploads/cars/citro_n_c3_1_6_vti_115_urban_trail_2019_63303km_foto_05.webp', 0, 1),
(@car_id, 'uploads/cars/citro_n_c3_1_6_vti_115_urban_trail_2019_63303km_foto_06.webp', 0, 2),
(@car_id, 'uploads/cars/citro_n_c3_1_6_vti_115_urban_trail_2019_63303km_foto_07.webp', 0, 3),
(@car_id, 'uploads/cars/citro_n_c3_1_6_vti_115_urban_trail_2019_63303km_foto_10.webp', 0, 4),
(@car_id, 'uploads/cars/citro_n_c3_1_6_vti_115_urban_trail_2019_63303km_foto_11.webp', 0, 5),
(@car_id, 'uploads/cars/citro_n_c3_1_6_vti_115_urban_trail_2019_63303km_foto_12.webp', 0, 6),
(@car_id, 'uploads/cars/citro_n_c3_1_6_vti_115_urban_trail_2019_63303km_foto_13.webp', 0, 7),
(@car_id, 'uploads/cars/citro_n_c3_1_6_vti_115_urban_trail_2019_63303km_foto_14.webp', 0, 8),
(@car_id, 'uploads/cars/citro_n_c3_1_6_vti_115_urban_trail_2019_63303km_foto_15.webp', 0, 9),
(@car_id, 'uploads/cars/citro_n_c3_1_6_vti_115_urban_trail_2019_63303km_foto_16.webp', 0, 10),
(@car_id, 'uploads/cars/citro_n_c3_1_6_vti_115_urban_trail_2019_63303km_foto_17.webp', 0, 11),
(@car_id, 'uploads/cars/citro_n_c3_1_6_vti_115_urban_trail_2019_63303km_foto_18.webp', 0, 12),
(@car_id, 'uploads/cars/citro_n_c3_1_6_vti_115_urban_trail_2019_63303km_foto_19.webp', 0, 13),
(@car_id, 'uploads/cars/citro_n_c3_1_6_vti_115_urban_trail_2019_63303km_foto_20.webp', 0, 14);

-- Citroën C4 Cactus 2020
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Citroën', 'C4 Cactus', '1.6 Vti 115 At6 Feel Pk', 2020, 21560000, 102533, 'automatico', 'gasolina', '1.6', '115 hp', 4, 4170, 1979, 1534, 2600, 55, 1, 'Conductor y pasajero', 0, 0, 0, 0, '', 'Delantera', 0, 0, 0, 'suv', 'Plateado', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/citro_n_c4_cactus_1_6_vti_115_at6_feel_pk_2020_102533km_foto_01.webp', 1, 0),
(@car_id, 'uploads/cars/citro_n_c4_cactus_1_6_vti_115_at6_feel_pk_2020_102533km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/citro_n_c4_cactus_1_6_vti_115_at6_feel_pk_2020_102533km_foto_05.webp', 0, 2),
(@car_id, 'uploads/cars/citro_n_c4_cactus_1_6_vti_115_at6_feel_pk_2020_102533km_foto_06.webp', 0, 3),
(@car_id, 'uploads/cars/citro_n_c4_cactus_1_6_vti_115_at6_feel_pk_2020_102533km_foto_07.webp', 0, 4),
(@car_id, 'uploads/cars/citro_n_c4_cactus_1_6_vti_115_at6_feel_pk_2020_102533km_foto_08.webp', 0, 5),
(@car_id, 'uploads/cars/citro_n_c4_cactus_1_6_vti_115_at6_feel_pk_2020_102533km_foto_09.webp', 0, 6),
(@car_id, 'uploads/cars/citro_n_c4_cactus_1_6_vti_115_at6_feel_pk_2020_102533km_foto_10.webp', 0, 7),
(@car_id, 'uploads/cars/citro_n_c4_cactus_1_6_vti_115_at6_feel_pk_2020_102533km_foto_11.webp', 0, 8),
(@car_id, 'uploads/cars/citro_n_c4_cactus_1_6_vti_115_at6_feel_pk_2020_102533km_foto_12.webp', 0, 9),
(@car_id, 'uploads/cars/citro_n_c4_cactus_1_6_vti_115_at6_feel_pk_2020_102533km_foto_13.webp', 0, 10),
(@car_id, 'uploads/cars/citro_n_c4_cactus_1_6_vti_115_at6_feel_pk_2020_102533km_foto_14.webp', 0, 11),
(@car_id, 'uploads/cars/citro_n_c4_cactus_1_6_vti_115_at6_feel_pk_2020_102533km_foto_15.webp', 0, 12),
(@car_id, 'uploads/cars/citro_n_c4_cactus_1_6_vti_115_at6_feel_pk_2020_102533km_foto_16.webp', 0, 13),
(@car_id, 'uploads/cars/citro_n_c4_cactus_1_6_vti_115_at6_feel_pk_2020_102533km_foto_17.webp', 0, 14);

-- Citroën C4 Lounge 2015
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Citroën', 'C4 Lounge', '1.6 Tendance At6 Thp 163cv Am16', 2015, 14802000, 106564, 'automatico', 'gasolina', '1.6', '163 hp', 4, 4770, 1695, 1510, 2500, 68, 1, 'Conductor y pasajero', 1, 1, 1, 0, 'Asistida', 'Delantera', 1, 1, 1, 'sedan', 'Blanco', 4, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_tendance_at6_thp_163cv_am16_2015_106564km_foto_01.webp', 1, 0),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_tendance_at6_thp_163cv_am16_2015_106564km_foto_04.webp', 0, 1),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_tendance_at6_thp_163cv_am16_2015_106564km_foto_06.webp', 0, 2),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_tendance_at6_thp_163cv_am16_2015_106564km_foto_08.webp', 0, 3),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_tendance_at6_thp_163cv_am16_2015_106564km_foto_09.webp', 0, 4),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_tendance_at6_thp_163cv_am16_2015_106564km_foto_10.webp', 0, 5),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_tendance_at6_thp_163cv_am16_2015_106564km_foto_11.webp', 0, 6),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_tendance_at6_thp_163cv_am16_2015_106564km_foto_12.webp', 0, 7),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_tendance_at6_thp_163cv_am16_2015_106564km_foto_13.webp', 0, 8),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_tendance_at6_thp_163cv_am16_2015_106564km_foto_14.webp', 0, 9),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_tendance_at6_thp_163cv_am16_2015_106564km_foto_15.webp', 0, 10),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_tendance_at6_thp_163cv_am16_2015_106564km_foto_16.webp', 0, 11),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_tendance_at6_thp_163cv_am16_2015_106564km_foto_17.webp', 0, 12),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_tendance_at6_thp_163cv_am16_2015_106564km_foto_18.webp', 0, 13),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_tendance_at6_thp_163cv_am16_2015_106564km_foto_19.webp', 0, 14),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_tendance_at6_thp_163cv_am16_2015_106564km_foto_20.webp', 0, 15);

-- Citroën C4 Lounge 2019
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Citroën', 'C4 Lounge', '1.6 Thp 165 Feel Pack', 2019, 17900000, 136112, 'manual', 'gasolina', '1.6', '165 hp', 4, 4649, 2100, 1510, 2710, 60, 1, 'Conductor y pasajero', 1, 1, 1, 0, 'Asistida', 'Delantera', 1, 1, 1, 'sedan', 'Blanco', 4, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_thp_165_feel_pack_2019_136112km_foto_01.webp', 1, 0),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_thp_165_feel_pack_2019_136112km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_thp_165_feel_pack_2019_136112km_foto_05.webp', 0, 2),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_thp_165_feel_pack_2019_136112km_foto_06.webp', 0, 3),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_thp_165_feel_pack_2019_136112km_foto_07.webp', 0, 4),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_thp_165_feel_pack_2019_136112km_foto_08.webp', 0, 5),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_thp_165_feel_pack_2019_136112km_foto_09.webp', 0, 6),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_thp_165_feel_pack_2019_136112km_foto_10.webp', 0, 7),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_thp_165_feel_pack_2019_136112km_foto_11.webp', 0, 8),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_thp_165_feel_pack_2019_136112km_foto_12.webp', 0, 9),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_thp_165_feel_pack_2019_136112km_foto_13.webp', 0, 10),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_thp_165_feel_pack_2019_136112km_foto_14.webp', 0, 11),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_thp_165_feel_pack_2019_136112km_foto_15.webp', 0, 12),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_thp_165_feel_pack_2019_136112km_foto_16.webp', 0, 13),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_thp_165_feel_pack_2019_136112km_foto_17.webp', 0, 14),
(@car_id, 'uploads/cars/citro_n_c4_lounge_1_6_thp_165_feel_pack_2019_136112km_foto_18.webp', 0, 15);

-- Fiat 500 2012
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Fiat', '500', '1.4 Cult 85cv', 2012, 14994000, 123969, 'manual', 'gasolina', '1.4', '85 hp', 2, 3546, 1800, 1492, 2570, 40, 1, 'Conductor y pasajero', 0, 1, 0, 0, 'Asistida', 'Delantera', 1, 0, 0, 'hatchback', 'Gris', 3, 4, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/fiat_500_1_4_cult_85cv_2012_123969km_foto_01.webp', 1, 0),
(@car_id, 'uploads/cars/fiat_500_1_4_cult_85cv_2012_123969km_foto_05.webp', 0, 1),
(@car_id, 'uploads/cars/fiat_500_1_4_cult_85cv_2012_123969km_foto_06.webp', 0, 2),
(@car_id, 'uploads/cars/fiat_500_1_4_cult_85cv_2012_123969km_foto_08.webp', 0, 3),
(@car_id, 'uploads/cars/fiat_500_1_4_cult_85cv_2012_123969km_foto_09.webp', 0, 4),
(@car_id, 'uploads/cars/fiat_500_1_4_cult_85cv_2012_123969km_foto_10.webp', 0, 5),
(@car_id, 'uploads/cars/fiat_500_1_4_cult_85cv_2012_123969km_foto_11.webp', 0, 6),
(@car_id, 'uploads/cars/fiat_500_1_4_cult_85cv_2012_123969km_foto_12.webp', 0, 7),
(@car_id, 'uploads/cars/fiat_500_1_4_cult_85cv_2012_123969km_foto_13.webp', 0, 8),
(@car_id, 'uploads/cars/fiat_500_1_4_cult_85cv_2012_123969km_foto_14.webp', 0, 9),
(@car_id, 'uploads/cars/fiat_500_1_4_cult_85cv_2012_123969km_foto_16.webp', 0, 10),
(@car_id, 'uploads/cars/fiat_500_1_4_cult_85cv_2012_123969km_foto_17.webp', 0, 11),
(@car_id, 'uploads/cars/fiat_500_1_4_cult_85cv_2012_123969km_foto_18.webp', 0, 12);

-- Fiat 500 2014
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Fiat', '500', '1.4 Sport 105cv', 2014, 15680000, 131239, 'manual', 'gasolina', '1.4', '105 hp', 4, 3546, 1855, 1492, 2640, 40, 1, 'Conductor y pasajero', 1, 1, 0, 0, 'Asistida', 'Delantera', 1, 1, 0, 'hatchback', 'Rojo', 3, 4, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/fiat_500_1_4_sport_105cv_2014_131239km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/fiat_500_1_4_sport_105cv_2014_131239km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/fiat_500_1_4_sport_105cv_2014_131239km_foto_05.webp', 0, 2),
(@car_id, 'uploads/cars/fiat_500_1_4_sport_105cv_2014_131239km_foto_06.webp', 0, 3),
(@car_id, 'uploads/cars/fiat_500_1_4_sport_105cv_2014_131239km_foto_07.webp', 0, 4),
(@car_id, 'uploads/cars/fiat_500_1_4_sport_105cv_2014_131239km_foto_08.webp', 0, 5),
(@car_id, 'uploads/cars/fiat_500_1_4_sport_105cv_2014_131239km_foto_09.webp', 0, 6),
(@car_id, 'uploads/cars/fiat_500_1_4_sport_105cv_2014_131239km_foto_11.webp', 0, 7),
(@car_id, 'uploads/cars/fiat_500_1_4_sport_105cv_2014_131239km_foto_12.webp', 0, 8),
(@car_id, 'uploads/cars/fiat_500_1_4_sport_105cv_2014_131239km_foto_13.webp', 0, 9),
(@car_id, 'uploads/cars/fiat_500_1_4_sport_105cv_2014_131239km_foto_14.webp', 0, 10),
(@car_id, 'uploads/cars/fiat_500_1_4_sport_105cv_2014_131239km_foto_17.webp', 0, 11),
(@car_id, 'uploads/cars/fiat_500_1_4_sport_105cv_2014_131239km_foto_18.webp', 0, 12),
(@car_id, 'uploads/cars/fiat_500_1_4_sport_105cv_2014_131239km_foto_19.webp', 0, 13),
(@car_id, 'uploads/cars/fiat_500_1_4_sport_105cv_2014_131239km_foto_20.webp', 0, 14);

-- Fiat Argo 2019
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Fiat', 'Argo', '1.3 Drive Gse', 2019, 20090000, 48024, 'manual', 'gasolina', '1.3', '99 hp', 2, 3998, 1724, 1500, 2521, 48, 1, 'Conductor y pasajero', 1, 1, 1, 1, 'Eléctrica', 'Delantera', 0, 1, 1, 'hatchback', 'Plateado', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2019_48024km_foto_03.webp', 1, 0),
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2019_48024km_foto_04.webp', 0, 1),
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2019_48024km_foto_07.webp', 0, 2),
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2019_48024km_foto_09.webp', 0, 3),
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2019_48024km_foto_10.webp', 0, 4),
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2019_48024km_foto_11.webp', 0, 5),
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2019_48024km_foto_12.webp', 0, 6),
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2019_48024km_foto_13.webp', 0, 7),
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2019_48024km_foto_14.webp', 0, 8),
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2019_48024km_foto_15.webp', 0, 9),
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2019_48024km_foto_16.webp', 0, 10),
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2019_48024km_foto_17.webp', 0, 11),
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2019_48024km_foto_18.webp', 0, 12);

-- Fiat Argo 2022
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Fiat', 'Argo', '1.3 Drive Gse', 2022, 23520000, 15247, 'automatico', 'gasolina', '1.3', '99 hp', 2, 3998, 1724, 1500, 2521, 48, 1, 'Conductor y pasajero', 1, 1, 1, 1, 'Eléctrica', 'Delantera', 0, 1, 1, 'hatchback', 'Blanco', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2022_15247km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2022_15247km_foto_05.webp', 0, 1),
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2022_15247km_foto_06.webp', 0, 2),
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2022_15247km_foto_08.webp', 0, 3),
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2022_15247km_foto_09.webp', 0, 4),
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2022_15247km_foto_10.webp', 0, 5),
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2022_15247km_foto_11.webp', 0, 6),
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2022_15247km_foto_12.webp', 0, 7),
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2022_15247km_foto_13.webp', 0, 8),
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2022_15247km_foto_14.webp', 0, 9),
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2022_15247km_foto_15.webp', 0, 10),
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2022_15247km_foto_16.webp', 0, 11),
(@car_id, 'uploads/cars/fiat_argo_1_3_drive_gse_2022_15247km_foto_17.webp', 0, 12);

-- Fiat Cronos 2022
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Fiat', 'Cronos', '1.3 Attractive Mt', 2022, 20580000, 81467, 'manual', 'gasolina', '1.3', '99 hp', 2, 4364, 1724, 1508, 2521, 48, 1, 'Conductor y pasajero', 0, 1, 1, 1, 'Eléctrica', 'Delantera', 1, 0, 0, 'sedan', 'Plateado', 4, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/fiat_cronos_1_3_attractive_mt_2022_81467km_foto_03.webp', 1, 0),
(@car_id, 'uploads/cars/fiat_cronos_1_3_attractive_mt_2022_81467km_foto_06.webp', 0, 1),
(@car_id, 'uploads/cars/fiat_cronos_1_3_attractive_mt_2022_81467km_foto_07.webp', 0, 2),
(@car_id, 'uploads/cars/fiat_cronos_1_3_attractive_mt_2022_81467km_foto_09.webp', 0, 3),
(@car_id, 'uploads/cars/fiat_cronos_1_3_attractive_mt_2022_81467km_foto_10.webp', 0, 4),
(@car_id, 'uploads/cars/fiat_cronos_1_3_attractive_mt_2022_81467km_foto_12.webp', 0, 5),
(@car_id, 'uploads/cars/fiat_cronos_1_3_attractive_mt_2022_81467km_foto_13.webp', 0, 6),
(@car_id, 'uploads/cars/fiat_cronos_1_3_attractive_mt_2022_81467km_foto_14.webp', 0, 7),
(@car_id, 'uploads/cars/fiat_cronos_1_3_attractive_mt_2022_81467km_foto_15.webp', 0, 8),
(@car_id, 'uploads/cars/fiat_cronos_1_3_attractive_mt_2022_81467km_foto_16.webp', 0, 9),
(@car_id, 'uploads/cars/fiat_cronos_1_3_attractive_mt_2022_81467km_foto_17.webp', 0, 10),
(@car_id, 'uploads/cars/fiat_cronos_1_3_attractive_mt_2022_81467km_foto_18.webp', 0, 11),
(@car_id, 'uploads/cars/fiat_cronos_1_3_attractive_mt_2022_81467km_foto_19.webp', 0, 12),
(@car_id, 'uploads/cars/fiat_cronos_1_3_attractive_mt_2022_81467km_foto_20.webp', 0, 13),
(@car_id, 'uploads/cars/fiat_cronos_1_3_attractive_mt_2022_81467km_foto_21.webp', 0, 14);

-- Fiat Cronos 2023
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Fiat', 'Cronos', '1.3 Drive Cvt', 2023, 23520000, 71895, 'automatico', 'gasolina', '1.3', '99 hp', 2, 4364, 1724, 1508, 2521, 48, 1, 'Conductor y pasajero', 0, 1, 1, 1, 'Eléctrica', 'Delantera', 1, 0, 0, 'sedan', 'Blanco', 4, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_cvt_2023_71895km_foto_03.webp', 1, 0),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_cvt_2023_71895km_foto_07.webp', 0, 1),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_cvt_2023_71895km_foto_08.webp', 0, 2),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_cvt_2023_71895km_foto_10.webp', 0, 3),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_cvt_2023_71895km_foto_11.webp', 0, 4),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_cvt_2023_71895km_foto_12.webp', 0, 5),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_cvt_2023_71895km_foto_13.webp', 0, 6),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_cvt_2023_71895km_foto_14.webp', 0, 7),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_cvt_2023_71895km_foto_15.webp', 0, 8),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_cvt_2023_71895km_foto_16.webp', 0, 9),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_cvt_2023_71895km_foto_17.webp', 0, 10),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_cvt_2023_71895km_foto_18.webp', 0, 11),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_cvt_2023_71895km_foto_19.webp', 0, 12),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_cvt_2023_71895km_foto_20.webp', 0, 13),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_cvt_2023_71895km_foto_21.webp', 0, 14),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_cvt_2023_71895km_foto_22.webp', 0, 15);

-- Fiat Cronos 2022
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Fiat', 'Cronos', '1.3 Drive Mt', 2022, 22540000, 75927, 'manual', 'gasolina', '1.3', '99 hp', 2, 4364, 1724, 1508, 2521, 48, 1, 'Conductor y pasajero', 0, 1, 1, 1, 'Eléctrica', 'Delantera', 1, 0, 0, 'sedan', 'Blanco', 4, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_mt_2022_75927km_foto_04.webp', 1, 0),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_mt_2022_75927km_foto_06.webp', 0, 1),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_mt_2022_75927km_foto_07.webp', 0, 2),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_mt_2022_75927km_foto_09.webp', 0, 3),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_mt_2022_75927km_foto_11.webp', 0, 4),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_mt_2022_75927km_foto_12.webp', 0, 5),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_mt_2022_75927km_foto_13.webp', 0, 6),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_mt_2022_75927km_foto_14.webp', 0, 7),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_mt_2022_75927km_foto_15.webp', 0, 8),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_mt_2022_75927km_foto_16.webp', 0, 9),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_mt_2022_75927km_foto_17.webp', 0, 10),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_mt_2022_75927km_foto_18.webp', 0, 11),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_mt_2022_75927km_foto_19.webp', 0, 12),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_mt_2022_75927km_foto_20.webp', 0, 13),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_mt_2022_75927km_foto_21.webp', 0, 14),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_mt_2022_75927km_foto_22.webp', 0, 15),
(@car_id, 'uploads/cars/fiat_cronos_1_3_drive_mt_2022_75927km_foto_23.webp', 0, 16);

-- Fiat Cronos 2020
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Fiat', 'Cronos', '1.3 Gse Drive', 2020, 21070000, 45273, 'manual', 'gasolina', '1.3', '99 hp', 2, 4364, 1724, 1508, 2521, 48, 1, 'Conductor y pasajero', 0, 1, 1, 1, 'Eléctrica', 'Delantera', 1, 0, 0, 'sedan', 'Gris', 4, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2020_45273km_foto_03.webp', 1, 0),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2020_45273km_foto_04.webp', 0, 1),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2020_45273km_foto_07.webp', 0, 2),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2020_45273km_foto_08.webp', 0, 3),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2020_45273km_foto_09.webp', 0, 4),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2020_45273km_foto_10.webp', 0, 5),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2020_45273km_foto_11.webp', 0, 6),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2020_45273km_foto_12.webp', 0, 7),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2020_45273km_foto_13.webp', 0, 8),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2020_45273km_foto_14.webp', 0, 9),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2020_45273km_foto_15.webp', 0, 10),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2020_45273km_foto_16.webp', 0, 11),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2020_45273km_foto_17.webp', 0, 12),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2020_45273km_foto_18.webp', 0, 13),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2020_45273km_foto_19.webp', 0, 14),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2020_45273km_foto_20.webp', 0, 15);

-- Fiat Cronos 2021
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Fiat', 'Cronos', '1.3 Gse Drive', 2021, 21560000, 43127, 'manual', 'gasolina', '1.3', '99 hp', 2, 4364, 1724, 1508, 2521, 48, 1, 'Conductor y pasajero', 0, 1, 1, 1, 'Eléctrica', 'Delantera', 1, 0, 0, 'sedan', 'Rojo', 4, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_43127km_foto_03.webp', 1, 0),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_43127km_foto_05.webp', 0, 1),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_43127km_foto_06.webp', 0, 2),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_43127km_foto_07.webp', 0, 3),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_43127km_foto_08.webp', 0, 4),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_43127km_foto_09.webp', 0, 5),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_43127km_foto_10.webp', 0, 6),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_43127km_foto_11.webp', 0, 7),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_43127km_foto_12.webp', 0, 8),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_43127km_foto_13.webp', 0, 9),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_43127km_foto_14.webp', 0, 10),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_43127km_foto_15.webp', 0, 11),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_43127km_foto_16.webp', 0, 12),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_43127km_foto_17.webp', 0, 13);

-- Fiat Cronos 2021
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Fiat', 'Cronos', '1.3 Gse Drive', 2021, 21267000, 72627, 'manual', 'gasolina', '1.3', '99 hp', 2, 4364, 1724, 1508, 2521, 48, 1, 'Conductor y pasajero', 0, 1, 1, 1, 'Eléctrica', 'Delantera', 1, 0, 0, 'sedan', 'Gris', 4, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_72627km_foto_01.webp', 1, 0),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_72627km_foto_05.webp', 0, 1),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_72627km_foto_07.webp', 0, 2),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_72627km_foto_08.webp', 0, 3),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_72627km_foto_10.webp', 0, 4),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_72627km_foto_11.webp', 0, 5),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_72627km_foto_13.webp', 0, 6),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_72627km_foto_15.webp', 0, 7),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_72627km_foto_16.webp', 0, 8),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_72627km_foto_17.webp', 0, 9),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_72627km_foto_18.webp', 0, 10),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_72627km_foto_19.webp', 0, 11),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_72627km_foto_20.webp', 0, 12),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_72627km_foto_21.webp', 0, 13),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_72627km_foto_22.webp', 0, 14),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2021_72627km_foto_24.webp', 0, 15);

-- Fiat Cronos 2023
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Fiat', 'Cronos', '1.3 Gse Drive', 2023, 24010000, 16687, 'manual', 'gasolina', '1.3', '99 hp', 2, 4364, 1724, 1508, 2521, 48, 1, 'Conductor y pasajero', 0, 1, 1, 1, 'Eléctrica', 'Delantera', 1, 0, 0, 'sedan', 'Gris', 4, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_16687km_foto_03.webp', 1, 0),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_16687km_foto_04.webp', 0, 1),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_16687km_foto_07.webp', 0, 2),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_16687km_foto_08.webp', 0, 3),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_16687km_foto_09.webp', 0, 4),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_16687km_foto_10.webp', 0, 5),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_16687km_foto_11.webp', 0, 6),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_16687km_foto_12.webp', 0, 7),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_16687km_foto_13.webp', 0, 8),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_16687km_foto_14.webp', 0, 9),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_16687km_foto_15.webp', 0, 10),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_16687km_foto_16.webp', 0, 11),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_16687km_foto_17.webp', 0, 12),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_16687km_foto_18.webp', 0, 13),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_16687km_foto_19.webp', 0, 14),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_16687km_foto_20.webp', 0, 15);

-- Fiat Cronos 2023
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Fiat', 'Cronos', '1.3 Gse Drive', 2023, 23324000, 27476, 'manual', 'gasolina', '1.3', '99 hp', 2, 4364, 1724, 1508, 2521, 48, 1, 'Conductor y pasajero', 0, 1, 1, 1, 'Eléctrica', 'Delantera', 1, 0, 0, 'sedan', 'Negro', 4, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_27476km_foto_03.webp', 1, 0),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_27476km_foto_04.webp', 0, 1),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_27476km_foto_05.webp', 0, 2),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_27476km_foto_09.webp', 0, 3),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_27476km_foto_10.webp', 0, 4),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_27476km_foto_11.webp', 0, 5),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_27476km_foto_12.webp', 0, 6),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_27476km_foto_13.webp', 0, 7),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_27476km_foto_14.webp', 0, 8),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_27476km_foto_15.webp', 0, 9),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_27476km_foto_16.webp', 0, 10),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_27476km_foto_17.webp', 0, 11),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_27476km_foto_18.webp', 0, 12),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_27476km_foto_19.webp', 0, 13),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_27476km_foto_20.webp', 0, 14),
(@car_id, 'uploads/cars/fiat_cronos_1_3_gse_drive_2023_27476km_foto_21.webp', 0, 15);

-- Fiat Cronos 2023
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Fiat', 'Cronos', '1.3 Stile Mt', 2023, 23442000, 94758, 'manual', 'gasolina', '1.3', '99 hp', 2, 4364, 1724, 1508, 2521, 48, 1, 'Conductor y pasajero', 0, 1, 1, 1, 'Eléctrica', 'Delantera', 1, 0, 0, 'sedan', 'Gris', 4, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/fiat_cronos_1_3_stile_mt_2023_94758km_foto_03.webp', 1, 0),
(@car_id, 'uploads/cars/fiat_cronos_1_3_stile_mt_2023_94758km_foto_05.webp', 0, 1),
(@car_id, 'uploads/cars/fiat_cronos_1_3_stile_mt_2023_94758km_foto_07.webp', 0, 2),
(@car_id, 'uploads/cars/fiat_cronos_1_3_stile_mt_2023_94758km_foto_09.webp', 0, 3),
(@car_id, 'uploads/cars/fiat_cronos_1_3_stile_mt_2023_94758km_foto_10.webp', 0, 4),
(@car_id, 'uploads/cars/fiat_cronos_1_3_stile_mt_2023_94758km_foto_11.webp', 0, 5),
(@car_id, 'uploads/cars/fiat_cronos_1_3_stile_mt_2023_94758km_foto_12.webp', 0, 6),
(@car_id, 'uploads/cars/fiat_cronos_1_3_stile_mt_2023_94758km_foto_13.webp', 0, 7),
(@car_id, 'uploads/cars/fiat_cronos_1_3_stile_mt_2023_94758km_foto_14.webp', 0, 8),
(@car_id, 'uploads/cars/fiat_cronos_1_3_stile_mt_2023_94758km_foto_15.webp', 0, 9),
(@car_id, 'uploads/cars/fiat_cronos_1_3_stile_mt_2023_94758km_foto_16.webp', 0, 10),
(@car_id, 'uploads/cars/fiat_cronos_1_3_stile_mt_2023_94758km_foto_17.webp', 0, 11),
(@car_id, 'uploads/cars/fiat_cronos_1_3_stile_mt_2023_94758km_foto_18.webp', 0, 12),
(@car_id, 'uploads/cars/fiat_cronos_1_3_stile_mt_2023_94758km_foto_19.webp', 0, 13),
(@car_id, 'uploads/cars/fiat_cronos_1_3_stile_mt_2023_94758km_foto_20.webp', 0, 14),
(@car_id, 'uploads/cars/fiat_cronos_1_3_stile_mt_2023_94758km_foto_21.webp', 0, 15);

-- Fiat Cronos 2021
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Fiat', 'Cronos', '1.8 16v Precision', 2021, 20580000, 84092, 'manual', 'gasolina', '1.8', '130 hp', 4, 4364, 1724, 1516, 2521, 48, 1, 'Conductor y pasajero', 0, 1, 1, 1, 'Eléctrica', 'Delantera', 1, 0, 0, 'sedan', 'Negro', 4, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/fiat_cronos_1_8_16v_precision_2021_84092km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/fiat_cronos_1_8_16v_precision_2021_84092km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/fiat_cronos_1_8_16v_precision_2021_84092km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/fiat_cronos_1_8_16v_precision_2021_84092km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/fiat_cronos_1_8_16v_precision_2021_84092km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/fiat_cronos_1_8_16v_precision_2021_84092km_foto_07.webp', 0, 5),
(@car_id, 'uploads/cars/fiat_cronos_1_8_16v_precision_2021_84092km_foto_08.webp', 0, 6),
(@car_id, 'uploads/cars/fiat_cronos_1_8_16v_precision_2021_84092km_foto_09.webp', 0, 7),
(@car_id, 'uploads/cars/fiat_cronos_1_8_16v_precision_2021_84092km_foto_10.webp', 0, 8),
(@car_id, 'uploads/cars/fiat_cronos_1_8_16v_precision_2021_84092km_foto_11.webp', 0, 9),
(@car_id, 'uploads/cars/fiat_cronos_1_8_16v_precision_2021_84092km_foto_12.webp', 0, 10),
(@car_id, 'uploads/cars/fiat_cronos_1_8_16v_precision_2021_84092km_foto_13.webp', 0, 11),
(@car_id, 'uploads/cars/fiat_cronos_1_8_16v_precision_2021_84092km_foto_14.webp', 0, 12),
(@car_id, 'uploads/cars/fiat_cronos_1_8_16v_precision_2021_84092km_foto_15.webp', 0, 13),
(@car_id, 'uploads/cars/fiat_cronos_1_8_16v_precision_2021_84092km_foto_16.webp', 0, 14),
(@car_id, 'uploads/cars/fiat_cronos_1_8_16v_precision_2021_84092km_foto_17.webp', 0, 15),
(@car_id, 'uploads/cars/fiat_cronos_1_8_16v_precision_2021_84092km_foto_18.webp', 0, 16),
(@car_id, 'uploads/cars/fiat_cronos_1_8_16v_precision_2021_84092km_foto_19.webp', 0, 17),
(@car_id, 'uploads/cars/fiat_cronos_1_8_16v_precision_2021_84092km_foto_20.webp', 0, 18);

-- Fiat Mobi 2018
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Fiat', 'Mobi', '1.0 Easy', 2018, 15000000, 116274, 'manual', 'gasolina', '1.0', '70 hp', 2, 3566, 1854, 1502, 2874, 47, 1, 'Conductor y pasajero', 0, 0, 0, 0, '', 'Delantera', 0, 0, 0, 'hatchback', 'Plateado', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/fiat_mobi_1_0_easy_2018_116274km_foto_01.webp', 1, 0),
(@car_id, 'uploads/cars/fiat_mobi_1_0_easy_2018_116274km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/fiat_mobi_1_0_easy_2018_116274km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/fiat_mobi_1_0_easy_2018_116274km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/fiat_mobi_1_0_easy_2018_116274km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/fiat_mobi_1_0_easy_2018_116274km_foto_07.webp', 0, 5),
(@car_id, 'uploads/cars/fiat_mobi_1_0_easy_2018_116274km_foto_08.webp', 0, 6),
(@car_id, 'uploads/cars/fiat_mobi_1_0_easy_2018_116274km_foto_09.webp', 0, 7),
(@car_id, 'uploads/cars/fiat_mobi_1_0_easy_2018_116274km_foto_10.webp', 0, 8),
(@car_id, 'uploads/cars/fiat_mobi_1_0_easy_2018_116274km_foto_11.webp', 0, 9),
(@car_id, 'uploads/cars/fiat_mobi_1_0_easy_2018_116274km_foto_12.webp', 0, 10),
(@car_id, 'uploads/cars/fiat_mobi_1_0_easy_2018_116274km_foto_13.webp', 0, 11),
(@car_id, 'uploads/cars/fiat_mobi_1_0_easy_2018_116274km_foto_14.webp', 0, 12),
(@car_id, 'uploads/cars/fiat_mobi_1_0_easy_2018_116274km_foto_15.webp', 0, 13),
(@car_id, 'uploads/cars/fiat_mobi_1_0_easy_2018_116274km_foto_16.webp', 0, 14),
(@car_id, 'uploads/cars/fiat_mobi_1_0_easy_2018_116274km_foto_17.webp', 0, 15),
(@car_id, 'uploads/cars/fiat_mobi_1_0_easy_2018_116274km_foto_18.webp', 0, 16),
(@car_id, 'uploads/cars/fiat_mobi_1_0_easy_2018_116274km_foto_19.webp', 0, 17),
(@car_id, 'uploads/cars/fiat_mobi_1_0_easy_2018_116274km_foto_20.webp', 0, 18),
(@car_id, 'uploads/cars/fiat_mobi_1_0_easy_2018_116274km_foto_21.webp', 0, 19);

-- Fiat Palio 2016
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Fiat', 'Palio', '1.4 Attractive 85cv', 2016, 14210000, 101558, 'manual', 'gasolina', '1.4', '85 hp', 2, 3875, 1922, 1504, 4025, 48, 1, 'Conductor y pasajero', 0, 1, 0, 0, 'Hidráulica', 'Delantera', 1, 1, 0, 'hatchback', 'Rojo', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/fiat_palio_1_4_attractive_85cv_2016_101558km_foto_03.webp', 1, 0),
(@car_id, 'uploads/cars/fiat_palio_1_4_attractive_85cv_2016_101558km_foto_04.webp', 0, 1),
(@car_id, 'uploads/cars/fiat_palio_1_4_attractive_85cv_2016_101558km_foto_06.webp', 0, 2),
(@car_id, 'uploads/cars/fiat_palio_1_4_attractive_85cv_2016_101558km_foto_07.webp', 0, 3),
(@car_id, 'uploads/cars/fiat_palio_1_4_attractive_85cv_2016_101558km_foto_09.webp', 0, 4),
(@car_id, 'uploads/cars/fiat_palio_1_4_attractive_85cv_2016_101558km_foto_10.webp', 0, 5),
(@car_id, 'uploads/cars/fiat_palio_1_4_attractive_85cv_2016_101558km_foto_11.webp', 0, 6),
(@car_id, 'uploads/cars/fiat_palio_1_4_attractive_85cv_2016_101558km_foto_12.webp', 0, 7),
(@car_id, 'uploads/cars/fiat_palio_1_4_attractive_85cv_2016_101558km_foto_13.webp', 0, 8),
(@car_id, 'uploads/cars/fiat_palio_1_4_attractive_85cv_2016_101558km_foto_14.webp', 0, 9),
(@car_id, 'uploads/cars/fiat_palio_1_4_attractive_85cv_2016_101558km_foto_15.webp', 0, 10),
(@car_id, 'uploads/cars/fiat_palio_1_4_attractive_85cv_2016_101558km_foto_16.webp', 0, 11),
(@car_id, 'uploads/cars/fiat_palio_1_4_attractive_85cv_2016_101558km_foto_17.webp', 0, 12),
(@car_id, 'uploads/cars/fiat_palio_1_4_attractive_85cv_2016_101558km_foto_18.webp', 0, 13),
(@car_id, 'uploads/cars/fiat_palio_1_4_attractive_85cv_2016_101558km_foto_19.webp', 0, 14),
(@car_id, 'uploads/cars/fiat_palio_1_4_attractive_85cv_2016_101558km_foto_20.webp', 0, 15),
(@car_id, 'uploads/cars/fiat_palio_1_4_attractive_85cv_2016_101558km_foto_21.webp', 0, 16),
(@car_id, 'uploads/cars/fiat_palio_1_4_attractive_85cv_2016_101558km_foto_22.webp', 0, 17);

-- Fiat Palio 2017
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Fiat', 'Palio', '1.4 Nuevo Attractive 85cv', 2017, 14602000, 138566, 'manual', 'gasolina', '1.4', '85 hp', 2, 3875, 1993, 1504, 3665, 48, 1, 'Conductor y pasajero', 0, 1, 0, 0, 'Hidráulica', 'Delantera', 1, 1, 0, 'hatchback', 'Blanco', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/fiat_palio_1_4_nuevo_attractive_85cv_2017_138566km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/fiat_palio_1_4_nuevo_attractive_85cv_2017_138566km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/fiat_palio_1_4_nuevo_attractive_85cv_2017_138566km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/fiat_palio_1_4_nuevo_attractive_85cv_2017_138566km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/fiat_palio_1_4_nuevo_attractive_85cv_2017_138566km_foto_07.webp', 0, 4),
(@car_id, 'uploads/cars/fiat_palio_1_4_nuevo_attractive_85cv_2017_138566km_foto_08.webp', 0, 5),
(@car_id, 'uploads/cars/fiat_palio_1_4_nuevo_attractive_85cv_2017_138566km_foto_09.webp', 0, 6),
(@car_id, 'uploads/cars/fiat_palio_1_4_nuevo_attractive_85cv_2017_138566km_foto_10.webp', 0, 7),
(@car_id, 'uploads/cars/fiat_palio_1_4_nuevo_attractive_85cv_2017_138566km_foto_11.webp', 0, 8),
(@car_id, 'uploads/cars/fiat_palio_1_4_nuevo_attractive_85cv_2017_138566km_foto_12.webp', 0, 9),
(@car_id, 'uploads/cars/fiat_palio_1_4_nuevo_attractive_85cv_2017_138566km_foto_13.webp', 0, 10),
(@car_id, 'uploads/cars/fiat_palio_1_4_nuevo_attractive_85cv_2017_138566km_foto_14.webp', 0, 11),
(@car_id, 'uploads/cars/fiat_palio_1_4_nuevo_attractive_85cv_2017_138566km_foto_15.webp', 0, 12),
(@car_id, 'uploads/cars/fiat_palio_1_4_nuevo_attractive_85cv_2017_138566km_foto_16.webp', 0, 13),
(@car_id, 'uploads/cars/fiat_palio_1_4_nuevo_attractive_85cv_2017_138566km_foto_17.webp', 0, 14),
(@car_id, 'uploads/cars/fiat_palio_1_4_nuevo_attractive_85cv_2017_138566km_foto_18.webp', 0, 15),
(@car_id, 'uploads/cars/fiat_palio_1_4_nuevo_attractive_85cv_2017_138566km_foto_19.webp', 0, 16),
(@car_id, 'uploads/cars/fiat_palio_1_4_nuevo_attractive_85cv_2017_138566km_foto_20.webp', 0, 17);

-- Fiat Palio 2015
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Fiat', 'Palio', '1.6 Essence 115cv', 2015, 14700000, 71281, 'manual', 'gasolina', '1.6', '115 hp', 4, 3875, 1993, 1513, 3250, 48, 1, 'Conductor y pasajero', 1, 1, 1, 1, 'Hidráulica', 'Delantera', 1, 0, 0, 'hatchback', 'Gris', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/fiat_palio_1_6_essence_115cv_2015_71281km_foto_04.webp', 1, 0),
(@car_id, 'uploads/cars/fiat_palio_1_6_essence_115cv_2015_71281km_foto_05.webp', 0, 1),
(@car_id, 'uploads/cars/fiat_palio_1_6_essence_115cv_2015_71281km_foto_07.webp', 0, 2),
(@car_id, 'uploads/cars/fiat_palio_1_6_essence_115cv_2015_71281km_foto_09.webp', 0, 3),
(@car_id, 'uploads/cars/fiat_palio_1_6_essence_115cv_2015_71281km_foto_11.webp', 0, 4),
(@car_id, 'uploads/cars/fiat_palio_1_6_essence_115cv_2015_71281km_foto_13.webp', 0, 5),
(@car_id, 'uploads/cars/fiat_palio_1_6_essence_115cv_2015_71281km_foto_14.webp', 0, 6),
(@car_id, 'uploads/cars/fiat_palio_1_6_essence_115cv_2015_71281km_foto_15.webp', 0, 7),
(@car_id, 'uploads/cars/fiat_palio_1_6_essence_115cv_2015_71281km_foto_16.webp', 0, 8),
(@car_id, 'uploads/cars/fiat_palio_1_6_essence_115cv_2015_71281km_foto_17.webp', 0, 9),
(@car_id, 'uploads/cars/fiat_palio_1_6_essence_115cv_2015_71281km_foto_18.webp', 0, 10),
(@car_id, 'uploads/cars/fiat_palio_1_6_essence_115cv_2015_71281km_foto_19.webp', 0, 11),
(@car_id, 'uploads/cars/fiat_palio_1_6_essence_115cv_2015_71281km_foto_20.webp', 0, 12),
(@car_id, 'uploads/cars/fiat_palio_1_6_essence_115cv_2015_71281km_foto_21.webp', 0, 13),
(@car_id, 'uploads/cars/fiat_palio_1_6_essence_115cv_2015_71281km_foto_22.webp', 0, 14),
(@car_id, 'uploads/cars/fiat_palio_1_6_essence_115cv_2015_71281km_foto_23.webp', 0, 15),
(@car_id, 'uploads/cars/fiat_palio_1_6_essence_115cv_2015_71281km_foto_24.webp', 0, 16);

-- Fiat Pulse 2025
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Fiat', 'Pulse', '1.3 Gse Abarth Turbo 270 At', 2025, 40694000, 1000, 'automatico', 'gasolina', '1.3', '175 hp', 4, 0, 0, 0, 0, 47, 0, 'No', 0, 0, 0, 0, '', 'Delantera', 0, 0, 0, 'suv', 'Rojo', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/fiat_pulse_1_3_gse_abarth_turbo_270_at_2025_1000km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/fiat_pulse_1_3_gse_abarth_turbo_270_at_2025_1000km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/fiat_pulse_1_3_gse_abarth_turbo_270_at_2025_1000km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/fiat_pulse_1_3_gse_abarth_turbo_270_at_2025_1000km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/fiat_pulse_1_3_gse_abarth_turbo_270_at_2025_1000km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/fiat_pulse_1_3_gse_abarth_turbo_270_at_2025_1000km_foto_07.webp', 0, 5),
(@car_id, 'uploads/cars/fiat_pulse_1_3_gse_abarth_turbo_270_at_2025_1000km_foto_08.webp', 0, 6),
(@car_id, 'uploads/cars/fiat_pulse_1_3_gse_abarth_turbo_270_at_2025_1000km_foto_09.webp', 0, 7),
(@car_id, 'uploads/cars/fiat_pulse_1_3_gse_abarth_turbo_270_at_2025_1000km_foto_10.webp', 0, 8),
(@car_id, 'uploads/cars/fiat_pulse_1_3_gse_abarth_turbo_270_at_2025_1000km_foto_11.webp', 0, 9),
(@car_id, 'uploads/cars/fiat_pulse_1_3_gse_abarth_turbo_270_at_2025_1000km_foto_12.webp', 0, 10),
(@car_id, 'uploads/cars/fiat_pulse_1_3_gse_abarth_turbo_270_at_2025_1000km_foto_13.webp', 0, 11),
(@car_id, 'uploads/cars/fiat_pulse_1_3_gse_abarth_turbo_270_at_2025_1000km_foto_14.webp', 0, 12),
(@car_id, 'uploads/cars/fiat_pulse_1_3_gse_abarth_turbo_270_at_2025_1000km_foto_15.webp', 0, 13),
(@car_id, 'uploads/cars/fiat_pulse_1_3_gse_abarth_turbo_270_at_2025_1000km_foto_16.webp', 0, 14),
(@car_id, 'uploads/cars/fiat_pulse_1_3_gse_abarth_turbo_270_at_2025_1000km_foto_17.webp', 0, 15);

-- Fiat Siena 2015
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Fiat', 'Siena', '1.4 El My 2015', 2015, 14700000, 149399, 'manual', 'gasolina', '1.4', '82 hp', 2, 4155, 1826, 1437, 2959, 48, 0, 'Conductor y pasajero', 0, 1, 1, 1, 'Hidráulica', 'Delantera', 1, 0, 0, 'sedan', 'Plateado', 4, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/fiat_siena_1_4_el_my_2015_2015_149399km_foto_03.webp', 1, 0),
(@car_id, 'uploads/cars/fiat_siena_1_4_el_my_2015_2015_149399km_foto_05.webp', 0, 1),
(@car_id, 'uploads/cars/fiat_siena_1_4_el_my_2015_2015_149399km_foto_06.webp', 0, 2),
(@car_id, 'uploads/cars/fiat_siena_1_4_el_my_2015_2015_149399km_foto_07.webp', 0, 3),
(@car_id, 'uploads/cars/fiat_siena_1_4_el_my_2015_2015_149399km_foto_08.webp', 0, 4),
(@car_id, 'uploads/cars/fiat_siena_1_4_el_my_2015_2015_149399km_foto_09.webp', 0, 5),
(@car_id, 'uploads/cars/fiat_siena_1_4_el_my_2015_2015_149399km_foto_10.webp', 0, 6),
(@car_id, 'uploads/cars/fiat_siena_1_4_el_my_2015_2015_149399km_foto_11.webp', 0, 7),
(@car_id, 'uploads/cars/fiat_siena_1_4_el_my_2015_2015_149399km_foto_12.webp', 0, 8),
(@car_id, 'uploads/cars/fiat_siena_1_4_el_my_2015_2015_149399km_foto_13.webp', 0, 9),
(@car_id, 'uploads/cars/fiat_siena_1_4_el_my_2015_2015_149399km_foto_14.webp', 0, 10),
(@car_id, 'uploads/cars/fiat_siena_1_4_el_my_2015_2015_149399km_foto_15.webp', 0, 11),
(@car_id, 'uploads/cars/fiat_siena_1_4_el_my_2015_2015_149399km_foto_16.webp', 0, 12),
(@car_id, 'uploads/cars/fiat_siena_1_4_el_my_2015_2015_149399km_foto_17.webp', 0, 13),
(@car_id, 'uploads/cars/fiat_siena_1_4_el_my_2015_2015_149399km_foto_18.webp', 0, 14),
(@car_id, 'uploads/cars/fiat_siena_1_4_el_my_2015_2015_149399km_foto_19.webp', 0, 15);

-- Fiat Siena 2012
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Fiat', 'Siena', '1.4 Fire Da', 2012, 12250000, 162838, 'manual', 'gasolina', '1.4', '82 hp', 2, 4135, 1850, 1453, 3150, 48, 0, 'No', 0, 0, 1, 1, 'Hidráulica', 'Delantera', 0, 0, 0, 'sedan', 'Blanco', 4, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/fiat_siena_1_4_fire_da_2012_162838km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/fiat_siena_1_4_fire_da_2012_162838km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/fiat_siena_1_4_fire_da_2012_162838km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/fiat_siena_1_4_fire_da_2012_162838km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/fiat_siena_1_4_fire_da_2012_162838km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/fiat_siena_1_4_fire_da_2012_162838km_foto_07.webp', 0, 5),
(@car_id, 'uploads/cars/fiat_siena_1_4_fire_da_2012_162838km_foto_08.webp', 0, 6),
(@car_id, 'uploads/cars/fiat_siena_1_4_fire_da_2012_162838km_foto_09.webp', 0, 7),
(@car_id, 'uploads/cars/fiat_siena_1_4_fire_da_2012_162838km_foto_10.webp', 0, 8),
(@car_id, 'uploads/cars/fiat_siena_1_4_fire_da_2012_162838km_foto_11.webp', 0, 9),
(@car_id, 'uploads/cars/fiat_siena_1_4_fire_da_2012_162838km_foto_12.webp', 0, 10),
(@car_id, 'uploads/cars/fiat_siena_1_4_fire_da_2012_162838km_foto_13.webp', 0, 11),
(@car_id, 'uploads/cars/fiat_siena_1_4_fire_da_2012_162838km_foto_14.webp', 0, 12),
(@car_id, 'uploads/cars/fiat_siena_1_4_fire_da_2012_162838km_foto_15.webp', 0, 13),
(@car_id, 'uploads/cars/fiat_siena_1_4_fire_da_2012_162838km_foto_16.webp', 0, 14),
(@car_id, 'uploads/cars/fiat_siena_1_4_fire_da_2012_162838km_foto_17.webp', 0, 15),
(@car_id, 'uploads/cars/fiat_siena_1_4_fire_da_2012_162838km_foto_18.webp', 0, 16);

-- Fiat Strada 2021
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Fiat', 'Strada', '1.3 Volcano', 2021, 27930000, 87079, 'manual', 'gasolina', '1.3', '99 hp', 2, 4480, 1950, 1554, 2737, 55, 1, 'Conductor y pasajero', 0, 1, 1, 0, 'Hidráulica', 'Delantera', 1, 0, 1, 'sedan', 'Blanco', 3, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/fiat_strada_1_3_volcano_2021_87079km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/fiat_strada_1_3_volcano_2021_87079km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/fiat_strada_1_3_volcano_2021_87079km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/fiat_strada_1_3_volcano_2021_87079km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/fiat_strada_1_3_volcano_2021_87079km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/fiat_strada_1_3_volcano_2021_87079km_foto_07.webp', 0, 5),
(@car_id, 'uploads/cars/fiat_strada_1_3_volcano_2021_87079km_foto_08.webp', 0, 6),
(@car_id, 'uploads/cars/fiat_strada_1_3_volcano_2021_87079km_foto_09.webp', 0, 7),
(@car_id, 'uploads/cars/fiat_strada_1_3_volcano_2021_87079km_foto_10.webp', 0, 8),
(@car_id, 'uploads/cars/fiat_strada_1_3_volcano_2021_87079km_foto_11.webp', 0, 9),
(@car_id, 'uploads/cars/fiat_strada_1_3_volcano_2021_87079km_foto_12.webp', 0, 10),
(@car_id, 'uploads/cars/fiat_strada_1_3_volcano_2021_87079km_foto_13.webp', 0, 11),
(@car_id, 'uploads/cars/fiat_strada_1_3_volcano_2021_87079km_foto_14.webp', 0, 12),
(@car_id, 'uploads/cars/fiat_strada_1_3_volcano_2021_87079km_foto_15.webp', 0, 13),
(@car_id, 'uploads/cars/fiat_strada_1_3_volcano_2021_87079km_foto_16.webp', 0, 14);

-- Fiat Toro 2021
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Fiat', 'Toro', '1.8 Freedom 4X2 At', 2021, 32340000, 33781, 'automatico', 'gasolina', '1.8', '130 hp', 4, 4915, 1669, 1690, 2990, 60, 1, 'Conductor y pasajero', 0, 0, 0, 0, '', '4x2', 0, 0, 0, 'sedan', 'Gris', 4, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/fiat_toro_1_8_freedom_4x2_at_2021_33781km_foto_03.webp', 1, 0),
(@car_id, 'uploads/cars/fiat_toro_1_8_freedom_4x2_at_2021_33781km_foto_04.webp', 0, 1),
(@car_id, 'uploads/cars/fiat_toro_1_8_freedom_4x2_at_2021_33781km_foto_06.webp', 0, 2),
(@car_id, 'uploads/cars/fiat_toro_1_8_freedom_4x2_at_2021_33781km_foto_07.webp', 0, 3),
(@car_id, 'uploads/cars/fiat_toro_1_8_freedom_4x2_at_2021_33781km_foto_08.webp', 0, 4),
(@car_id, 'uploads/cars/fiat_toro_1_8_freedom_4x2_at_2021_33781km_foto_09.webp', 0, 5),
(@car_id, 'uploads/cars/fiat_toro_1_8_freedom_4x2_at_2021_33781km_foto_10.webp', 0, 6),
(@car_id, 'uploads/cars/fiat_toro_1_8_freedom_4x2_at_2021_33781km_foto_11.webp', 0, 7),
(@car_id, 'uploads/cars/fiat_toro_1_8_freedom_4x2_at_2021_33781km_foto_12.webp', 0, 8),
(@car_id, 'uploads/cars/fiat_toro_1_8_freedom_4x2_at_2021_33781km_foto_13.webp', 0, 9),
(@car_id, 'uploads/cars/fiat_toro_1_8_freedom_4x2_at_2021_33781km_foto_14.webp', 0, 10),
(@car_id, 'uploads/cars/fiat_toro_1_8_freedom_4x2_at_2021_33781km_foto_15.webp', 0, 11),
(@car_id, 'uploads/cars/fiat_toro_1_8_freedom_4x2_at_2021_33781km_foto_16.webp', 0, 12),
(@car_id, 'uploads/cars/fiat_toro_1_8_freedom_4x2_at_2021_33781km_foto_17.webp', 0, 13),
(@car_id, 'uploads/cars/fiat_toro_1_8_freedom_4x2_at_2021_33781km_foto_18.webp', 0, 14),
(@car_id, 'uploads/cars/fiat_toro_1_8_freedom_4x2_at_2021_33781km_foto_19.webp', 0, 15);

-- Fiat Toro 2022
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Fiat', 'Toro', '2.0 Freedom 4x4 At', 2022, 33320000, 96453, 'automatico', 'gasolina', '2.0', '170 hp', 4, 4915, 1669, 1690, 2443, 60, 1, 'Conductor y pasajero', 0, 0, 0, 0, '', '4x4', 0, 0, 0, 'sedan', 'Plateado', 4, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/fiat_toro_2_0_freedom_4x4_at_2022_96453km_foto_03.webp', 1, 0),
(@car_id, 'uploads/cars/fiat_toro_2_0_freedom_4x4_at_2022_96453km_foto_05.webp', 0, 1),
(@car_id, 'uploads/cars/fiat_toro_2_0_freedom_4x4_at_2022_96453km_foto_06.webp', 0, 2),
(@car_id, 'uploads/cars/fiat_toro_2_0_freedom_4x4_at_2022_96453km_foto_09.webp', 0, 3),
(@car_id, 'uploads/cars/fiat_toro_2_0_freedom_4x4_at_2022_96453km_foto_10.webp', 0, 4),
(@car_id, 'uploads/cars/fiat_toro_2_0_freedom_4x4_at_2022_96453km_foto_11.webp', 0, 5),
(@car_id, 'uploads/cars/fiat_toro_2_0_freedom_4x4_at_2022_96453km_foto_12.webp', 0, 6),
(@car_id, 'uploads/cars/fiat_toro_2_0_freedom_4x4_at_2022_96453km_foto_13.webp', 0, 7),
(@car_id, 'uploads/cars/fiat_toro_2_0_freedom_4x4_at_2022_96453km_foto_14.webp', 0, 8),
(@car_id, 'uploads/cars/fiat_toro_2_0_freedom_4x4_at_2022_96453km_foto_15.webp', 0, 9),
(@car_id, 'uploads/cars/fiat_toro_2_0_freedom_4x4_at_2022_96453km_foto_16.webp', 0, 10),
(@car_id, 'uploads/cars/fiat_toro_2_0_freedom_4x4_at_2022_96453km_foto_17.webp', 0, 11),
(@car_id, 'uploads/cars/fiat_toro_2_0_freedom_4x4_at_2022_96453km_foto_18.webp', 0, 12),
(@car_id, 'uploads/cars/fiat_toro_2_0_freedom_4x4_at_2022_96453km_foto_19.webp', 0, 13),
(@car_id, 'uploads/cars/fiat_toro_2_0_freedom_4x4_at_2022_96453km_foto_20.webp', 0, 14),
(@car_id, 'uploads/cars/fiat_toro_2_0_freedom_4x4_at_2022_96453km_foto_21.webp', 0, 15),
(@car_id, 'uploads/cars/fiat_toro_2_0_freedom_4x4_at_2022_96453km_foto_22.webp', 0, 16),
(@car_id, 'uploads/cars/fiat_toro_2_0_freedom_4x4_at_2022_96453km_foto_23.webp', 0, 17);

-- Ford Ecosport 2018
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Ford', 'Ecosport', '1.5 Freestyle 123cv 4x2', 2018, 20580000, 83383, 'manual', 'gasolina', '1.5', '123 hp', 4, 4241, 1821, 1693, 2608, 52, 1, 'Conductor y pasajero', 0, 1, 1, 0, 'Asistida', '4x2', 0, 0, 0, 'suv', 'Negro', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/ford_ecosport_1_5_freestyle_123cv_4x2_2018_83383km_foto_03.webp', 1, 0),
(@car_id, 'uploads/cars/ford_ecosport_1_5_freestyle_123cv_4x2_2018_83383km_foto_05.webp', 0, 1),
(@car_id, 'uploads/cars/ford_ecosport_1_5_freestyle_123cv_4x2_2018_83383km_foto_06.webp', 0, 2),
(@car_id, 'uploads/cars/ford_ecosport_1_5_freestyle_123cv_4x2_2018_83383km_foto_07.webp', 0, 3),
(@car_id, 'uploads/cars/ford_ecosport_1_5_freestyle_123cv_4x2_2018_83383km_foto_09.webp', 0, 4),
(@car_id, 'uploads/cars/ford_ecosport_1_5_freestyle_123cv_4x2_2018_83383km_foto_10.webp', 0, 5),
(@car_id, 'uploads/cars/ford_ecosport_1_5_freestyle_123cv_4x2_2018_83383km_foto_11.webp', 0, 6),
(@car_id, 'uploads/cars/ford_ecosport_1_5_freestyle_123cv_4x2_2018_83383km_foto_12.webp', 0, 7),
(@car_id, 'uploads/cars/ford_ecosport_1_5_freestyle_123cv_4x2_2018_83383km_foto_13.webp', 0, 8),
(@car_id, 'uploads/cars/ford_ecosport_1_5_freestyle_123cv_4x2_2018_83383km_foto_14.webp', 0, 9),
(@car_id, 'uploads/cars/ford_ecosport_1_5_freestyle_123cv_4x2_2018_83383km_foto_15.webp', 0, 10),
(@car_id, 'uploads/cars/ford_ecosport_1_5_freestyle_123cv_4x2_2018_83383km_foto_16.webp', 0, 11),
(@car_id, 'uploads/cars/ford_ecosport_1_5_freestyle_123cv_4x2_2018_83383km_foto_17.webp', 0, 12),
(@car_id, 'uploads/cars/ford_ecosport_1_5_freestyle_123cv_4x2_2018_83383km_foto_18.webp', 0, 13),
(@car_id, 'uploads/cars/ford_ecosport_1_5_freestyle_123cv_4x2_2018_83383km_foto_19.webp', 0, 14),
(@car_id, 'uploads/cars/ford_ecosport_1_5_freestyle_123cv_4x2_2018_83383km_foto_20.webp', 0, 15),
(@car_id, 'uploads/cars/ford_ecosport_1_5_freestyle_123cv_4x2_2018_83383km_foto_21.webp', 0, 16),
(@car_id, 'uploads/cars/ford_ecosport_1_5_freestyle_123cv_4x2_2018_83383km_foto_22.webp', 0, 17),
(@car_id, 'uploads/cars/ford_ecosport_1_5_freestyle_123cv_4x2_2018_83383km_foto_23.webp', 0, 18);

-- Ford Ecosport 2021
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Ford', 'Ecosport', '1.5 Se 123cv 4x2 Manual', 2021, 23324000, 78281, 'manual', 'gasolina', '1.5', '123 hp', 4, 4241, 1821, 1693, 2608, 52, 1, 'Conductor y pasajero', 0, 1, 1, 0, 'Asistida', '4x2', 0, 0, 0, 'suv', 'Plateado', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/ford_ecosport_1_5_se_123cv_4x2_manual_2021_78281km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/ford_ecosport_1_5_se_123cv_4x2_manual_2021_78281km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/ford_ecosport_1_5_se_123cv_4x2_manual_2021_78281km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/ford_ecosport_1_5_se_123cv_4x2_manual_2021_78281km_foto_06.webp', 0, 3),
(@car_id, 'uploads/cars/ford_ecosport_1_5_se_123cv_4x2_manual_2021_78281km_foto_10.webp', 0, 4),
(@car_id, 'uploads/cars/ford_ecosport_1_5_se_123cv_4x2_manual_2021_78281km_foto_11.webp', 0, 5),
(@car_id, 'uploads/cars/ford_ecosport_1_5_se_123cv_4x2_manual_2021_78281km_foto_12.webp', 0, 6),
(@car_id, 'uploads/cars/ford_ecosport_1_5_se_123cv_4x2_manual_2021_78281km_foto_13.webp', 0, 7),
(@car_id, 'uploads/cars/ford_ecosport_1_5_se_123cv_4x2_manual_2021_78281km_foto_14.webp', 0, 8),
(@car_id, 'uploads/cars/ford_ecosport_1_5_se_123cv_4x2_manual_2021_78281km_foto_15.webp', 0, 9),
(@car_id, 'uploads/cars/ford_ecosport_1_5_se_123cv_4x2_manual_2021_78281km_foto_16.webp', 0, 10),
(@car_id, 'uploads/cars/ford_ecosport_1_5_se_123cv_4x2_manual_2021_78281km_foto_17.webp', 0, 11),
(@car_id, 'uploads/cars/ford_ecosport_1_5_se_123cv_4x2_manual_2021_78281km_foto_18.webp', 0, 12),
(@car_id, 'uploads/cars/ford_ecosport_1_5_se_123cv_4x2_manual_2021_78281km_foto_19.webp', 0, 13),
(@car_id, 'uploads/cars/ford_ecosport_1_5_se_123cv_4x2_manual_2021_78281km_foto_20.webp', 0, 14),
(@car_id, 'uploads/cars/ford_ecosport_1_5_se_123cv_4x2_manual_2021_78281km_foto_21.webp', 0, 15);

-- Ford Ecosport 2019
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Ford', 'Ecosport', '1.5 Titanium 123cv 4x2 Manual', 2019, 22540000, 80547, 'manual', 'gasolina', '1.5', '123 hp', 4, 4241, 1821, 1693, 2608, 52, 1, 'Conductor y pasajero', 0, 1, 1, 0, 'Asistida', '4x2', 0, 0, 0, 'suv', 'Blanco', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_80547km_foto_01.webp', 1, 0),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_80547km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_80547km_foto_05.webp', 0, 2),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_80547km_foto_06.webp', 0, 3),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_80547km_foto_07.webp', 0, 4),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_80547km_foto_08.webp', 0, 5),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_80547km_foto_09.webp', 0, 6),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_80547km_foto_10.webp', 0, 7),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_80547km_foto_11.webp', 0, 8),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_80547km_foto_12.webp', 0, 9),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_80547km_foto_13.webp', 0, 10),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_80547km_foto_14.webp', 0, 11),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_80547km_foto_15.webp', 0, 12),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_80547km_foto_16.webp', 0, 13),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_80547km_foto_17.webp', 0, 14),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_80547km_foto_18.webp', 0, 15),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_80547km_foto_19.webp', 0, 16),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_80547km_foto_20.webp', 0, 17);

-- Ford Ecosport 2019
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Ford', 'Ecosport', '1.5 Titanium 123cv 4x2 Manual', 2019, 23030000, 83225, 'manual', 'gasolina', '1.5', '123 hp', 4, 4241, 1821, 1693, 2608, 52, 1, 'Conductor y pasajero', 0, 1, 1, 0, 'Asistida', '4x2', 0, 0, 0, 'suv', 'Gris', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_83225km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_83225km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_83225km_foto_06.webp', 0, 2),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_83225km_foto_08.webp', 0, 3),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_83225km_foto_09.webp', 0, 4),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_83225km_foto_10.webp', 0, 5),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_83225km_foto_11.webp', 0, 6),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_83225km_foto_12.webp', 0, 7),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_83225km_foto_13.webp', 0, 8),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_83225km_foto_14.webp', 0, 9),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_83225km_foto_15.webp', 0, 10),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_83225km_foto_16.webp', 0, 11),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_83225km_foto_17.webp', 0, 12),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_83225km_foto_18.webp', 0, 13),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_83225km_foto_19.webp', 0, 14),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_83225km_foto_20.webp', 0, 15),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_83225km_foto_21.webp', 0, 16),
(@car_id, 'uploads/cars/ford_ecosport_1_5_titanium_123cv_4x2_manual_2019_83225km_foto_22.webp', 0, 17);

-- Ford Focus III 2018
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Ford', 'Focus III', '2.0 Se', 2018, 23500000, 108646, 'manual', 'gasolina', '2.0', '170 hp', 4, 4412, 1742, 1484, 2630, 55, 1, 'Conductor y pasajero', 1, 0, 1, 0, 'Eléctrica', 'Delantera', 0, 0, 0, 'hatchback', 'Azul', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/ford_focus_iii_2_0_se_2018_108646km_foto_05.webp', 1, 0),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_se_2018_108646km_foto_06.webp', 0, 1),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_se_2018_108646km_foto_07.webp', 0, 2),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_se_2018_108646km_foto_08.webp', 0, 3),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_se_2018_108646km_foto_09.webp', 0, 4),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_se_2018_108646km_foto_10.webp', 0, 5),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_se_2018_108646km_foto_11.webp', 0, 6),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_se_2018_108646km_foto_12.webp', 0, 7),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_se_2018_108646km_foto_13.webp', 0, 8),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_se_2018_108646km_foto_14.webp', 0, 9),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_se_2018_108646km_foto_15.webp', 0, 10),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_se_2018_108646km_foto_16.webp', 0, 11);

-- Ford Focus III 2017
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Ford', 'Focus III', '2.0 Sedan Se Plus At6', 2017, 20580000, 115949, 'automatico', 'gasolina', '2.0', '170 hp', 4, 4534, 1742, 1484, 2630, 55, 1, 'Conductor y pasajero', 0, 0, 1, 0, 'Eléctrica', 'Delantera', 0, 0, 0, 'sedan', 'Gris', 4, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/ford_focus_iii_2_0_sedan_se_plus_at6_2017_115949km_foto_01.webp', 1, 0),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_sedan_se_plus_at6_2017_115949km_foto_04.webp', 0, 1),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_sedan_se_plus_at6_2017_115949km_foto_08.webp', 0, 2),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_sedan_se_plus_at6_2017_115949km_foto_09.webp', 0, 3),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_sedan_se_plus_at6_2017_115949km_foto_10.webp', 0, 4),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_sedan_se_plus_at6_2017_115949km_foto_11.webp', 0, 5),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_sedan_se_plus_at6_2017_115949km_foto_12.webp', 0, 6),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_sedan_se_plus_at6_2017_115949km_foto_13.webp', 0, 7),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_sedan_se_plus_at6_2017_115949km_foto_14.webp', 0, 8),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_sedan_se_plus_at6_2017_115949km_foto_15.webp', 0, 9),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_sedan_se_plus_at6_2017_115949km_foto_16.webp', 0, 10),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_sedan_se_plus_at6_2017_115949km_foto_17.webp', 0, 11),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_sedan_se_plus_at6_2017_115949km_foto_18.webp', 0, 12),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_sedan_se_plus_at6_2017_115949km_foto_19.webp', 0, 13),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_sedan_se_plus_at6_2017_115949km_foto_20.webp', 0, 14),
(@car_id, 'uploads/cars/ford_focus_iii_2_0_sedan_se_plus_at6_2017_115949km_foto_21.webp', 0, 15);

-- Ford Ka 2017
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Ford', 'Ka', '1.5 S', 2017, 15386000, 94557, 'manual', 'gasolina', '1.5', '105 hp', 4, 3969, 1777, 1464, 2686, 51, 1, 'Conductor y pasajero', 0, 0, 0, 1, 'Eléctrica', 'Delantera', 0, 0, 0, 'hatchback', 'Rojo', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/ford_ka_1_5_s_2017_94557km_foto_04.webp', 1, 0),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2017_94557km_foto_05.webp', 0, 1),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2017_94557km_foto_08.webp', 0, 2),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2017_94557km_foto_10.webp', 0, 3),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2017_94557km_foto_11.webp', 0, 4),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2017_94557km_foto_12.webp', 0, 5),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2017_94557km_foto_13.webp', 0, 6),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2017_94557km_foto_14.webp', 0, 7),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2017_94557km_foto_15.webp', 0, 8),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2017_94557km_foto_16.webp', 0, 9),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2017_94557km_foto_17.webp', 0, 10),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2017_94557km_foto_18.webp', 0, 11),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2017_94557km_foto_19.webp', 0, 12),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2017_94557km_foto_20.webp', 0, 13),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2017_94557km_foto_21.webp', 0, 14),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2017_94557km_foto_22.webp', 0, 15);

-- Ford Ka 2020
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Ford', 'Ka', '1.5 S', 2020, 18130000, 70893, 'manual', 'gasolina', '1.5', '123 hp', 4, 3969, 1777, 1464, 2686, 51, 1, 'Conductor y pasajero', 0, 0, 0, 1, 'Eléctrica', 'Delantera', 0, 0, 0, 'hatchback', 'Blanco', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/ford_ka_1_5_s_2020_70893km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2020_70893km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2020_70893km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2020_70893km_foto_07.webp', 0, 3),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2020_70893km_foto_08.webp', 0, 4),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2020_70893km_foto_10.webp', 0, 5),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2020_70893km_foto_11.webp', 0, 6),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2020_70893km_foto_12.webp', 0, 7),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2020_70893km_foto_13.webp', 0, 8),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2020_70893km_foto_14.webp', 0, 9),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2020_70893km_foto_15.webp', 0, 10),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2020_70893km_foto_16.webp', 0, 11),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2020_70893km_foto_17.webp', 0, 12),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2020_70893km_foto_18.webp', 0, 13),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2020_70893km_foto_19.webp', 0, 14),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2020_70893km_foto_20.webp', 0, 15),
(@car_id, 'uploads/cars/ford_ka_1_5_s_2020_70893km_foto_21.webp', 0, 16);

-- Hyundai Creta 2025
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Hyundai', 'Creta', '1.5 Safety Cvt', 2025, 33900, 0, 'automatico', 'gasolina', '1.5', '115 hp', 4, 4300, 1790, 1635, 2610, 55, 1, 'Conductor y pasajero', 0, 0, 1, 1, 'Eléctrica', '4x2', 0, 1, 1, 'suv', 'Gris', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/hyundai_creta_1_5_safety_cvt_2025_0km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/hyundai_creta_1_5_safety_cvt_2025_0km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/hyundai_creta_1_5_safety_cvt_2025_0km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/hyundai_creta_1_5_safety_cvt_2025_0km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/hyundai_creta_1_5_safety_cvt_2025_0km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/hyundai_creta_1_5_safety_cvt_2025_0km_foto_07.webp', 0, 5),
(@car_id, 'uploads/cars/hyundai_creta_1_5_safety_cvt_2025_0km_foto_08.webp', 0, 6),
(@car_id, 'uploads/cars/hyundai_creta_1_5_safety_cvt_2025_0km_foto_09.webp', 0, 7),
(@car_id, 'uploads/cars/hyundai_creta_1_5_safety_cvt_2025_0km_foto_10.webp', 0, 8),
(@car_id, 'uploads/cars/hyundai_creta_1_5_safety_cvt_2025_0km_foto_11.webp', 0, 9),
(@car_id, 'uploads/cars/hyundai_creta_1_5_safety_cvt_2025_0km_foto_12.webp', 0, 10),
(@car_id, 'uploads/cars/hyundai_creta_1_5_safety_cvt_2025_0km_foto_13.webp', 0, 11),
(@car_id, 'uploads/cars/hyundai_creta_1_5_safety_cvt_2025_0km_foto_14.webp', 0, 12),
(@car_id, 'uploads/cars/hyundai_creta_1_5_safety_cvt_2025_0km_foto_15.webp', 0, 13),
(@car_id, 'uploads/cars/hyundai_creta_1_5_safety_cvt_2025_0km_foto_16.webp', 0, 14),
(@car_id, 'uploads/cars/hyundai_creta_1_5_safety_cvt_2025_0km_foto_17.webp', 0, 15),
(@car_id, 'uploads/cars/hyundai_creta_1_5_safety_cvt_2025_0km_foto_18.webp', 0, 16);

-- Hyundai Creta 2021
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Hyundai', 'Creta', '1.6 At Safety+', 2021, 25970000, 146613, 'automatico', 'gasolina', '1.6', '123 hp', 4, 4270, 1780, 1630, 2590, 55, 1, 'Conductor y pasajero', 0, 0, 1, 1, 'Eléctrica', '4x2', 0, 1, 1, 'suv', 'Gris', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/hyundai_creta_1_6_at_safety__2021_146613km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/hyundai_creta_1_6_at_safety__2021_146613km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/hyundai_creta_1_6_at_safety__2021_146613km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/hyundai_creta_1_6_at_safety__2021_146613km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/hyundai_creta_1_6_at_safety__2021_146613km_foto_07.webp', 0, 4),
(@car_id, 'uploads/cars/hyundai_creta_1_6_at_safety__2021_146613km_foto_08.webp', 0, 5),
(@car_id, 'uploads/cars/hyundai_creta_1_6_at_safety__2021_146613km_foto_09.webp', 0, 6),
(@car_id, 'uploads/cars/hyundai_creta_1_6_at_safety__2021_146613km_foto_10.webp', 0, 7),
(@car_id, 'uploads/cars/hyundai_creta_1_6_at_safety__2021_146613km_foto_11.webp', 0, 8),
(@car_id, 'uploads/cars/hyundai_creta_1_6_at_safety__2021_146613km_foto_12.webp', 0, 9),
(@car_id, 'uploads/cars/hyundai_creta_1_6_at_safety__2021_146613km_foto_13.webp', 0, 10),
(@car_id, 'uploads/cars/hyundai_creta_1_6_at_safety__2021_146613km_foto_14.webp', 0, 11),
(@car_id, 'uploads/cars/hyundai_creta_1_6_at_safety__2021_146613km_foto_15.webp', 0, 12),
(@car_id, 'uploads/cars/hyundai_creta_1_6_at_safety__2021_146613km_foto_16.webp', 0, 13),
(@car_id, 'uploads/cars/hyundai_creta_1_6_at_safety__2021_146613km_foto_17.webp', 0, 14),
(@car_id, 'uploads/cars/hyundai_creta_1_6_at_safety__2021_146613km_foto_18.webp', 0, 15),
(@car_id, 'uploads/cars/hyundai_creta_1_6_at_safety__2021_146613km_foto_19.webp', 0, 16);

-- Hyundai HB20 2025
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Hyundai', 'HB20', '1.6 Platinum Safety At', 2025, 34900000, 0, 'automatico', 'gasolina', '1.6', '123 hp', 4, 4015, 1720, 1470, 0, 50, 0, 'No', 0, 0, 0, 0, '', 'Delantera', 0, 0, 0, 'hatchback', 'Blanco', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/hyundai_hb20_1_6_platinum_safety_at_2025_0km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/hyundai_hb20_1_6_platinum_safety_at_2025_0km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/hyundai_hb20_1_6_platinum_safety_at_2025_0km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/hyundai_hb20_1_6_platinum_safety_at_2025_0km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/hyundai_hb20_1_6_platinum_safety_at_2025_0km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/hyundai_hb20_1_6_platinum_safety_at_2025_0km_foto_07.webp', 0, 5),
(@car_id, 'uploads/cars/hyundai_hb20_1_6_platinum_safety_at_2025_0km_foto_08.webp', 0, 6),
(@car_id, 'uploads/cars/hyundai_hb20_1_6_platinum_safety_at_2025_0km_foto_09.webp', 0, 7),
(@car_id, 'uploads/cars/hyundai_hb20_1_6_platinum_safety_at_2025_0km_foto_11.webp', 0, 8),
(@car_id, 'uploads/cars/hyundai_hb20_1_6_platinum_safety_at_2025_0km_foto_12.webp', 0, 9),
(@car_id, 'uploads/cars/hyundai_hb20_1_6_platinum_safety_at_2025_0km_foto_13.webp', 0, 10),
(@car_id, 'uploads/cars/hyundai_hb20_1_6_platinum_safety_at_2025_0km_foto_14.webp', 0, 11),
(@car_id, 'uploads/cars/hyundai_hb20_1_6_platinum_safety_at_2025_0km_foto_15.webp', 0, 12),
(@car_id, 'uploads/cars/hyundai_hb20_1_6_platinum_safety_at_2025_0km_foto_16.webp', 0, 13),
(@car_id, 'uploads/cars/hyundai_hb20_1_6_platinum_safety_at_2025_0km_foto_17.webp', 0, 14),
(@car_id, 'uploads/cars/hyundai_hb20_1_6_platinum_safety_at_2025_0km_foto_18.webp', 0, 15);

-- Hyundai Staria 2025
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Hyundai', 'Staria', '2.2Td Safety 2Wd', 2025, 69000, 0, 'automatico', 'gasolina', '2.2', '177 hp', 4, 5253, 1997, 1990, 3201, 75, 0, 'No', 0, 0, 0, 0, '', 'Delantera', 0, 0, 0, 'sedan', 'Negro', 5, 11, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/hyundai_staria_2_2td_safety_2wd_2025_0km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/hyundai_staria_2_2td_safety_2wd_2025_0km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/hyundai_staria_2_2td_safety_2wd_2025_0km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/hyundai_staria_2_2td_safety_2wd_2025_0km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/hyundai_staria_2_2td_safety_2wd_2025_0km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/hyundai_staria_2_2td_safety_2wd_2025_0km_foto_07.webp', 0, 5),
(@car_id, 'uploads/cars/hyundai_staria_2_2td_safety_2wd_2025_0km_foto_08.webp', 0, 6),
(@car_id, 'uploads/cars/hyundai_staria_2_2td_safety_2wd_2025_0km_foto_09.webp', 0, 7),
(@car_id, 'uploads/cars/hyundai_staria_2_2td_safety_2wd_2025_0km_foto_10.webp', 0, 8),
(@car_id, 'uploads/cars/hyundai_staria_2_2td_safety_2wd_2025_0km_foto_11.webp', 0, 9),
(@car_id, 'uploads/cars/hyundai_staria_2_2td_safety_2wd_2025_0km_foto_12.webp', 0, 10),
(@car_id, 'uploads/cars/hyundai_staria_2_2td_safety_2wd_2025_0km_foto_13.webp', 0, 11),
(@car_id, 'uploads/cars/hyundai_staria_2_2td_safety_2wd_2025_0km_foto_14.webp', 0, 12),
(@car_id, 'uploads/cars/hyundai_staria_2_2td_safety_2wd_2025_0km_foto_15.webp', 0, 13),
(@car_id, 'uploads/cars/hyundai_staria_2_2td_safety_2wd_2025_0km_foto_16.webp', 0, 14);

-- Hyundai Tucson 2025
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Hyundai', 'Tucson', 'Ultimate 1.6 Turbo DCT 4WD', 2025, 58000, 0, 'automatico', 'gasolina', '1.6 Turbo', '', 0, 0, 0, 0, 0, 0, 0, 'No', 0, 0, 0, 0, '', '4x4', 0, 0, 0, 'suv', 'Gris', 5, 0, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/hyundai_tucson_1_6_turbo_4x4_2025_0km_foto_03.webp', 1, 0),
(@car_id, 'uploads/cars/hyundai_tucson_1_6_turbo_4x4_2025_0km_foto_04.webp', 0, 1),
(@car_id, 'uploads/cars/hyundai_tucson_1_6_turbo_4x4_2025_0km_foto_07.webp', 0, 2),
(@car_id, 'uploads/cars/hyundai_tucson_1_6_turbo_4x4_2025_0km_foto_08.webp', 0, 3),
(@car_id, 'uploads/cars/hyundai_tucson_1_6_turbo_4x4_2025_0km_foto_09.webp', 0, 4),
(@car_id, 'uploads/cars/hyundai_tucson_1_6_turbo_4x4_2025_0km_foto_10.webp', 0, 5),
(@car_id, 'uploads/cars/hyundai_tucson_1_6_turbo_4x4_2025_0km_foto_11.webp', 0, 6),
(@car_id, 'uploads/cars/hyundai_tucson_1_6_turbo_4x4_2025_0km_foto_14.webp', 0, 7),
(@car_id, 'uploads/cars/hyundai_tucson_1_6_turbo_4x4_2025_0km_foto_15.webp', 0, 8),
(@car_id, 'uploads/cars/hyundai_tucson_1_6_turbo_4x4_2025_0km_foto_16.webp', 0, 9),
(@car_id, 'uploads/cars/hyundai_tucson_1_6_turbo_4x4_2025_0km_foto_17.webp', 0, 10),
(@car_id, 'uploads/cars/hyundai_tucson_1_6_turbo_4x4_2025_0km_foto_18.webp', 0, 11),
(@car_id, 'uploads/cars/hyundai_tucson_1_6_turbo_4x4_2025_0km_foto_19.webp', 0, 12),
(@car_id, 'uploads/cars/hyundai_tucson_1_6_turbo_4x4_2025_0km_foto_20.webp', 0, 13),
(@car_id, 'uploads/cars/hyundai_tucson_1_6_turbo_4x4_2025_0km_foto_21.webp', 0, 14),
(@car_id, 'uploads/cars/hyundai_tucson_1_6_turbo_4x4_2025_0km_foto_22.webp', 0, 15);

-- Hyundai Tucson 2020
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Hyundai', 'Tucson', '2.0 C/techo', 2020, 37044000, 94473, 'automatico', 'gasolina', '2.0', '166 hp', 4, 4410, 1830, 1655, 2630, 58, 1, 'Conductor y pasajero', 0, 0, 0, 0, '', '4x2', 0, 0, 0, 'suv', 'Plateado', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/hyundai_tucson_2_0_ctecho_2020_94473km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_ctecho_2020_94473km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_ctecho_2020_94473km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_ctecho_2020_94473km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_ctecho_2020_94473km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_ctecho_2020_94473km_foto_07.webp', 0, 5),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_ctecho_2020_94473km_foto_08.webp', 0, 6),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_ctecho_2020_94473km_foto_09.webp', 0, 7),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_ctecho_2020_94473km_foto_10.webp', 0, 8),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_ctecho_2020_94473km_foto_11.webp', 0, 9),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_ctecho_2020_94473km_foto_12.webp', 0, 10),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_ctecho_2020_94473km_foto_13.webp', 0, 11),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_ctecho_2020_94473km_foto_14.webp', 0, 12),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_ctecho_2020_94473km_foto_15.webp', 0, 13),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_ctecho_2020_94473km_foto_16.webp', 0, 14),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_ctecho_2020_94473km_foto_17.webp', 0, 15);

-- Hyundai Tucson 2025
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Hyundai', 'Tucson', '2.0 Safety 2Wd At', 2025, 48000, 0, 'automatico', 'gasolina', '2.0', '156 hp', 4, 4640, 1865, 1665, 2700, 54, 0, 'No', 0, 0, 0, 0, '', '4x2', 0, 0, 0, 'suv', 'Gris', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/hyundai_tucson_2_0_safety_2wd_at_2025_0km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_safety_2wd_at_2025_0km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_safety_2wd_at_2025_0km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_safety_2wd_at_2025_0km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_safety_2wd_at_2025_0km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_safety_2wd_at_2025_0km_foto_07.webp', 0, 5),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_safety_2wd_at_2025_0km_foto_08.webp', 0, 6),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_safety_2wd_at_2025_0km_foto_09.webp', 0, 7),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_safety_2wd_at_2025_0km_foto_10.webp', 0, 8),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_safety_2wd_at_2025_0km_foto_11.webp', 0, 9),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_safety_2wd_at_2025_0km_foto_12.webp', 0, 10),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_safety_2wd_at_2025_0km_foto_13.webp', 0, 11),
(@car_id, 'uploads/cars/hyundai_tucson_2_0_safety_2wd_at_2025_0km_foto_14.webp', 0, 12);

-- Jeep Commander 2023
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Jeep', 'Commander', '2.0 Td380 At9 4x4 7pas Limited', 2023, 46550000, 84296, 'automatico', 'gasolina', '2.0', '170 hp', 4, 4405, 2040, 1702, 2794, 52, 1, 'Conductor y pasajero', 0, 0, 0, 0, '', '4x4', 0, 0, 0, 'suv', 'Gris', 5, 7, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/jeep_commander_2_0_td380_at9_4x4_7pas_limited_2023_84296km_foto_03.webp', 1, 0),
(@car_id, 'uploads/cars/jeep_commander_2_0_td380_at9_4x4_7pas_limited_2023_84296km_foto_04.webp', 0, 1),
(@car_id, 'uploads/cars/jeep_commander_2_0_td380_at9_4x4_7pas_limited_2023_84296km_foto_06.webp', 0, 2),
(@car_id, 'uploads/cars/jeep_commander_2_0_td380_at9_4x4_7pas_limited_2023_84296km_foto_07.webp', 0, 3),
(@car_id, 'uploads/cars/jeep_commander_2_0_td380_at9_4x4_7pas_limited_2023_84296km_foto_09.webp', 0, 4),
(@car_id, 'uploads/cars/jeep_commander_2_0_td380_at9_4x4_7pas_limited_2023_84296km_foto_10.webp', 0, 5),
(@car_id, 'uploads/cars/jeep_commander_2_0_td380_at9_4x4_7pas_limited_2023_84296km_foto_11.webp', 0, 6),
(@car_id, 'uploads/cars/jeep_commander_2_0_td380_at9_4x4_7pas_limited_2023_84296km_foto_12.webp', 0, 7),
(@car_id, 'uploads/cars/jeep_commander_2_0_td380_at9_4x4_7pas_limited_2023_84296km_foto_13.webp', 0, 8),
(@car_id, 'uploads/cars/jeep_commander_2_0_td380_at9_4x4_7pas_limited_2023_84296km_foto_14.webp', 0, 9),
(@car_id, 'uploads/cars/jeep_commander_2_0_td380_at9_4x4_7pas_limited_2023_84296km_foto_15.webp', 0, 10),
(@car_id, 'uploads/cars/jeep_commander_2_0_td380_at9_4x4_7pas_limited_2023_84296km_foto_16.webp', 0, 11),
(@car_id, 'uploads/cars/jeep_commander_2_0_td380_at9_4x4_7pas_limited_2023_84296km_foto_17.webp', 0, 12),
(@car_id, 'uploads/cars/jeep_commander_2_0_td380_at9_4x4_7pas_limited_2023_84296km_foto_18.webp', 0, 13),
(@car_id, 'uploads/cars/jeep_commander_2_0_td380_at9_4x4_7pas_limited_2023_84296km_foto_19.webp', 0, 14),
(@car_id, 'uploads/cars/jeep_commander_2_0_td380_at9_4x4_7pas_limited_2023_84296km_foto_20.webp', 0, 15);

-- Jeep Compass 2021
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Jeep', 'Compass', '2.4 Longitude', 2021, 38710000, 36506, 'automatico', 'gasolina', '2.4', '174 hp', 4, 4394, 2033, 1630, 2636, 60, 1, 'Conductor y pasajero', 0, 0, 0, 0, '', '4x2', 0, 0, 0, 'suv', 'Blanco', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/jeep_compass_2_4_longitude_2021_36506km_foto_03.webp', 1, 0),
(@car_id, 'uploads/cars/jeep_compass_2_4_longitude_2021_36506km_foto_04.webp', 0, 1),
(@car_id, 'uploads/cars/jeep_compass_2_4_longitude_2021_36506km_foto_05.webp', 0, 2),
(@car_id, 'uploads/cars/jeep_compass_2_4_longitude_2021_36506km_foto_06.webp', 0, 3),
(@car_id, 'uploads/cars/jeep_compass_2_4_longitude_2021_36506km_foto_07.webp', 0, 4),
(@car_id, 'uploads/cars/jeep_compass_2_4_longitude_2021_36506km_foto_08.webp', 0, 5),
(@car_id, 'uploads/cars/jeep_compass_2_4_longitude_2021_36506km_foto_09.webp', 0, 6),
(@car_id, 'uploads/cars/jeep_compass_2_4_longitude_2021_36506km_foto_10.webp', 0, 7),
(@car_id, 'uploads/cars/jeep_compass_2_4_longitude_2021_36506km_foto_11.webp', 0, 8),
(@car_id, 'uploads/cars/jeep_compass_2_4_longitude_2021_36506km_foto_12.webp', 0, 9),
(@car_id, 'uploads/cars/jeep_compass_2_4_longitude_2021_36506km_foto_13.webp', 0, 10),
(@car_id, 'uploads/cars/jeep_compass_2_4_longitude_2021_36506km_foto_14.webp', 0, 11),
(@car_id, 'uploads/cars/jeep_compass_2_4_longitude_2021_36506km_foto_15.webp', 0, 12),
(@car_id, 'uploads/cars/jeep_compass_2_4_longitude_2021_36506km_foto_16.webp', 0, 13),
(@car_id, 'uploads/cars/jeep_compass_2_4_longitude_2021_36506km_foto_17.webp', 0, 14),
(@car_id, 'uploads/cars/jeep_compass_2_4_longitude_2021_36506km_foto_18.webp', 0, 15);

-- Jeep Grand Cherokee 2016
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Jeep', 'Grand Cherokee', '3.6 Overland 286hp At', 2016, 33500, 115047, 'automatico', 'gasolina', '3.6', '286 hp', 4, 4822, 1943, 1781, 2915, 94, 1, 'Conductor y pasajero', 1, 0, 1, 0, 'Hidráulica', '4x4', 0, 0, 0, 'suv', 'Gris', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/jeep_grand_cherokee_3_6_overland_286hp_at_2016_115047km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/jeep_grand_cherokee_3_6_overland_286hp_at_2016_115047km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/jeep_grand_cherokee_3_6_overland_286hp_at_2016_115047km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/jeep_grand_cherokee_3_6_overland_286hp_at_2016_115047km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/jeep_grand_cherokee_3_6_overland_286hp_at_2016_115047km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/jeep_grand_cherokee_3_6_overland_286hp_at_2016_115047km_foto_07.webp', 0, 5),
(@car_id, 'uploads/cars/jeep_grand_cherokee_3_6_overland_286hp_at_2016_115047km_foto_08.webp', 0, 6),
(@car_id, 'uploads/cars/jeep_grand_cherokee_3_6_overland_286hp_at_2016_115047km_foto_09.webp', 0, 7),
(@car_id, 'uploads/cars/jeep_grand_cherokee_3_6_overland_286hp_at_2016_115047km_foto_12.webp', 0, 8),
(@car_id, 'uploads/cars/jeep_grand_cherokee_3_6_overland_286hp_at_2016_115047km_foto_13.webp', 0, 9),
(@car_id, 'uploads/cars/jeep_grand_cherokee_3_6_overland_286hp_at_2016_115047km_foto_14.webp', 0, 10),
(@car_id, 'uploads/cars/jeep_grand_cherokee_3_6_overland_286hp_at_2016_115047km_foto_15.webp', 0, 11),
(@car_id, 'uploads/cars/jeep_grand_cherokee_3_6_overland_286hp_at_2016_115047km_foto_16.webp', 0, 12),
(@car_id, 'uploads/cars/jeep_grand_cherokee_3_6_overland_286hp_at_2016_115047km_foto_17.webp', 0, 13),
(@car_id, 'uploads/cars/jeep_grand_cherokee_3_6_overland_286hp_at_2016_115047km_foto_18.webp', 0, 14),
(@car_id, 'uploads/cars/jeep_grand_cherokee_3_6_overland_286hp_at_2016_115047km_foto_19.webp', 0, 15),
(@car_id, 'uploads/cars/jeep_grand_cherokee_3_6_overland_286hp_at_2016_115047km_foto_20.webp', 0, 16),
(@car_id, 'uploads/cars/jeep_grand_cherokee_3_6_overland_286hp_at_2016_115047km_foto_21.webp', 0, 17);

-- Kia Carnival 2025
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Kia', 'Carnival', '2.2 Crdi Sx At', 2025, 75000, 0, 'automatico', 'gasolina', '2.2', '199 hp', 4, 5155, 1995, 1775, 3090, 72, 0, 'No', 0, 0, 0, 0, '', 'Delantera', 0, 0, 0, 'sedan', 'Dorado', 5, 7, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/kia_carnival_2_2_crdi_sx_at_2025_0km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/kia_carnival_2_2_crdi_sx_at_2025_0km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/kia_carnival_2_2_crdi_sx_at_2025_0km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/kia_carnival_2_2_crdi_sx_at_2025_0km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/kia_carnival_2_2_crdi_sx_at_2025_0km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/kia_carnival_2_2_crdi_sx_at_2025_0km_foto_07.webp', 0, 5),
(@car_id, 'uploads/cars/kia_carnival_2_2_crdi_sx_at_2025_0km_foto_08.webp', 0, 6),
(@car_id, 'uploads/cars/kia_carnival_2_2_crdi_sx_at_2025_0km_foto_09.webp', 0, 7),
(@car_id, 'uploads/cars/kia_carnival_2_2_crdi_sx_at_2025_0km_foto_10.webp', 0, 8),
(@car_id, 'uploads/cars/kia_carnival_2_2_crdi_sx_at_2025_0km_foto_11.webp', 0, 9),
(@car_id, 'uploads/cars/kia_carnival_2_2_crdi_sx_at_2025_0km_foto_12.webp', 0, 10),
(@car_id, 'uploads/cars/kia_carnival_2_2_crdi_sx_at_2025_0km_foto_13.webp', 0, 11),
(@car_id, 'uploads/cars/kia_carnival_2_2_crdi_sx_at_2025_0km_foto_14.webp', 0, 12),
(@car_id, 'uploads/cars/kia_carnival_2_2_crdi_sx_at_2025_0km_foto_15.webp', 0, 13),
(@car_id, 'uploads/cars/kia_carnival_2_2_crdi_sx_at_2025_0km_foto_16.webp', 0, 14);

-- Kia K2500 2021
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Kia', 'K2500', '2.5 Caja', 2021, 35280000, 187885, 'manual', 'gasolina', '2.5', '130 hp', 2, 5110, 1740, 1970, 2615, 60, 1, 'Conductor y pasajero', 0, 0, 0, 0, 'Hidráulica', '4x2', 0, 0, 0, 'sedan', 'Blanco', 2, 3, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/kia_k2500_2_5_caja_2021_187885km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/kia_k2500_2_5_caja_2021_187885km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/kia_k2500_2_5_caja_2021_187885km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/kia_k2500_2_5_caja_2021_187885km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/kia_k2500_2_5_caja_2021_187885km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/kia_k2500_2_5_caja_2021_187885km_foto_07.webp', 0, 5),
(@car_id, 'uploads/cars/kia_k2500_2_5_caja_2021_187885km_foto_08.webp', 0, 6),
(@car_id, 'uploads/cars/kia_k2500_2_5_caja_2021_187885km_foto_09.webp', 0, 7),
(@car_id, 'uploads/cars/kia_k2500_2_5_caja_2021_187885km_foto_10.webp', 0, 8),
(@car_id, 'uploads/cars/kia_k2500_2_5_caja_2021_187885km_foto_11.webp', 0, 9);

-- Kia K2500 2025
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Kia', 'K2500', '2.5 Caja', 2025, 33000, 0, 'manual', 'gasolina', '2.5', '130 hp', 2, 5110, 1740, 1970, 2615, 60, 1, 'Conductor y pasajero', 0, 0, 0, 0, 'Hidráulica', '4x2', 0, 0, 0, 'sedan', 'Blanco', 2, 3, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/kia_k2500_2_5_caja_2025_0km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/kia_k2500_2_5_caja_2025_0km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/kia_k2500_2_5_caja_2025_0km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/kia_k2500_2_5_caja_2025_0km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/kia_k2500_2_5_caja_2025_0km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/kia_k2500_2_5_caja_2025_0km_foto_07.webp', 0, 5),
(@car_id, 'uploads/cars/kia_k2500_2_5_caja_2025_0km_foto_08.webp', 0, 6),
(@car_id, 'uploads/cars/kia_k2500_2_5_caja_2025_0km_foto_09.webp', 0, 7),
(@car_id, 'uploads/cars/kia_k2500_2_5_caja_2025_0km_foto_10.webp', 0, 8),
(@car_id, 'uploads/cars/kia_k2500_2_5_caja_2025_0km_foto_11.webp', 0, 9),
(@car_id, 'uploads/cars/kia_k2500_2_5_caja_2025_0km_foto_12.webp', 0, 10),
(@car_id, 'uploads/cars/kia_k2500_2_5_caja_2025_0km_foto_13.webp', 0, 11),
(@car_id, 'uploads/cars/kia_k2500_2_5_caja_2025_0km_foto_14.webp', 0, 12),
(@car_id, 'uploads/cars/kia_k2500_2_5_caja_2025_0km_foto_15.webp', 0, 13),
(@car_id, 'uploads/cars/kia_k2500_2_5_caja_2025_0km_foto_16.webp', 0, 14);

-- Kia K3 Cross 2025
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Kia', 'K3 Cross', '1.6 Gt Line At', 2025, 28000, 0, 'automatico', 'gasolina', '1.6', '121 hp', 4, 4295, 1765, 1475, 2670, 50, 0, 'No', 0, 0, 0, 0, '', 'Delantera', 0, 0, 0, 'suv', 'Gris', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/kia_k3_cross_1_6_gt_line_at_2025_0km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/kia_k3_cross_1_6_gt_line_at_2025_0km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/kia_k3_cross_1_6_gt_line_at_2025_0km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/kia_k3_cross_1_6_gt_line_at_2025_0km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/kia_k3_cross_1_6_gt_line_at_2025_0km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/kia_k3_cross_1_6_gt_line_at_2025_0km_foto_07.webp', 0, 5),
(@car_id, 'uploads/cars/kia_k3_cross_1_6_gt_line_at_2025_0km_foto_08.webp', 0, 6),
(@car_id, 'uploads/cars/kia_k3_cross_1_6_gt_line_at_2025_0km_foto_09.webp', 0, 7),
(@car_id, 'uploads/cars/kia_k3_cross_1_6_gt_line_at_2025_0km_foto_10.webp', 0, 8),
(@car_id, 'uploads/cars/kia_k3_cross_1_6_gt_line_at_2025_0km_foto_11.webp', 0, 9),
(@car_id, 'uploads/cars/kia_k3_cross_1_6_gt_line_at_2025_0km_foto_12.webp', 0, 10),
(@car_id, 'uploads/cars/kia_k3_cross_1_6_gt_line_at_2025_0km_foto_13.webp', 0, 11),
(@car_id, 'uploads/cars/kia_k3_cross_1_6_gt_line_at_2025_0km_foto_14.webp', 0, 12),
(@car_id, 'uploads/cars/kia_k3_cross_1_6_gt_line_at_2025_0km_foto_15.webp', 0, 13),
(@car_id, 'uploads/cars/kia_k3_cross_1_6_gt_line_at_2025_0km_foto_16.webp', 0, 14);

-- Kia K3 Sedan 2025
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Kia', 'K3 Sedan', '1.6 Gt Line At', 2025, 28000, 0, 'automatico', 'gasolina', '1.6', '121 hp', 4, 4295, 1765, 1475, 2670, 50, 0, 'No', 0, 0, 0, 0, '', 'Delantera', 0, 0, 0, 'suv', 'Gris', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/kia_k3_sedan_1_6_gt_line_at_2025_0km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/kia_k3_sedan_1_6_gt_line_at_2025_0km_foto_04.webp', 0, 1),
(@car_id, 'uploads/cars/kia_k3_sedan_1_6_gt_line_at_2025_0km_foto_05.webp', 0, 2),
(@car_id, 'uploads/cars/kia_k3_sedan_1_6_gt_line_at_2025_0km_foto_07.webp', 0, 3),
(@car_id, 'uploads/cars/kia_k3_sedan_1_6_gt_line_at_2025_0km_foto_08.webp', 0, 4),
(@car_id, 'uploads/cars/kia_k3_sedan_1_6_gt_line_at_2025_0km_foto_09.webp', 0, 5),
(@car_id, 'uploads/cars/kia_k3_sedan_1_6_gt_line_at_2025_0km_foto_10.webp', 0, 6),
(@car_id, 'uploads/cars/kia_k3_sedan_1_6_gt_line_at_2025_0km_foto_11.webp', 0, 7),
(@car_id, 'uploads/cars/kia_k3_sedan_1_6_gt_line_at_2025_0km_foto_12.webp', 0, 8),
(@car_id, 'uploads/cars/kia_k3_sedan_1_6_gt_line_at_2025_0km_foto_13.webp', 0, 9),
(@car_id, 'uploads/cars/kia_k3_sedan_1_6_gt_line_at_2025_0km_foto_14.webp', 0, 10),
(@car_id, 'uploads/cars/kia_k3_sedan_1_6_gt_line_at_2025_0km_foto_15.webp', 0, 11),
(@car_id, 'uploads/cars/kia_k3_sedan_1_6_gt_line_at_2025_0km_foto_16.webp', 0, 12),
(@car_id, 'uploads/cars/kia_k3_sedan_1_6_gt_line_at_2025_0km_foto_17.webp', 0, 13),
(@car_id, 'uploads/cars/kia_k3_sedan_1_6_gt_line_at_2025_0km_foto_18.webp', 0, 14);

-- Kia Seltos 2025
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Kia', 'Seltos', 'Sx', 2025, 33500, 0, 'manual', 'gasolina', '', '', 0, 0, 0, 0, 0, 0, 0, 'No', 0, 0, 0, 0, '', '', 0, 0, 0, 'sedan', 'Blanco', 5, 0, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/kia_seltos_sx_2025_0km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/kia_seltos_sx_2025_0km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/kia_seltos_sx_2025_0km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/kia_seltos_sx_2025_0km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/kia_seltos_sx_2025_0km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/kia_seltos_sx_2025_0km_foto_07.webp', 0, 5),
(@car_id, 'uploads/cars/kia_seltos_sx_2025_0km_foto_08.webp', 0, 6),
(@car_id, 'uploads/cars/kia_seltos_sx_2025_0km_foto_09.webp', 0, 7),
(@car_id, 'uploads/cars/kia_seltos_sx_2025_0km_foto_10.webp', 0, 8),
(@car_id, 'uploads/cars/kia_seltos_sx_2025_0km_foto_11.webp', 0, 9),
(@car_id, 'uploads/cars/kia_seltos_sx_2025_0km_foto_12.webp', 0, 10),
(@car_id, 'uploads/cars/kia_seltos_sx_2025_0km_foto_13.webp', 0, 11),
(@car_id, 'uploads/cars/kia_seltos_sx_2025_0km_foto_14.webp', 0, 12),
(@car_id, 'uploads/cars/kia_seltos_sx_2025_0km_foto_15.webp', 0, 13),
(@car_id, 'uploads/cars/kia_seltos_sx_2025_0km_foto_16.webp', 0, 14);

-- Kia Sportage 2018
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Kia', 'Sportage', '2.0 Crdi Ex At 154Cv 4X4', 2018, 29000, 161340, 'automatico', 'gasolina', '2.0', '154 hp', 4, 4480, 1855, 1655, 2670, 62, 1, 'Conductor y pasajero', 1, 0, 1, 1, 'Eléctrica', '4x4', 0, 0, 1, 'suv', 'Blanco', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/kia_sportage_2_0_crdi_ex_at_154cv_4x4_2018_161340km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/kia_sportage_2_0_crdi_ex_at_154cv_4x4_2018_161340km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/kia_sportage_2_0_crdi_ex_at_154cv_4x4_2018_161340km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/kia_sportage_2_0_crdi_ex_at_154cv_4x4_2018_161340km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/kia_sportage_2_0_crdi_ex_at_154cv_4x4_2018_161340km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/kia_sportage_2_0_crdi_ex_at_154cv_4x4_2018_161340km_foto_07.webp', 0, 5),
(@car_id, 'uploads/cars/kia_sportage_2_0_crdi_ex_at_154cv_4x4_2018_161340km_foto_08.webp', 0, 6),
(@car_id, 'uploads/cars/kia_sportage_2_0_crdi_ex_at_154cv_4x4_2018_161340km_foto_09.webp', 0, 7),
(@car_id, 'uploads/cars/kia_sportage_2_0_crdi_ex_at_154cv_4x4_2018_161340km_foto_10.webp', 0, 8),
(@car_id, 'uploads/cars/kia_sportage_2_0_crdi_ex_at_154cv_4x4_2018_161340km_foto_11.webp', 0, 9),
(@car_id, 'uploads/cars/kia_sportage_2_0_crdi_ex_at_154cv_4x4_2018_161340km_foto_12.webp', 0, 10),
(@car_id, 'uploads/cars/kia_sportage_2_0_crdi_ex_at_154cv_4x4_2018_161340km_foto_13.webp', 0, 11),
(@car_id, 'uploads/cars/kia_sportage_2_0_crdi_ex_at_154cv_4x4_2018_161340km_foto_14.webp', 0, 12),
(@car_id, 'uploads/cars/kia_sportage_2_0_crdi_ex_at_154cv_4x4_2018_161340km_foto_15.webp', 0, 13),
(@car_id, 'uploads/cars/kia_sportage_2_0_crdi_ex_at_154cv_4x4_2018_161340km_foto_16.webp', 0, 14),
(@car_id, 'uploads/cars/kia_sportage_2_0_crdi_ex_at_154cv_4x4_2018_161340km_foto_17.webp', 0, 15),
(@car_id, 'uploads/cars/kia_sportage_2_0_crdi_ex_at_154cv_4x4_2018_161340km_foto_18.webp', 0, 16),
(@car_id, 'uploads/cars/kia_sportage_2_0_crdi_ex_at_154cv_4x4_2018_161340km_foto_19.webp', 0, 17),
(@car_id, 'uploads/cars/kia_sportage_2_0_crdi_ex_at_154cv_4x4_2018_161340km_foto_20.webp', 0, 18),
(@car_id, 'uploads/cars/kia_sportage_2_0_crdi_ex_at_154cv_4x4_2018_161340km_foto_21.webp', 0, 19),
(@car_id, 'uploads/cars/kia_sportage_2_0_crdi_ex_at_154cv_4x4_2018_161340km_foto_22.webp', 0, 20),
(@car_id, 'uploads/cars/kia_sportage_2_0_crdi_ex_at_154cv_4x4_2018_161340km_foto_23.webp', 0, 21),
(@car_id, 'uploads/cars/kia_sportage_2_0_crdi_ex_at_154cv_4x4_2018_161340km_foto_24.webp', 0, 22);

-- Nissan March 2017
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Nissan', 'March', '1.6 Active 107cv', 2017, 16856000, 86513, 'manual', 'gasolina', '1.6', '107 hp', 4, 3780, 1675, 1528, 2450, 41, 1, 'Conductor y pasajero', 0, 0, 0, 1, 'Asistida', 'Delantera', 0, 0, 1, 'hatchback', 'Gris', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/nissan_march_1_6_active_107cv_2017_86513km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/nissan_march_1_6_active_107cv_2017_86513km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/nissan_march_1_6_active_107cv_2017_86513km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/nissan_march_1_6_active_107cv_2017_86513km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/nissan_march_1_6_active_107cv_2017_86513km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/nissan_march_1_6_active_107cv_2017_86513km_foto_07.webp', 0, 5),
(@car_id, 'uploads/cars/nissan_march_1_6_active_107cv_2017_86513km_foto_08.webp', 0, 6),
(@car_id, 'uploads/cars/nissan_march_1_6_active_107cv_2017_86513km_foto_09.webp', 0, 7),
(@car_id, 'uploads/cars/nissan_march_1_6_active_107cv_2017_86513km_foto_10.webp', 0, 8),
(@car_id, 'uploads/cars/nissan_march_1_6_active_107cv_2017_86513km_foto_11.webp', 0, 9),
(@car_id, 'uploads/cars/nissan_march_1_6_active_107cv_2017_86513km_foto_12.webp', 0, 10),
(@car_id, 'uploads/cars/nissan_march_1_6_active_107cv_2017_86513km_foto_13.webp', 0, 11),
(@car_id, 'uploads/cars/nissan_march_1_6_active_107cv_2017_86513km_foto_14.webp', 0, 12),
(@car_id, 'uploads/cars/nissan_march_1_6_active_107cv_2017_86513km_foto_15.webp', 0, 13),
(@car_id, 'uploads/cars/nissan_march_1_6_active_107cv_2017_86513km_foto_16.webp', 0, 14),
(@car_id, 'uploads/cars/nissan_march_1_6_active_107cv_2017_86513km_foto_17.webp', 0, 15),
(@car_id, 'uploads/cars/nissan_march_1_6_active_107cv_2017_86513km_foto_18.webp', 0, 16),
(@car_id, 'uploads/cars/nissan_march_1_6_active_107cv_2017_86513km_foto_19.webp', 0, 17),
(@car_id, 'uploads/cars/nissan_march_1_6_active_107cv_2017_86513km_foto_20.webp', 0, 18);

-- Nissan Note 2018
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Nissan', 'Note', '1.6 Sense 110cv', 2018, 18130000, 108149, 'manual', 'gasolina', '1.6', '110 hp', 4, 4142, 1695, 1537, 2600, 41, 1, 'Conductor y pasajero', 0, 0, 0, 1, 'Asistida', 'Delantera', 0, 0, 1, 'hatchback', 'Plateado', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/nissan_note_1_6_sense_110cv_2018_108149km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/nissan_note_1_6_sense_110cv_2018_108149km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/nissan_note_1_6_sense_110cv_2018_108149km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/nissan_note_1_6_sense_110cv_2018_108149km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/nissan_note_1_6_sense_110cv_2018_108149km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/nissan_note_1_6_sense_110cv_2018_108149km_foto_07.webp', 0, 5),
(@car_id, 'uploads/cars/nissan_note_1_6_sense_110cv_2018_108149km_foto_08.webp', 0, 6),
(@car_id, 'uploads/cars/nissan_note_1_6_sense_110cv_2018_108149km_foto_09.webp', 0, 7),
(@car_id, 'uploads/cars/nissan_note_1_6_sense_110cv_2018_108149km_foto_10.webp', 0, 8),
(@car_id, 'uploads/cars/nissan_note_1_6_sense_110cv_2018_108149km_foto_11.webp', 0, 9),
(@car_id, 'uploads/cars/nissan_note_1_6_sense_110cv_2018_108149km_foto_12.webp', 0, 10),
(@car_id, 'uploads/cars/nissan_note_1_6_sense_110cv_2018_108149km_foto_13.webp', 0, 11),
(@car_id, 'uploads/cars/nissan_note_1_6_sense_110cv_2018_108149km_foto_14.webp', 0, 12),
(@car_id, 'uploads/cars/nissan_note_1_6_sense_110cv_2018_108149km_foto_15.webp', 0, 13),
(@car_id, 'uploads/cars/nissan_note_1_6_sense_110cv_2018_108149km_foto_16.webp', 0, 14),
(@car_id, 'uploads/cars/nissan_note_1_6_sense_110cv_2018_108149km_foto_17.webp', 0, 15),
(@car_id, 'uploads/cars/nissan_note_1_6_sense_110cv_2018_108149km_foto_18.webp', 0, 16),
(@car_id, 'uploads/cars/nissan_note_1_6_sense_110cv_2018_108149km_foto_19.webp', 0, 17),
(@car_id, 'uploads/cars/nissan_note_1_6_sense_110cv_2018_108149km_foto_20.webp', 0, 18),
(@car_id, 'uploads/cars/nissan_note_1_6_sense_110cv_2018_108149km_foto_21.webp', 0, 19);

-- Peugeot 2008 2018
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Peugeot', '2008', '1.6 Allure Tip', 2018, 18620000, 112934, 'automatico', 'gasolina', '1.6', '115 hp', 4, 4159, 1739, 1583, 2542, 55, 1, 'Conductor y pasajero', 0, 0, 1, 0, 'Eléctrica', 'Delantera', 0, 0, 1, 'suv', 'Marrón', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/peugeot_2008_1_6_allure_tip_2018_112934km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/peugeot_2008_1_6_allure_tip_2018_112934km_foto_04.webp', 0, 1),
(@car_id, 'uploads/cars/peugeot_2008_1_6_allure_tip_2018_112934km_foto_06.webp', 0, 2),
(@car_id, 'uploads/cars/peugeot_2008_1_6_allure_tip_2018_112934km_foto_07.webp', 0, 3),
(@car_id, 'uploads/cars/peugeot_2008_1_6_allure_tip_2018_112934km_foto_09.webp', 0, 4),
(@car_id, 'uploads/cars/peugeot_2008_1_6_allure_tip_2018_112934km_foto_10.webp', 0, 5),
(@car_id, 'uploads/cars/peugeot_2008_1_6_allure_tip_2018_112934km_foto_11.webp', 0, 6),
(@car_id, 'uploads/cars/peugeot_2008_1_6_allure_tip_2018_112934km_foto_13.webp', 0, 7),
(@car_id, 'uploads/cars/peugeot_2008_1_6_allure_tip_2018_112934km_foto_14.webp', 0, 8),
(@car_id, 'uploads/cars/peugeot_2008_1_6_allure_tip_2018_112934km_foto_15.webp', 0, 9),
(@car_id, 'uploads/cars/peugeot_2008_1_6_allure_tip_2018_112934km_foto_16.webp', 0, 10),
(@car_id, 'uploads/cars/peugeot_2008_1_6_allure_tip_2018_112934km_foto_17.webp', 0, 11),
(@car_id, 'uploads/cars/peugeot_2008_1_6_allure_tip_2018_112934km_foto_18.webp', 0, 12),
(@car_id, 'uploads/cars/peugeot_2008_1_6_allure_tip_2018_112934km_foto_19.webp', 0, 13),
(@car_id, 'uploads/cars/peugeot_2008_1_6_allure_tip_2018_112934km_foto_20.webp', 0, 14),
(@car_id, 'uploads/cars/peugeot_2008_1_6_allure_tip_2018_112934km_foto_21.webp', 0, 15),
(@car_id, 'uploads/cars/peugeot_2008_1_6_allure_tip_2018_112934km_foto_22.webp', 0, 16),
(@car_id, 'uploads/cars/peugeot_2008_1_6_allure_tip_2018_112934km_foto_23.webp', 0, 17);

-- Peugeot 2008 2018
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Peugeot', '2008', '1.6 Feline', 2018, 18130000, 184009, 'manual', 'gasolina', '1.6', '115 hp', 4, 4159, 1739, 1583, 2542, 55, 1, 'Conductor y pasajero', 0, 0, 0, 0, '', 'Delantera', 0, 0, 1, 'suv', 'Blanco', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_2018_184009km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_2018_184009km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_2018_184009km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_2018_184009km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_2018_184009km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_2018_184009km_foto_07.webp', 0, 5),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_2018_184009km_foto_08.webp', 0, 6),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_2018_184009km_foto_09.webp', 0, 7),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_2018_184009km_foto_10.webp', 0, 8),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_2018_184009km_foto_11.webp', 0, 9),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_2018_184009km_foto_12.webp', 0, 10),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_2018_184009km_foto_13.webp', 0, 11),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_2018_184009km_foto_14.webp', 0, 12),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_2018_184009km_foto_15.webp', 0, 13),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_2018_184009km_foto_16.webp', 0, 14),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_2018_184009km_foto_17.webp', 0, 15),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_2018_184009km_foto_18.webp', 0, 16);

-- Peugeot 2008 2022
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Peugeot', '2008', '1.6 Feline Tiptronic', 2022, 24990000, 75937, 'automatico', 'gasolina', '1.6', '115 hp', 4, 4159, 1739, 1583, 2542, 55, 1, 'Conductor y pasajero', 0, 0, 1, 0, 'Eléctrica', 'Delantera', 0, 0, 1, 'suv', 'Blanco', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_tiptronic_2022_75937km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_tiptronic_2022_75937km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_tiptronic_2022_75937km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_tiptronic_2022_75937km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_tiptronic_2022_75937km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_tiptronic_2022_75937km_foto_08.webp', 0, 5),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_tiptronic_2022_75937km_foto_09.webp', 0, 6),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_tiptronic_2022_75937km_foto_10.webp', 0, 7),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_tiptronic_2022_75937km_foto_11.webp', 0, 8),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_tiptronic_2022_75937km_foto_12.webp', 0, 9),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_tiptronic_2022_75937km_foto_13.webp', 0, 10),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_tiptronic_2022_75937km_foto_14.webp', 0, 11),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_tiptronic_2022_75937km_foto_15.webp', 0, 12),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_tiptronic_2022_75937km_foto_16.webp', 0, 13),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_tiptronic_2022_75937km_foto_17.webp', 0, 14),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_tiptronic_2022_75937km_foto_18.webp', 0, 15),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_tiptronic_2022_75937km_foto_19.webp', 0, 16),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_tiptronic_2022_75937km_foto_20.webp', 0, 17),
(@car_id, 'uploads/cars/peugeot_2008_1_6_feline_tiptronic_2022_75937km_foto_21.webp', 0, 18);

-- Peugeot 2008 2018
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Peugeot', '2008', '1.6 Thp Sport', 2018, 18620000, 102652, 'manual', 'gasolina', '1.6', '165 hp', 4, 4159, 1739, 1583, 2542, 55, 1, 'Conductor y pasajero', 0, 0, 0, 0, '', 'Delantera', 0, 0, 1, 'suv', 'Blanco', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/peugeot_2008_1_6_thp_sport_2018_102652km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/peugeot_2008_1_6_thp_sport_2018_102652km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/peugeot_2008_1_6_thp_sport_2018_102652km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/peugeot_2008_1_6_thp_sport_2018_102652km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/peugeot_2008_1_6_thp_sport_2018_102652km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/peugeot_2008_1_6_thp_sport_2018_102652km_foto_07.webp', 0, 5),
(@car_id, 'uploads/cars/peugeot_2008_1_6_thp_sport_2018_102652km_foto_08.webp', 0, 6),
(@car_id, 'uploads/cars/peugeot_2008_1_6_thp_sport_2018_102652km_foto_09.webp', 0, 7),
(@car_id, 'uploads/cars/peugeot_2008_1_6_thp_sport_2018_102652km_foto_10.webp', 0, 8),
(@car_id, 'uploads/cars/peugeot_2008_1_6_thp_sport_2018_102652km_foto_11.webp', 0, 9),
(@car_id, 'uploads/cars/peugeot_2008_1_6_thp_sport_2018_102652km_foto_12.webp', 0, 10),
(@car_id, 'uploads/cars/peugeot_2008_1_6_thp_sport_2018_102652km_foto_13.webp', 0, 11),
(@car_id, 'uploads/cars/peugeot_2008_1_6_thp_sport_2018_102652km_foto_14.webp', 0, 12),
(@car_id, 'uploads/cars/peugeot_2008_1_6_thp_sport_2018_102652km_foto_15.webp', 0, 13),
(@car_id, 'uploads/cars/peugeot_2008_1_6_thp_sport_2018_102652km_foto_16.webp', 0, 14),
(@car_id, 'uploads/cars/peugeot_2008_1_6_thp_sport_2018_102652km_foto_17.webp', 0, 15),
(@car_id, 'uploads/cars/peugeot_2008_1_6_thp_sport_2018_102652km_foto_18.webp', 0, 16),
(@car_id, 'uploads/cars/peugeot_2008_1_6_thp_sport_2018_102652km_foto_19.webp', 0, 17);

-- Peugeot 207 2013
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Peugeot', '207', '1.4 Allure 75cv', 2013, 12740000, 136098, 'manual', 'gasolina', '1.4', '75 hp', 2, 3872, 1669, 1446, 2443, 50, 0, 'Conductor y pasajero', 0, 1, 0, 1, 'Hidráulica', 'Delantera', 0, 0, 1, 'hatchback', 'Blanco', 3, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_75cv_2013_136098km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_75cv_2013_136098km_foto_04.webp', 0, 1),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_75cv_2013_136098km_foto_05.webp', 0, 2),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_75cv_2013_136098km_foto_07.webp', 0, 3),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_75cv_2013_136098km_foto_09.webp', 0, 4),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_75cv_2013_136098km_foto_10.webp', 0, 5),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_75cv_2013_136098km_foto_11.webp', 0, 6),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_75cv_2013_136098km_foto_12.webp', 0, 7),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_75cv_2013_136098km_foto_13.webp', 0, 8),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_75cv_2013_136098km_foto_14.webp', 0, 9),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_75cv_2013_136098km_foto_15.webp', 0, 10),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_75cv_2013_136098km_foto_16.webp', 0, 11),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_75cv_2013_136098km_foto_17.webp', 0, 12),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_75cv_2013_136098km_foto_18.webp', 0, 13),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_75cv_2013_136098km_foto_19.webp', 0, 14),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_75cv_2013_136098km_foto_20.webp', 0, 15),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_75cv_2013_136098km_foto_21.webp', 0, 16);

-- Peugeot 207 2012
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Peugeot', '207', '1.4 Allure Hdi 70cv', 2012, 13622000, 73717, 'manual', 'gasolina', '1.4', '70 hp', 2, 3872, 1669, 1441, 2443, 50, 0, 'Conductor y pasajero', 0, 1, 0, 1, 'Hidráulica', 'Delantera', 0, 0, 1, 'hatchback', 'Gris', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_hdi_70cv_2012_73717km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_hdi_70cv_2012_73717km_foto_04.webp', 0, 1),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_hdi_70cv_2012_73717km_foto_06.webp', 0, 2),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_hdi_70cv_2012_73717km_foto_08.webp', 0, 3),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_hdi_70cv_2012_73717km_foto_09.webp', 0, 4),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_hdi_70cv_2012_73717km_foto_10.webp', 0, 5),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_hdi_70cv_2012_73717km_foto_11.webp', 0, 6),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_hdi_70cv_2012_73717km_foto_12.webp', 0, 7),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_hdi_70cv_2012_73717km_foto_13.webp', 0, 8),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_hdi_70cv_2012_73717km_foto_14.webp', 0, 9),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_hdi_70cv_2012_73717km_foto_15.webp', 0, 10),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_hdi_70cv_2012_73717km_foto_16.webp', 0, 11),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_hdi_70cv_2012_73717km_foto_17.webp', 0, 12),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_hdi_70cv_2012_73717km_foto_18.webp', 0, 13),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_hdi_70cv_2012_73717km_foto_19.webp', 0, 14),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_hdi_70cv_2012_73717km_foto_20.webp', 0, 15),
(@car_id, 'uploads/cars/peugeot_207_1_4_allure_hdi_70cv_2012_73717km_foto_21.webp', 0, 16);

-- Peugeot 208 2022
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Peugeot', '208', '1.6 Feline Tiptronic', 2022, 26460000, 37166, 'automatico', 'gasolina', '1.6', '115 hp', 4, 3975, 1740, 1470, 2540, 55, 1, 'Conductor y pasajero', 0, 1, 1, 0, 'Asistida', 'Delantera', 0, 1, 1, 'hatchback', 'Blanco', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/peugeot_208_1_6_feline_tiptronic_2022_37166km_foto_03.webp', 1, 0),
(@car_id, 'uploads/cars/peugeot_208_1_6_feline_tiptronic_2022_37166km_foto_06.webp', 0, 1),
(@car_id, 'uploads/cars/peugeot_208_1_6_feline_tiptronic_2022_37166km_foto_07.webp', 0, 2),
(@car_id, 'uploads/cars/peugeot_208_1_6_feline_tiptronic_2022_37166km_foto_10.webp', 0, 3),
(@car_id, 'uploads/cars/peugeot_208_1_6_feline_tiptronic_2022_37166km_foto_11.webp', 0, 4),
(@car_id, 'uploads/cars/peugeot_208_1_6_feline_tiptronic_2022_37166km_foto_12.webp', 0, 5),
(@car_id, 'uploads/cars/peugeot_208_1_6_feline_tiptronic_2022_37166km_foto_13.webp', 0, 6),
(@car_id, 'uploads/cars/peugeot_208_1_6_feline_tiptronic_2022_37166km_foto_14.webp', 0, 7),
(@car_id, 'uploads/cars/peugeot_208_1_6_feline_tiptronic_2022_37166km_foto_15.webp', 0, 8),
(@car_id, 'uploads/cars/peugeot_208_1_6_feline_tiptronic_2022_37166km_foto_16.webp', 0, 9),
(@car_id, 'uploads/cars/peugeot_208_1_6_feline_tiptronic_2022_37166km_foto_17.webp', 0, 10),
(@car_id, 'uploads/cars/peugeot_208_1_6_feline_tiptronic_2022_37166km_foto_18.webp', 0, 11),
(@car_id, 'uploads/cars/peugeot_208_1_6_feline_tiptronic_2022_37166km_foto_19.webp', 0, 12),
(@car_id, 'uploads/cars/peugeot_208_1_6_feline_tiptronic_2022_37166km_foto_20.webp', 0, 13),
(@car_id, 'uploads/cars/peugeot_208_1_6_feline_tiptronic_2022_37166km_foto_21.webp', 0, 14),
(@car_id, 'uploads/cars/peugeot_208_1_6_feline_tiptronic_2022_37166km_foto_22.webp', 0, 15),
(@car_id, 'uploads/cars/peugeot_208_1_6_feline_tiptronic_2022_37166km_foto_23.webp', 0, 16),
(@car_id, 'uploads/cars/peugeot_208_1_6_feline_tiptronic_2022_37166km_foto_24.webp', 0, 17);

-- Peugeot 208 2023
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Peugeot', '208', '1.6 Style Mt', 2023, 25284000, 42283, 'manual', 'gasolina', '1.6', '115 hp', 4, 3975, 1740, 1470, 2540, 55, 1, 'Conductor y pasajero', 0, 1, 1, 0, 'Asistida', 'Delantera', 0, 1, 1, 'hatchback', 'Gris', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/peugeot_208_1_6_style_mt_2023_42283km_foto_03.webp', 1, 0),
(@car_id, 'uploads/cars/peugeot_208_1_6_style_mt_2023_42283km_foto_05.webp', 0, 1),
(@car_id, 'uploads/cars/peugeot_208_1_6_style_mt_2023_42283km_foto_07.webp', 0, 2),
(@car_id, 'uploads/cars/peugeot_208_1_6_style_mt_2023_42283km_foto_09.webp', 0, 3),
(@car_id, 'uploads/cars/peugeot_208_1_6_style_mt_2023_42283km_foto_10.webp', 0, 4),
(@car_id, 'uploads/cars/peugeot_208_1_6_style_mt_2023_42283km_foto_11.webp', 0, 5),
(@car_id, 'uploads/cars/peugeot_208_1_6_style_mt_2023_42283km_foto_12.webp', 0, 6),
(@car_id, 'uploads/cars/peugeot_208_1_6_style_mt_2023_42283km_foto_13.webp', 0, 7),
(@car_id, 'uploads/cars/peugeot_208_1_6_style_mt_2023_42283km_foto_14.webp', 0, 8),
(@car_id, 'uploads/cars/peugeot_208_1_6_style_mt_2023_42283km_foto_15.webp', 0, 9),
(@car_id, 'uploads/cars/peugeot_208_1_6_style_mt_2023_42283km_foto_16.webp', 0, 10),
(@car_id, 'uploads/cars/peugeot_208_1_6_style_mt_2023_42283km_foto_17.webp', 0, 11),
(@car_id, 'uploads/cars/peugeot_208_1_6_style_mt_2023_42283km_foto_18.webp', 0, 12),
(@car_id, 'uploads/cars/peugeot_208_1_6_style_mt_2023_42283km_foto_19.webp', 0, 13),
(@car_id, 'uploads/cars/peugeot_208_1_6_style_mt_2023_42283km_foto_20.webp', 0, 14),
(@car_id, 'uploads/cars/peugeot_208_1_6_style_mt_2023_42283km_foto_21.webp', 0, 15),
(@car_id, 'uploads/cars/peugeot_208_1_6_style_mt_2023_42283km_foto_22.webp', 0, 16);

-- Renault Captur 2017
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Renault', 'Captur', '2.0 Intens', 2017, 22050000, 65362, 'manual', 'gasolina', '2.0', '143 hp', 4, 4122, 1778, 1556, 2670, 45, 1, 'Conductor y pasajero', 1, 0, 1, 1, 'Hidráulica', 'Delantera', 0, 0, 0, 'suv', 'Blanco', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/renault_captur_2_0_intens_2017_65362km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/renault_captur_2_0_intens_2017_65362km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/renault_captur_2_0_intens_2017_65362km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/renault_captur_2_0_intens_2017_65362km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/renault_captur_2_0_intens_2017_65362km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/renault_captur_2_0_intens_2017_65362km_foto_07.webp', 0, 5),
(@car_id, 'uploads/cars/renault_captur_2_0_intens_2017_65362km_foto_08.webp', 0, 6),
(@car_id, 'uploads/cars/renault_captur_2_0_intens_2017_65362km_foto_09.webp', 0, 7),
(@car_id, 'uploads/cars/renault_captur_2_0_intens_2017_65362km_foto_10.webp', 0, 8),
(@car_id, 'uploads/cars/renault_captur_2_0_intens_2017_65362km_foto_11.webp', 0, 9),
(@car_id, 'uploads/cars/renault_captur_2_0_intens_2017_65362km_foto_12.webp', 0, 10),
(@car_id, 'uploads/cars/renault_captur_2_0_intens_2017_65362km_foto_13.webp', 0, 11),
(@car_id, 'uploads/cars/renault_captur_2_0_intens_2017_65362km_foto_14.webp', 0, 12),
(@car_id, 'uploads/cars/renault_captur_2_0_intens_2017_65362km_foto_15.webp', 0, 13),
(@car_id, 'uploads/cars/renault_captur_2_0_intens_2017_65362km_foto_16.webp', 0, 14);

-- Renault Captur 2017
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Renault', 'Captur', '2.0 Zen', 2017, 21000000, 98754, 'manual', 'gasolina', '2.0', '143 hp', 4, 4122, 1778, 1556, 2670, 45, 1, 'Conductor y pasajero', 0, 0, 0, 0, '', 'Delantera', 0, 0, 0, 'suv', 'Blanco', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/renault_captur_2_0_zen_2017_98754km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/renault_captur_2_0_zen_2017_98754km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/renault_captur_2_0_zen_2017_98754km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/renault_captur_2_0_zen_2017_98754km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/renault_captur_2_0_zen_2017_98754km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/renault_captur_2_0_zen_2017_98754km_foto_07.webp', 0, 5),
(@car_id, 'uploads/cars/renault_captur_2_0_zen_2017_98754km_foto_08.webp', 0, 6),
(@car_id, 'uploads/cars/renault_captur_2_0_zen_2017_98754km_foto_09.webp', 0, 7),
(@car_id, 'uploads/cars/renault_captur_2_0_zen_2017_98754km_foto_10.webp', 0, 8),
(@car_id, 'uploads/cars/renault_captur_2_0_zen_2017_98754km_foto_11.webp', 0, 9),
(@car_id, 'uploads/cars/renault_captur_2_0_zen_2017_98754km_foto_12.webp', 0, 10),
(@car_id, 'uploads/cars/renault_captur_2_0_zen_2017_98754km_foto_13.webp', 0, 11),
(@car_id, 'uploads/cars/renault_captur_2_0_zen_2017_98754km_foto_14.webp', 0, 12),
(@car_id, 'uploads/cars/renault_captur_2_0_zen_2017_98754km_foto_15.webp', 0, 13),
(@car_id, 'uploads/cars/renault_captur_2_0_zen_2017_98754km_foto_16.webp', 0, 14),
(@car_id, 'uploads/cars/renault_captur_2_0_zen_2017_98754km_foto_17.webp', 0, 15),
(@car_id, 'uploads/cars/renault_captur_2_0_zen_2017_98754km_foto_18.webp', 0, 16),
(@car_id, 'uploads/cars/renault_captur_2_0_zen_2017_98754km_foto_19.webp', 0, 17),
(@car_id, 'uploads/cars/renault_captur_2_0_zen_2017_98754km_foto_20.webp', 0, 18);

-- Renault Duster 2020
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Renault', 'Duster', '1.6 Ph2 4x2 Privilege', 2020, 22442000, 110048, 'manual', 'gasolina', '1.6', '110 hp', 4, 4329, 1822, 1683, 2674, 50, 1, 'Conductor y pasajero', 0, 0, 0, 0, '', '4x2', 0, 0, 0, 'suv', 'Plateado', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/renault_duster_1_6_ph2_4x2_privilege_2020_110048km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/renault_duster_1_6_ph2_4x2_privilege_2020_110048km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/renault_duster_1_6_ph2_4x2_privilege_2020_110048km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/renault_duster_1_6_ph2_4x2_privilege_2020_110048km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/renault_duster_1_6_ph2_4x2_privilege_2020_110048km_foto_07.webp', 0, 4),
(@car_id, 'uploads/cars/renault_duster_1_6_ph2_4x2_privilege_2020_110048km_foto_08.webp', 0, 5),
(@car_id, 'uploads/cars/renault_duster_1_6_ph2_4x2_privilege_2020_110048km_foto_09.webp', 0, 6),
(@car_id, 'uploads/cars/renault_duster_1_6_ph2_4x2_privilege_2020_110048km_foto_10.webp', 0, 7),
(@car_id, 'uploads/cars/renault_duster_1_6_ph2_4x2_privilege_2020_110048km_foto_11.webp', 0, 8),
(@car_id, 'uploads/cars/renault_duster_1_6_ph2_4x2_privilege_2020_110048km_foto_12.webp', 0, 9),
(@car_id, 'uploads/cars/renault_duster_1_6_ph2_4x2_privilege_2020_110048km_foto_13.webp', 0, 10),
(@car_id, 'uploads/cars/renault_duster_1_6_ph2_4x2_privilege_2020_110048km_foto_14.webp', 0, 11),
(@car_id, 'uploads/cars/renault_duster_1_6_ph2_4x2_privilege_2020_110048km_foto_15.webp', 0, 12),
(@car_id, 'uploads/cars/renault_duster_1_6_ph2_4x2_privilege_2020_110048km_foto_16.webp', 0, 13),
(@car_id, 'uploads/cars/renault_duster_1_6_ph2_4x2_privilege_2020_110048km_foto_17.webp', 0, 14),
(@car_id, 'uploads/cars/renault_duster_1_6_ph2_4x2_privilege_2020_110048km_foto_18.webp', 0, 15),
(@car_id, 'uploads/cars/renault_duster_1_6_ph2_4x2_privilege_2020_110048km_foto_19.webp', 0, 16);

-- Renault Kwid 2018
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Renault', 'Kwid', '1.0 Sce 66cv Zen', 2018, 15190000, 81333, 'manual', 'gasolina', '1.0', '66 hp', 4, 3680, 1752, 1474, 2423, 50, 0, 'Conductor y pasajero', 0, 0, 0, 0, '', 'Delantera', 0, 0, 0, 'hatchback', 'Blanco', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/renault_kwid_1_0_sce_66cv_zen_2018_81333km_foto_03.webp', 1, 0),
(@car_id, 'uploads/cars/renault_kwid_1_0_sce_66cv_zen_2018_81333km_foto_04.webp', 0, 1),
(@car_id, 'uploads/cars/renault_kwid_1_0_sce_66cv_zen_2018_81333km_foto_07.webp', 0, 2),
(@car_id, 'uploads/cars/renault_kwid_1_0_sce_66cv_zen_2018_81333km_foto_08.webp', 0, 3),
(@car_id, 'uploads/cars/renault_kwid_1_0_sce_66cv_zen_2018_81333km_foto_10.webp', 0, 4),
(@car_id, 'uploads/cars/renault_kwid_1_0_sce_66cv_zen_2018_81333km_foto_11.webp', 0, 5),
(@car_id, 'uploads/cars/renault_kwid_1_0_sce_66cv_zen_2018_81333km_foto_12.webp', 0, 6),
(@car_id, 'uploads/cars/renault_kwid_1_0_sce_66cv_zen_2018_81333km_foto_13.webp', 0, 7),
(@car_id, 'uploads/cars/renault_kwid_1_0_sce_66cv_zen_2018_81333km_foto_14.webp', 0, 8),
(@car_id, 'uploads/cars/renault_kwid_1_0_sce_66cv_zen_2018_81333km_foto_15.webp', 0, 9),
(@car_id, 'uploads/cars/renault_kwid_1_0_sce_66cv_zen_2018_81333km_foto_16.webp', 0, 10),
(@car_id, 'uploads/cars/renault_kwid_1_0_sce_66cv_zen_2018_81333km_foto_17.webp', 0, 11),
(@car_id, 'uploads/cars/renault_kwid_1_0_sce_66cv_zen_2018_81333km_foto_18.webp', 0, 12),
(@car_id, 'uploads/cars/renault_kwid_1_0_sce_66cv_zen_2018_81333km_foto_19.webp', 0, 13),
(@car_id, 'uploads/cars/renault_kwid_1_0_sce_66cv_zen_2018_81333km_foto_20.webp', 0, 14),
(@car_id, 'uploads/cars/renault_kwid_1_0_sce_66cv_zen_2018_81333km_foto_21.webp', 0, 15),
(@car_id, 'uploads/cars/renault_kwid_1_0_sce_66cv_zen_2018_81333km_foto_22.webp', 0, 16);

-- Renault Logan 2016
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Renault', 'Logan', '1.6 Expression 85cv', 2016, 15582000, 128390, 'manual', 'gasolina', '1.6', '85 hp', 2, 4350, 1733, 1529, 2635, 50, 0, 'Conductor y pasajero', 0, 0, 1, 0, 'Hidráulica', 'Delantera', 0, 0, 0, 'sedan', 'Blanco', 4, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/renault_logan_1_6_expression_85cv_2016_128390km_foto_03.webp', 1, 0),
(@car_id, 'uploads/cars/renault_logan_1_6_expression_85cv_2016_128390km_foto_04.webp', 0, 1),
(@car_id, 'uploads/cars/renault_logan_1_6_expression_85cv_2016_128390km_foto_07.webp', 0, 2),
(@car_id, 'uploads/cars/renault_logan_1_6_expression_85cv_2016_128390km_foto_08.webp', 0, 3),
(@car_id, 'uploads/cars/renault_logan_1_6_expression_85cv_2016_128390km_foto_09.webp', 0, 4),
(@car_id, 'uploads/cars/renault_logan_1_6_expression_85cv_2016_128390km_foto_10.webp', 0, 5),
(@car_id, 'uploads/cars/renault_logan_1_6_expression_85cv_2016_128390km_foto_11.webp', 0, 6),
(@car_id, 'uploads/cars/renault_logan_1_6_expression_85cv_2016_128390km_foto_12.webp', 0, 7),
(@car_id, 'uploads/cars/renault_logan_1_6_expression_85cv_2016_128390km_foto_13.webp', 0, 8),
(@car_id, 'uploads/cars/renault_logan_1_6_expression_85cv_2016_128390km_foto_14.webp', 0, 9),
(@car_id, 'uploads/cars/renault_logan_1_6_expression_85cv_2016_128390km_foto_15.webp', 0, 10),
(@car_id, 'uploads/cars/renault_logan_1_6_expression_85cv_2016_128390km_foto_16.webp', 0, 11),
(@car_id, 'uploads/cars/renault_logan_1_6_expression_85cv_2016_128390km_foto_17.webp', 0, 12),
(@car_id, 'uploads/cars/renault_logan_1_6_expression_85cv_2016_128390km_foto_18.webp', 0, 13),
(@car_id, 'uploads/cars/renault_logan_1_6_expression_85cv_2016_128390km_foto_19.webp', 0, 14),
(@car_id, 'uploads/cars/renault_logan_1_6_expression_85cv_2016_128390km_foto_20.webp', 0, 15),
(@car_id, 'uploads/cars/renault_logan_1_6_expression_85cv_2016_128390km_foto_21.webp', 0, 16);

-- Renault Sandero 2018
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Renault', 'Sandero', '1.6 Dynamique 90cv Abs', 2018, 15680000, 138172, 'manual', 'gasolina', '1.6', '90 hp', 2, 4060, 1733, 1536, 2590, 50, 1, 'Conductor y pasajero', 1, 0, 0, 0, 'Asistida', 'Delantera', 0, 0, 0, 'hatchback', 'Gris', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/renault_sandero_1_6_dynamique_90cv_abs_2018_138172km_foto_04.webp', 1, 0),
(@car_id, 'uploads/cars/renault_sandero_1_6_dynamique_90cv_abs_2018_138172km_foto_05.webp', 0, 1),
(@car_id, 'uploads/cars/renault_sandero_1_6_dynamique_90cv_abs_2018_138172km_foto_07.webp', 0, 2),
(@car_id, 'uploads/cars/renault_sandero_1_6_dynamique_90cv_abs_2018_138172km_foto_08.webp', 0, 3),
(@car_id, 'uploads/cars/renault_sandero_1_6_dynamique_90cv_abs_2018_138172km_foto_09.webp', 0, 4),
(@car_id, 'uploads/cars/renault_sandero_1_6_dynamique_90cv_abs_2018_138172km_foto_10.webp', 0, 5),
(@car_id, 'uploads/cars/renault_sandero_1_6_dynamique_90cv_abs_2018_138172km_foto_11.webp', 0, 6),
(@car_id, 'uploads/cars/renault_sandero_1_6_dynamique_90cv_abs_2018_138172km_foto_12.webp', 0, 7),
(@car_id, 'uploads/cars/renault_sandero_1_6_dynamique_90cv_abs_2018_138172km_foto_13.webp', 0, 8),
(@car_id, 'uploads/cars/renault_sandero_1_6_dynamique_90cv_abs_2018_138172km_foto_14.webp', 0, 9),
(@car_id, 'uploads/cars/renault_sandero_1_6_dynamique_90cv_abs_2018_138172km_foto_16.webp', 0, 10),
(@car_id, 'uploads/cars/renault_sandero_1_6_dynamique_90cv_abs_2018_138172km_foto_17.webp', 0, 11),
(@car_id, 'uploads/cars/renault_sandero_1_6_dynamique_90cv_abs_2018_138172km_foto_18.webp', 0, 12),
(@car_id, 'uploads/cars/renault_sandero_1_6_dynamique_90cv_abs_2018_138172km_foto_19.webp', 0, 13),
(@car_id, 'uploads/cars/renault_sandero_1_6_dynamique_90cv_abs_2018_138172km_foto_20.webp', 0, 14),
(@car_id, 'uploads/cars/renault_sandero_1_6_dynamique_90cv_abs_2018_138172km_foto_21.webp', 0, 15),
(@car_id, 'uploads/cars/renault_sandero_1_6_dynamique_90cv_abs_2018_138172km_foto_22.webp', 0, 16),
(@car_id, 'uploads/cars/renault_sandero_1_6_dynamique_90cv_abs_2018_138172km_foto_23.webp', 0, 17);

-- Renault Sandero 2016
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Renault', 'Sandero', '1.6 Gt Line 105cv', 2016, 16905000, 137099, 'manual', 'gasolina', '1.6', '105 hp', 4, 4060, 1733, 1536, 2590, 50, 1, 'Conductor y pasajero', 1, 0, 0, 0, 'Asistida', 'Delantera', 0, 0, 0, 'hatchback', 'Negro', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/renault_sandero_1_6_gt_line_105cv_2016_137099km_foto_03.webp', 1, 0),
(@car_id, 'uploads/cars/renault_sandero_1_6_gt_line_105cv_2016_137099km_foto_04.webp', 0, 1),
(@car_id, 'uploads/cars/renault_sandero_1_6_gt_line_105cv_2016_137099km_foto_07.webp', 0, 2),
(@car_id, 'uploads/cars/renault_sandero_1_6_gt_line_105cv_2016_137099km_foto_10.webp', 0, 3),
(@car_id, 'uploads/cars/renault_sandero_1_6_gt_line_105cv_2016_137099km_foto_11.webp', 0, 4),
(@car_id, 'uploads/cars/renault_sandero_1_6_gt_line_105cv_2016_137099km_foto_12.webp', 0, 5),
(@car_id, 'uploads/cars/renault_sandero_1_6_gt_line_105cv_2016_137099km_foto_13.webp', 0, 6),
(@car_id, 'uploads/cars/renault_sandero_1_6_gt_line_105cv_2016_137099km_foto_14.webp', 0, 7),
(@car_id, 'uploads/cars/renault_sandero_1_6_gt_line_105cv_2016_137099km_foto_15.webp', 0, 8),
(@car_id, 'uploads/cars/renault_sandero_1_6_gt_line_105cv_2016_137099km_foto_16.webp', 0, 9),
(@car_id, 'uploads/cars/renault_sandero_1_6_gt_line_105cv_2016_137099km_foto_17.webp', 0, 10),
(@car_id, 'uploads/cars/renault_sandero_1_6_gt_line_105cv_2016_137099km_foto_18.webp', 0, 11),
(@car_id, 'uploads/cars/renault_sandero_1_6_gt_line_105cv_2016_137099km_foto_19.webp', 0, 12),
(@car_id, 'uploads/cars/renault_sandero_1_6_gt_line_105cv_2016_137099km_foto_20.webp', 0, 13),
(@car_id, 'uploads/cars/renault_sandero_1_6_gt_line_105cv_2016_137099km_foto_21.webp', 0, 14),
(@car_id, 'uploads/cars/renault_sandero_1_6_gt_line_105cv_2016_137099km_foto_22.webp', 0, 15),
(@car_id, 'uploads/cars/renault_sandero_1_6_gt_line_105cv_2016_137099km_foto_23.webp', 0, 16),
(@car_id, 'uploads/cars/renault_sandero_1_6_gt_line_105cv_2016_137099km_foto_24.webp', 0, 17),
(@car_id, 'uploads/cars/renault_sandero_1_6_gt_line_105cv_2016_137099km_foto_25.webp', 0, 18);

-- Renault Sandero Stepway 2023
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Renault', 'Sandero Stepway', '1.6 16v Intense', 2023, 25970000, 40789, 'manual', 'gasolina', '1.6', '115 hp', 4, 4066, 1761, 1559, 2590, 50, 1, 'Conductor y pasajero', 1, 0, 1, 0, 'Hidráulica', 'Delantera', 0, 0, 0, 'hatchback', 'Blanco', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/renault_sandero_stepway_1_6_16v_intense_2023_40789km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/renault_sandero_stepway_1_6_16v_intense_2023_40789km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/renault_sandero_stepway_1_6_16v_intense_2023_40789km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/renault_sandero_stepway_1_6_16v_intense_2023_40789km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/renault_sandero_stepway_1_6_16v_intense_2023_40789km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/renault_sandero_stepway_1_6_16v_intense_2023_40789km_foto_07.webp', 0, 5),
(@car_id, 'uploads/cars/renault_sandero_stepway_1_6_16v_intense_2023_40789km_foto_08.webp', 0, 6),
(@car_id, 'uploads/cars/renault_sandero_stepway_1_6_16v_intense_2023_40789km_foto_09.webp', 0, 7),
(@car_id, 'uploads/cars/renault_sandero_stepway_1_6_16v_intense_2023_40789km_foto_10.webp', 0, 8),
(@car_id, 'uploads/cars/renault_sandero_stepway_1_6_16v_intense_2023_40789km_foto_11.webp', 0, 9),
(@car_id, 'uploads/cars/renault_sandero_stepway_1_6_16v_intense_2023_40789km_foto_12.webp', 0, 10),
(@car_id, 'uploads/cars/renault_sandero_stepway_1_6_16v_intense_2023_40789km_foto_13.webp', 0, 11),
(@car_id, 'uploads/cars/renault_sandero_stepway_1_6_16v_intense_2023_40789km_foto_14.webp', 0, 12),
(@car_id, 'uploads/cars/renault_sandero_stepway_1_6_16v_intense_2023_40789km_foto_15.webp', 0, 13),
(@car_id, 'uploads/cars/renault_sandero_stepway_1_6_16v_intense_2023_40789km_foto_16.webp', 0, 14),
(@car_id, 'uploads/cars/renault_sandero_stepway_1_6_16v_intense_2023_40789km_foto_17.webp', 0, 15),
(@car_id, 'uploads/cars/renault_sandero_stepway_1_6_16v_intense_2023_40789km_foto_18.webp', 0, 16),
(@car_id, 'uploads/cars/renault_sandero_stepway_1_6_16v_intense_2023_40789km_foto_19.webp', 0, 17),
(@car_id, 'uploads/cars/renault_sandero_stepway_1_6_16v_intense_2023_40789km_foto_20.webp', 0, 18);

-- Toyota Innova 2019
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Toyota', 'Innova', '2.7 Srv 6at 8a', 2019, 35770000, 93871, 'automatico', 'gasolina', '2.7', '166 hp', 4, 4735, 1830, 1795, 2750, 65, 1, 'Conductor y pasajero', 0, 0, 0, 0, 'Hidráulica', 'Delantera', 0, 0, 0, 'sedan', 'Gris', 5, 8, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/toyota_innova_2_7_srv_6at_8a_2019_93871km_foto_01.webp', 1, 0),
(@car_id, 'uploads/cars/toyota_innova_2_7_srv_6at_8a_2019_93871km_foto_02.webp', 0, 1),
(@car_id, 'uploads/cars/toyota_innova_2_7_srv_6at_8a_2019_93871km_foto_03.webp', 0, 2),
(@car_id, 'uploads/cars/toyota_innova_2_7_srv_6at_8a_2019_93871km_foto_04.webp', 0, 3),
(@car_id, 'uploads/cars/toyota_innova_2_7_srv_6at_8a_2019_93871km_foto_05.webp', 0, 4),
(@car_id, 'uploads/cars/toyota_innova_2_7_srv_6at_8a_2019_93871km_foto_06.webp', 0, 5),
(@car_id, 'uploads/cars/toyota_innova_2_7_srv_6at_8a_2019_93871km_foto_07.webp', 0, 6),
(@car_id, 'uploads/cars/toyota_innova_2_7_srv_6at_8a_2019_93871km_foto_08.webp', 0, 7),
(@car_id, 'uploads/cars/toyota_innova_2_7_srv_6at_8a_2019_93871km_foto_09.webp', 0, 8),
(@car_id, 'uploads/cars/toyota_innova_2_7_srv_6at_8a_2019_93871km_foto_10.webp', 0, 9),
(@car_id, 'uploads/cars/toyota_innova_2_7_srv_6at_8a_2019_93871km_foto_11.webp', 0, 10),
(@car_id, 'uploads/cars/toyota_innova_2_7_srv_6at_8a_2019_93871km_foto_12.webp', 0, 11),
(@car_id, 'uploads/cars/toyota_innova_2_7_srv_6at_8a_2019_93871km_foto_13.webp', 0, 12),
(@car_id, 'uploads/cars/toyota_innova_2_7_srv_6at_8a_2019_93871km_foto_14.webp', 0, 13),
(@car_id, 'uploads/cars/toyota_innova_2_7_srv_6at_8a_2019_93871km_foto_15.webp', 0, 14),
(@car_id, 'uploads/cars/toyota_innova_2_7_srv_6at_8a_2019_93871km_foto_16.webp', 0, 15),
(@car_id, 'uploads/cars/toyota_innova_2_7_srv_6at_8a_2019_93871km_foto_17.webp', 0, 16);

-- Volkswagen Gol 2013
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Volkswagen', 'Gol', '1.4 Power 83cv', 2013, 11760000, 145323, 'manual', 'gasolina', '1.4', '83 hp', 2, 3951, 1656, 1414, 2465, 51, 0, 'No', 0, 0, 0, 1, '', 'Delantera', 0, 0, 1, 'hatchback', 'Gris', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/volkswagen_gol_1_4_power_83cv_2013_145323km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/volkswagen_gol_1_4_power_83cv_2013_145323km_foto_04.webp', 0, 1),
(@car_id, 'uploads/cars/volkswagen_gol_1_4_power_83cv_2013_145323km_foto_06.webp', 0, 2),
(@car_id, 'uploads/cars/volkswagen_gol_1_4_power_83cv_2013_145323km_foto_07.webp', 0, 3),
(@car_id, 'uploads/cars/volkswagen_gol_1_4_power_83cv_2013_145323km_foto_09.webp', 0, 4),
(@car_id, 'uploads/cars/volkswagen_gol_1_4_power_83cv_2013_145323km_foto_10.webp', 0, 5),
(@car_id, 'uploads/cars/volkswagen_gol_1_4_power_83cv_2013_145323km_foto_11.webp', 0, 6),
(@car_id, 'uploads/cars/volkswagen_gol_1_4_power_83cv_2013_145323km_foto_12.webp', 0, 7),
(@car_id, 'uploads/cars/volkswagen_gol_1_4_power_83cv_2013_145323km_foto_13.webp', 0, 8),
(@car_id, 'uploads/cars/volkswagen_gol_1_4_power_83cv_2013_145323km_foto_14.webp', 0, 9),
(@car_id, 'uploads/cars/volkswagen_gol_1_4_power_83cv_2013_145323km_foto_15.webp', 0, 10),
(@car_id, 'uploads/cars/volkswagen_gol_1_4_power_83cv_2013_145323km_foto_16.webp', 0, 11),
(@car_id, 'uploads/cars/volkswagen_gol_1_4_power_83cv_2013_145323km_foto_17.webp', 0, 12),
(@car_id, 'uploads/cars/volkswagen_gol_1_4_power_83cv_2013_145323km_foto_18.webp', 0, 13),
(@car_id, 'uploads/cars/volkswagen_gol_1_4_power_83cv_2013_145323km_foto_19.webp', 0, 14),
(@car_id, 'uploads/cars/volkswagen_gol_1_4_power_83cv_2013_145323km_foto_20.webp', 0, 15),
(@car_id, 'uploads/cars/volkswagen_gol_1_4_power_83cv_2013_145323km_foto_21.webp', 0, 16);

-- Volkswagen Saveiro 2024
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Volkswagen', 'Saveiro', '1.6 Msi Trendline Cs', 2024, 27930000, 31789, 'manual', 'gasolina', '1.6', '110 hp', 2, 4474, 1890, 1520, 2753, 55, 1, 'Conductor y pasajero', 0, 0, 0, 1, 'Hidráulica', 'Delantera', 0, 0, 0, 'sedan', 'Blanco', 2, 2, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/volkswagen_saveiro_1_6_msi_trendline_cs_2024_31789km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/volkswagen_saveiro_1_6_msi_trendline_cs_2024_31789km_foto_04.webp', 0, 1),
(@car_id, 'uploads/cars/volkswagen_saveiro_1_6_msi_trendline_cs_2024_31789km_foto_07.webp', 0, 2),
(@car_id, 'uploads/cars/volkswagen_saveiro_1_6_msi_trendline_cs_2024_31789km_foto_08.webp', 0, 3),
(@car_id, 'uploads/cars/volkswagen_saveiro_1_6_msi_trendline_cs_2024_31789km_foto_10.webp', 0, 4),
(@car_id, 'uploads/cars/volkswagen_saveiro_1_6_msi_trendline_cs_2024_31789km_foto_11.webp', 0, 5),
(@car_id, 'uploads/cars/volkswagen_saveiro_1_6_msi_trendline_cs_2024_31789km_foto_12.webp', 0, 6),
(@car_id, 'uploads/cars/volkswagen_saveiro_1_6_msi_trendline_cs_2024_31789km_foto_13.webp', 0, 7),
(@car_id, 'uploads/cars/volkswagen_saveiro_1_6_msi_trendline_cs_2024_31789km_foto_14.webp', 0, 8),
(@car_id, 'uploads/cars/volkswagen_saveiro_1_6_msi_trendline_cs_2024_31789km_foto_15.webp', 0, 9),
(@car_id, 'uploads/cars/volkswagen_saveiro_1_6_msi_trendline_cs_2024_31789km_foto_16.webp', 0, 10),
(@car_id, 'uploads/cars/volkswagen_saveiro_1_6_msi_trendline_cs_2024_31789km_foto_17.webp', 0, 11),
(@car_id, 'uploads/cars/volkswagen_saveiro_1_6_msi_trendline_cs_2024_31789km_foto_18.webp', 0, 12),
(@car_id, 'uploads/cars/volkswagen_saveiro_1_6_msi_trendline_cs_2024_31789km_foto_19.webp', 0, 13),
(@car_id, 'uploads/cars/volkswagen_saveiro_1_6_msi_trendline_cs_2024_31789km_foto_20.webp', 0, 14);

-- Volkswagen Up! 2017
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Volkswagen', 'Up!', '1.0 Pepper 101cv', 2017, 18620000, 103296, 'manual', 'gasolina', '1.0', '101 hp', 4, 3605, 1645, 1500, 2421, 50, 1, 'Conductor y pasajero', 0, 1, 1, 0, 'Eléctrica', 'Delantera', 0, 1, 0, 'hatchback', 'Blanco', 5, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/volkswagen_up__1_0_pepper_101cv_2017_103296km_foto_03.webp', 1, 0),
(@car_id, 'uploads/cars/volkswagen_up__1_0_pepper_101cv_2017_103296km_foto_04.webp', 0, 1),
(@car_id, 'uploads/cars/volkswagen_up__1_0_pepper_101cv_2017_103296km_foto_07.webp', 0, 2),
(@car_id, 'uploads/cars/volkswagen_up__1_0_pepper_101cv_2017_103296km_foto_08.webp', 0, 3),
(@car_id, 'uploads/cars/volkswagen_up__1_0_pepper_101cv_2017_103296km_foto_10.webp', 0, 4),
(@car_id, 'uploads/cars/volkswagen_up__1_0_pepper_101cv_2017_103296km_foto_11.webp', 0, 5),
(@car_id, 'uploads/cars/volkswagen_up__1_0_pepper_101cv_2017_103296km_foto_12.webp', 0, 6),
(@car_id, 'uploads/cars/volkswagen_up__1_0_pepper_101cv_2017_103296km_foto_13.webp', 0, 7),
(@car_id, 'uploads/cars/volkswagen_up__1_0_pepper_101cv_2017_103296km_foto_14.webp', 0, 8),
(@car_id, 'uploads/cars/volkswagen_up__1_0_pepper_101cv_2017_103296km_foto_15.webp', 0, 9),
(@car_id, 'uploads/cars/volkswagen_up__1_0_pepper_101cv_2017_103296km_foto_16.webp', 0, 10),
(@car_id, 'uploads/cars/volkswagen_up__1_0_pepper_101cv_2017_103296km_foto_17.webp', 0, 11),
(@car_id, 'uploads/cars/volkswagen_up__1_0_pepper_101cv_2017_103296km_foto_18.webp', 0, 12),
(@car_id, 'uploads/cars/volkswagen_up__1_0_pepper_101cv_2017_103296km_foto_19.webp', 0, 13),
(@car_id, 'uploads/cars/volkswagen_up__1_0_pepper_101cv_2017_103296km_foto_20.webp', 0, 14),
(@car_id, 'uploads/cars/volkswagen_up__1_0_pepper_101cv_2017_103296km_foto_21.webp', 0, 15),
(@car_id, 'uploads/cars/volkswagen_up__1_0_pepper_101cv_2017_103296km_foto_22.webp', 0, 16);

-- Volkswagen Up! 2017
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Volkswagen', 'Up!', '1.0 Take Up! Aa 75Cv 3P', 2017, 16300000, 133486, 'manual', 'gasolina', '1.0', '75 hp', 4, 3605, 1645, 1500, 2421, 50, 1, 'Conductor y pasajero', 0, 1, 0, 0, '', 'Delantera', 0, 0, 0, 'hatchback', 'Negro', 3, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2017_133486km_foto_02.webp', 1, 0),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2017_133486km_foto_03.webp', 0, 1),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2017_133486km_foto_04.webp', 0, 2),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2017_133486km_foto_05.webp', 0, 3),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2017_133486km_foto_06.webp', 0, 4),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2017_133486km_foto_07.webp', 0, 5),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2017_133486km_foto_08.webp', 0, 6),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2017_133486km_foto_09.webp', 0, 7),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2017_133486km_foto_10.webp', 0, 8),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2017_133486km_foto_11.webp', 0, 9),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2017_133486km_foto_12.webp', 0, 10),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2017_133486km_foto_13.webp', 0, 11),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2017_133486km_foto_14.webp', 0, 12),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2017_133486km_foto_15.webp', 0, 13),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2017_133486km_foto_16.webp', 0, 14),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2017_133486km_foto_17.webp', 0, 15),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2017_133486km_foto_18.webp', 0, 16),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2017_133486km_foto_19.webp', 0, 17),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2017_133486km_foto_20.webp', 0, 18),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2017_133486km_foto_21.webp', 0, 19),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2017_133486km_foto_22.webp', 0, 20);

-- Volkswagen Up! 2018
INSERT INTO cars (brand, model, version, year, price, km, transmission, fuel, engine_size, horsepower, valves_per_cylinder, length_mm, width_mm, height_mm, wheelbase_mm, fuel_tank_liters, abs_brakes, airbags, cruise_control, air_conditioning, onboard_computer, cup_holders, steering_type, traction_control, am_fm_radio, bluetooth, mp3_player, type, color, doors, passengers, city, status, featured) VALUES ('Volkswagen', 'Up!', '1.0 Take Up! Aa 75Cv 3P', 2018, 14945000, 115882, 'manual', 'gasolina', '1.0', '75 hp', 4, 3605, 1645, 1500, 2421, 50, 1, 'Conductor y pasajero', 0, 1, 0, 0, '', 'Delantera', 0, 0, 0, 'hatchback', 'Rojo', 3, 5, 'Córdoba Capital', 'disponible', 0);
SET @car_id = LAST_INSERT_ID();
INSERT INTO car_images (car_id, image_path, is_primary, display_order) VALUES
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2018_115882km_foto_03.webp', 1, 0),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2018_115882km_foto_04.webp', 0, 1),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2018_115882km_foto_07.webp', 0, 2),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2018_115882km_foto_08.webp', 0, 3),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2018_115882km_foto_10.webp', 0, 4),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2018_115882km_foto_11.webp', 0, 5),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2018_115882km_foto_12.webp', 0, 6),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2018_115882km_foto_13.webp', 0, 7),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2018_115882km_foto_14.webp', 0, 8),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2018_115882km_foto_15.webp', 0, 9),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2018_115882km_foto_16.webp', 0, 10),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2018_115882km_foto_17.webp', 0, 11),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2018_115882km_foto_18.webp', 0, 12),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2018_115882km_foto_19.webp', 0, 13),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2018_115882km_foto_20.webp', 0, 14),
(@car_id, 'uploads/cars/volkswagen_up__1_0_take_up__aa_75cv_3p_2018_115882km_foto_21.webp', 0, 15);

