-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 07, 2019 lúc 05:43 PM
-- Phiên bản máy phục vụ: 10.4.6-MariaDB
-- Phiên bản PHP: 7.1.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `wf_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `beacon`
--

CREATE TABLE `beacon` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `map` int(11) DEFAULT NULL,
  `bssid` varchar(17) DEFAULT NULL,
  `ssid` varchar(255) DEFAULT NULL,
  `posX` float DEFAULT NULL,
  `posY` float DEFAULT NULL,
  `a_parameter` float DEFAULT NULL,
  `n_parameter` float DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `beacon`
--

INSERT INTO `beacon` (`id`, `name`, `model`, `map`, `bssid`, `ssid`, `posX`, `posY`, `a_parameter`, `n_parameter`, `createdAt`, `updatedAt`) VALUES
(1, 'ESP_01', 'ESP8266', 1, '12:34:56:78:90:11', 'ESP_01', 0, 0, -34, 2, '2017-10-13 11:16:41', '2017-10-13 11:16:41'),
(2, 'ESP_02', 'ESP8266', 1, '11:22:33:44:55:66', 'ESP_02', 0, 7.15, -34, 2, '2017-10-13 11:17:07', '2017-10-13 11:17:07'),
(3, 'ESP_03', 'ESP8266', 1, 'ff:ff:ee:ff:ee:dd', 'ESP_03', 7.8, 0, -34, 2, '2017-10-13 11:17:29', '2017-10-13 11:17:29');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `map`
--

CREATE TABLE `map` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `width` float DEFAULT NULL,
  `height` float DEFAULT NULL,
  `map_file_path` varchar(255) DEFAULT NULL,
  `orientation` float DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `map`
--

INSERT INTO `map` (`id`, `name`, `width`, `height`, `map_file_path`, `orientation`, `createdAt`, `updatedAt`) VALUES
(1, '213B3', 7.15, 7.8, 'assets/public/map/346fd6ed-e24c-4d29-8ea9-e3ac83c08c45.png', 335.01, '2017-10-12 23:11:33', '2017-10-12 23:11:33');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rssi_collect`
--

CREATE TABLE `rssi_collect` (
  `id` int(10) UNSIGNED NOT NULL,
  `beacon` int(11) DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `rssi` float DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `rssi_collect`
--

INSERT INTO `rssi_collect` (`id`, `beacon`, `user`, `rssi`, `createdAt`, `updatedAt`) VALUES
(7, 1, 9, -45, '2019-11-07 23:27:16', '2019-11-07 23:27:16'),
(8, 2, 9, -47, '2019-11-07 23:27:16', '2019-11-07 23:27:16'),
(9, 3, 9, -47, '2019-11-07 23:27:16', '2019-11-07 23:27:16');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `map` int(11) DEFAULT NULL,
  `posX` float DEFAULT NULL,
  `posY` float DEFAULT NULL,
  `online` tinyint(1) DEFAULT NULL,
  `height` float DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `role`, `map`, `posX`, `posY`, `online`, `height`, `gender`, `createdAt`, `updatedAt`) VALUES
(9, 'Phúc Thiên', '1512555@hcmut.edu.vn', '$2a$10$bIf3OPrgAh3weWKax6gCUe.K7BwmBl0cf09W3XxGyz.85uOGthPxO', 'guest', 1, 0, 0, 1, 1.7, 'male', '2019-11-07 23:17:59', '2019-11-07 23:22:31');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `beacon`
--
ALTER TABLE `beacon`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `map`
--
ALTER TABLE `map`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `rssi_collect`
--
ALTER TABLE `rssi_collect`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `beacon`
--
ALTER TABLE `beacon`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `map`
--
ALTER TABLE `map`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `rssi_collect`
--
ALTER TABLE `rssi_collect`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
