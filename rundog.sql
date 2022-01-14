-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 11, 2022 at 03:10 PM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `running`
--

-- --------------------------------------------------------

--
-- Table structure for table `blocknumber`
--

CREATE TABLE `blocknumber` (
  `blockNumber` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `blocknumber`
--

INSERT INTO `blocknumber` (`blockNumber`) VALUES
(6497243);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `data` date NOT NULL DEFAULT current_timestamp(),
  `user` varchar(50) NOT NULL,
  `amount` float NOT NULL,
  `txhash` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `data`, `user`, `amount`, `txhash`) VALUES
(4, '2022-01-11', 'Anderson', 1.42167e16, '0x267840133cfa1b887718953c845935884b6efef34c83a8e37de1afc70d8babef'),
(5, '2022-01-11', 'Anderson', 1.51961e16, '0x399b3a5ecbe23f6f3ed977b2ac8fd37ad2a94d59eb84325a244ef4d257006dc7'),
(6, '2022-01-11', 'logan', 1.36765e16, '0x399b3a5ecbe23f6f3ed977b2ac8fd37ad2a94d59eb84325a244ef4d257006dc7'),
(7, '2022-01-11', 'logan', 1.46186e16, '0x5bd4c3ba7882f94b356bd6b6c5835e260f45c36fbb85e25485c5504b238244d8'),
(8, '2022-01-11', 'Anderson', 1.31568e16, '0x5bd4c3ba7882f94b356bd6b6c5835e260f45c36fbb85e25485c5504b238244d8');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nickname` varchar(200) NOT NULL,
  `coin` int(11) NOT NULL DEFAULT 0,
  `address` varchar(100) NOT NULL,
  `balance` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nickname`, `coin`, `address`, `balance`) VALUES
(22, 'logan', 0, '0x3D7BfB70DE6A7e1228520cD209f1404526b5Db65', 79759587),
(23, 'Anderson', 0, '0x760e0302e71A84B7a6247ee921A3e1Cbf500f65D', 193900);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
