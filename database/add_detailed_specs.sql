-- Migration script to add detailed technical specifications to cars table
-- Run this after the base schema.sql

USE takeoffauto_db;

-- Add version and basic info
ALTER TABLE cars 
ADD COLUMN version VARCHAR(100) AFTER model,
ADD COLUMN doors TINYINT AFTER color,
ADD COLUMN passengers TINYINT AFTER doors;

-- Add engine specifications
ALTER TABLE cars
ADD COLUMN engine_size VARCHAR(20) AFTER fuel,
ADD COLUMN horsepower VARCHAR(20) AFTER engine_size,
ADD COLUMN valves_per_cylinder TINYINT AFTER horsepower;

-- Add dimensions (in millimeters)
ALTER TABLE cars
ADD COLUMN length_mm INT AFTER valves_per_cylinder,
ADD COLUMN width_mm INT AFTER length_mm,
ADD COLUMN height_mm INT AFTER width_mm,
ADD COLUMN wheelbase_mm INT AFTER height_mm;

-- Add fuel capacity
ALTER TABLE cars
ADD COLUMN fuel_tank_liters INT AFTER wheelbase_mm;

-- Add safety features
ALTER TABLE cars
ADD COLUMN abs_brakes BOOLEAN DEFAULT FALSE AFTER fuel_tank_liters,
ADD COLUMN airbags VARCHAR(100) AFTER abs_brakes;

-- Add comfort features
ALTER TABLE cars
ADD COLUMN cruise_control BOOLEAN DEFAULT FALSE AFTER airbags,
ADD COLUMN air_conditioning BOOLEAN DEFAULT FALSE AFTER cruise_control,
ADD COLUMN onboard_computer BOOLEAN DEFAULT FALSE AFTER air_conditioning,
ADD COLUMN cup_holders BOOLEAN DEFAULT FALSE AFTER onboard_computer,
ADD COLUMN steering_type VARCHAR(50) AFTER cup_holders,
ADD COLUMN traction_control VARCHAR(50) AFTER steering_type;

-- Add entertainment features
ALTER TABLE cars
ADD COLUMN am_fm_radio BOOLEAN DEFAULT FALSE AFTER traction_control,
ADD COLUMN bluetooth BOOLEAN DEFAULT FALSE AFTER am_fm_radio,
ADD COLUMN mp3_player BOOLEAN DEFAULT FALSE AFTER bluetooth;

-- Verify the changes
SHOW COLUMNS FROM cars;
