-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-12-2025 a las 13:39:16
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `recetario`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recetas`
--

CREATE TABLE `recetas` (
  `codigo` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `ingredientes` text NOT NULL,
  `pasos` text NOT NULL,
  `tiempo_preparacion` int(11) NOT NULL DEFAULT 0,
  `dificultad` varchar(20) NOT NULL DEFAULT 'fácil'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `recetas`
--

INSERT INTO `recetas` (`codigo`, `nombre`, `ingredientes`, `pasos`, `tiempo_preparacion`, `dificultad`) VALUES
(1, 'Tortilla de patatas', 'Patatas, huevos, sal, aceite', '1. Pelar patatas. 2. Freír patatas. 3. Batir huevos y mezclar. 4. Cocinar en sartén.', 30, 'fácil'),
(2, 'Espaguetis a la carbonara', 'Espaguetis, huevo, queso parmesano, panceta, pimienta negra, sal.', '1. Cocer los espaguetis en agua con sal.\r\n\r\n2. Freír la panceta hasta que esté dorada.\r\n\r\n3. Batir los huevos con el queso parmesano y un poco de pimienta.\r\n\r\n4. Escurrir los espaguetis y mezclarlos con la panceta caliente.\r\n\r\n5. Añadir la mezcla de huevo y queso y remover rápidamente para que no se cuaje.\r\n\r\n6. Servir caliente con más queso rallado y pimienta al gusto.', 20, 'fácil'),
(3, 'Gazpacho', 'Tomate, pepino, pimiento, cebolla, ajo, aceite, vinagre, sal', '1. Pelar y cortar verduras. 2. Triturar todo. 3. Refrigerar antes de servir.', 15, 'fácil'),
(4, 'Pollo al curry', 'Pollo, cebolla, ajo, curry, leche de coco, aceite, sal', '1. Dorar cebolla y ajo. 2. Añadir pollo. 3. Agregar curry y leche de coco. 4. Cocinar hasta que el pollo esté hecho.', 40, 'media'),
(5, 'Ensalada César', 'Lechuga, pollo a la plancha, queso parmesano, croutons, salsa César', '1. Lavar lechuga. 2. Cortar pollo y dorar. 3. Mezclar todos los ingredientes con salsa César.', 20, 'fácil'),
(6, 'Lasaña de carne', 'Carne picada, pasta para lasaña, tomate, bechamel, queso rallado, aceite, sal', '1. Cocinar la carne con tomate. 2. Montar capas de pasta, carne y bechamel. 3. Hornear 30 minutos.', 60, 'media'),
(7, 'Brownies de chocolate', 'Chocolate negro, mantequilla, azúcar, huevos, harina, nueces', '1. Derretir chocolate y mantequilla. 2. Mezclar con azúcar y huevos. 3. Añadir harina y nueces. 4. Hornear 25-30 minutos.', 45, 'media');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `recetas`
--
ALTER TABLE `recetas`
  ADD PRIMARY KEY (`codigo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `recetas`
--
ALTER TABLE `recetas`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
