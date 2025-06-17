-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 17, 2025 at 09:45 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sport`
--

-- --------------------------------------------------------

--
-- Table structure for table `brackets`
--

CREATE TABLE `brackets` (
  `barcketId` int(11) NOT NULL,
  `sportsId` int(11) DEFAULT NULL,
  `bracketType` varchar(255) NOT NULL,
  `isElimination` tinyint(4) DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `brackets`
--

INSERT INTO `brackets` (`barcketId`, `sportsId`, `bracketType`, `isElimination`, `createdAt`) VALUES
(1, 1, 'Single Elimination Bracket', 1, '2025-01-08 08:52:39'),
(2, 2, 'Single Elimination Bracket', 1, '2025-01-08 09:19:21'),
(3, 1, 'Single Elimination Bracket', 1, '2025-01-09 13:31:18');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `eventId` int(11) NOT NULL,
  `eventName` longtext NOT NULL,
  `eventYear` int(11) NOT NULL,
  `eventstartDate` date NOT NULL,
  `eventendDate` date NOT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `description` longtext NOT NULL,
  `createdBy` int(11) NOT NULL,
  `updatedBy` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`eventId`, `eventName`, `eventYear`, `eventstartDate`, `eventendDate`, `createdAt`, `description`, `createdBy`, `updatedBy`) VALUES
(1, 'NCF Intramurals 2024', 2025, '2025-02-15', '2025-02-18', '2025-01-08 08:50:38', '<p>undefined</p>', 2, 2),
(2, 'Intramurals 2025', 0, '2025-01-09', '2025-01-09', '2025-01-09 13:13:41', 'undefined', 2, 0),
(3, 'Intramurals 2024', 0, '2025-01-09', '2025-01-09', '2025-01-09 13:38:00', 'undefined', 2, 0),
(4, 'Intramurals 2026', 0, '2025-01-09', '2025-01-09', '2025-01-09 13:40:10', '', 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `matches`
--

CREATE TABLE `matches` (
  `matchId` int(11) NOT NULL,
  `sportEventsId` int(11) DEFAULT NULL,
  `bracketId` int(11) DEFAULT NULL,
  `round` int(11) NOT NULL,
  `team1Id` int(11) UNSIGNED DEFAULT NULL,
  `team2Id` int(11) UNSIGNED DEFAULT NULL,
  `status` enum('scheduled','ongoing','completed','pending') NOT NULL DEFAULT 'pending',
  `winner_team_id` int(11) UNSIGNED NOT NULL,
  `schedule` datetime DEFAULT NULL,
  `completedAt` datetime DEFAULT NULL,
  `isFinal` tinyint(4) DEFAULT 0,
  `next_match_id` int(11) DEFAULT NULL,
  `loser_next_match_id` int(11) DEFAULT NULL,
  `team1Score` int(11) DEFAULT 0,
  `team2Score` int(11) DEFAULT 0,
  `roundType` enum('round1','quarterfinals','semifinals','finals') DEFAULT NULL,
  `bracketType` enum('winners','losers','final_rematch','final') DEFAULT NULL,
  `eliminationStage` tinyint(4) DEFAULT NULL,
  `venue` longtext DEFAULT NULL,
  `team1stat` varchar(255) DEFAULT NULL,
  `team2stat` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `matches`
--

INSERT INTO `matches` (`matchId`, `sportEventsId`, `bracketId`, `round`, `team1Id`, `team2Id`, `status`, `winner_team_id`, `schedule`, `completedAt`, `isFinal`, `next_match_id`, `loser_next_match_id`, `team1Score`, `team2Score`, `roundType`, `bracketType`, `eliminationStage`, `venue`, `team1stat`, `team2stat`) VALUES
(1, 1, 1, 1, 1, 2, 'completed', 1, '2025-01-08 08:52:27', NULL, 0, 5, NULL, 3, 0, NULL, NULL, NULL, 'Court', NULL, NULL),
(2, 1, 1, 1, 3, 4, 'completed', 3, '2025-01-08 08:52:29', NULL, 0, 5, NULL, 3, 0, NULL, NULL, NULL, 'Court', NULL, NULL),
(3, 1, 1, 1, 5, 6, 'completed', 5, '2025-01-09 20:59:53', NULL, 0, 6, NULL, 3, 2, NULL, NULL, NULL, 'Court', NULL, NULL),
(4, 1, 1, 1, 7, 8, 'pending', 0, NULL, NULL, 0, 6, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 1, 1, 2, 1, 3, 'pending', 0, NULL, NULL, 0, 7, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 1, 1, 2, 5, NULL, 'pending', 0, NULL, NULL, 0, 7, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 1, 1, 3, NULL, NULL, 'pending', 0, NULL, NULL, 1, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 2, 2, 1, 1, 2, 'completed', 1, '2025-01-08 09:18:50', NULL, 0, 12, NULL, 3, 0, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 2, 2, 1, 3, 4, 'pending', 0, '2025-01-08 09:18:53', NULL, 0, 12, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 2, 2, 1, 5, 6, 'pending', 0, '2025-01-08 09:18:55', NULL, 0, 13, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 2, 2, 1, 7, 8, 'completed', 7, '2025-01-08 09:18:57', NULL, 0, 13, NULL, 6, 0, NULL, NULL, NULL, NULL, NULL, NULL),
(12, 2, 2, 2, 1, NULL, 'pending', 0, NULL, NULL, 0, 14, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL),
(13, 2, 2, 2, 7, NULL, 'pending', 0, NULL, NULL, 0, 14, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL),
(14, 2, 2, 3, NULL, NULL, 'pending', 0, NULL, NULL, 1, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL),
(15, 3, 3, 1, 1, 2, 'scheduled', 0, '2025-01-09 22:56:24', NULL, 0, 19, NULL, 0, 0, NULL, NULL, NULL, 'Court', NULL, NULL),
(16, 3, 3, 1, 3, 4, 'pending', 0, NULL, NULL, 0, 19, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL),
(17, 3, 3, 1, 5, 6, 'pending', 0, NULL, NULL, 0, 20, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL),
(18, 3, 3, 1, 7, 8, 'pending', 0, NULL, NULL, 0, 20, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL),
(19, 3, 3, 2, NULL, NULL, 'pending', 0, NULL, NULL, 0, 21, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL),
(20, 3, 3, 2, NULL, NULL, 'pending', 0, NULL, NULL, 0, 21, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL),
(21, 3, 3, 3, NULL, NULL, 'pending', 0, NULL, NULL, 1, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `mediaId` int(11) NOT NULL,
  `url` longtext NOT NULL,
  `type` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `title` longtext DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `players`
--

CREATE TABLE `players` (
  `playerId` int(11) NOT NULL,
  `teamEventId` int(11) DEFAULT NULL,
  `playerName` longtext NOT NULL,
  `medicalCertificate` longtext NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `remarks` text DEFAULT NULL,
  `addedBy` int(11) DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `createdAt` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `players`
--

INSERT INTO `players` (`playerId`, `teamEventId`, `playerName`, `medicalCertificate`, `status`, `remarks`, `addedBy`, `updatedBy`, `updatedAt`, `createdAt`) VALUES
(1, 1, 'Naps', 'https://ik.imagekit.io/ghqmiuwd9/1750146250926_1739256469816_Free-Medical-Certificate-Template_78SpU2Vgy_lMGx_q8TE.jpg', 'pending', NULL, NULL, NULL, '2025-06-17 07:44:13', '2025-01-08 11:08:47'),
(2, 1, 'Naps11', 'https://ik.imagekit.io/ghqmiuwd9/1750146262291_1739256469816_Free-Medical-Certificate-Template_78SpU2Vgy_kbiothvb_.jpg', 'pending', NULL, NULL, NULL, '2025-06-17 07:44:24', '2025-02-11 06:47:52');

-- --------------------------------------------------------

--
-- Table structure for table `sports`
--

CREATE TABLE `sports` (
  `sportsId` int(11) NOT NULL,
  `sportsName` longtext NOT NULL,
  `sportsLogo` longtext NOT NULL,
  `description` longtext NOT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `createdBy` int(11) DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sports`
--

INSERT INTO `sports` (`sportsId`, `sportsName`, `sportsLogo`, `description`, `createdAt`, `createdBy`, `updatedBy`) VALUES
(1, 'Basketball-M', 'https://ik.imagekit.io/ghqmiuwd9/1750141266690_basketball_j18EMcdqY.png', '<p>Basketball Men\'s Category</p>', '2024-12-16 11:18:47', 1, 1),
(2, 'Basketball-W', 'https://ik.imagekit.io/ghqmiuwd9/1750145237967_basketball_aQ1MCam8l.png', '<p>Basketball Women\'s Category</p>', '2024-12-16 11:19:22', 1, 1),
(3, 'Volleyball-M', 'https://ik.imagekit.io/ghqmiuwd9/1750145250268_volleyball_Wo91iLKGB.png', '<p>Volleyball Men\'s Category</p>', '2024-12-16 11:19:45', 1, 1),
(4, 'Volleyball-W', 'https://ik.imagekit.io/ghqmiuwd9/1750145265912_volleyball_QdfGbeams.png', '<p>Volleyball Women\'s Category</p>', '2024-12-16 11:20:15', 1, 1),
(5, 'Badminton-M', 'https://ik.imagekit.io/ghqmiuwd9/1750145621933_badminton-racket-icon-free-vector-removebg-preview_M7XBIpNxL.png', '<p>Badminton Men\'s Category</p>', '2024-12-16 11:21:14', 1, 1),
(6, 'Badminton-W', 'https://ik.imagekit.io/ghqmiuwd9/1750145639394_badminton-racket-icon-free-vector-removebg-preview_h9LDadw-u.png', '<p>Badminton Women\'s Category</p>', '2024-12-16 11:21:47', 1, 1),
(7, 'Table Tennis-M', 'https://ik.imagekit.io/ghqmiuwd9/1750145739331_image_2025-06-17_153459784-removebg-preview__1__WiZEoS3N5.png', '<p>Table Tennis Men\'s Category</p>', '2024-12-16 11:22:13', 1, 1),
(8, 'Table Tennis-W', 'https://ik.imagekit.io/ghqmiuwd9/1750145778638_image_2025-06-17_153459784-removebg-preview_ZApYuTf4X.png', '<p>Table Tennis Women\'s Category</p>', '2024-12-16 11:22:38', 1, 1),
(9, 'Sepak Takraw-M', 'https://ik.imagekit.io/ghqmiuwd9/1750145817248_image_2025-06-17_153638920-removebg-preview_OGkipXzkU.png', '<p>Sepak Takraw Men\'s Category</p>', '2024-12-16 11:23:11', 1, 1),
(10, 'Chess-M', 'https://ik.imagekit.io/ghqmiuwd9/1750145916944_image_2025-06-17_153818902-removebg-preview__y6YDtDMZ.png', '<p>Chess Men\'s Category</p>', '2024-12-16 11:23:43', 1, 1),
(11, 'Chess-W', 'https://ik.imagekit.io/ghqmiuwd9/1750145923425_image_2025-06-17_153818902-removebg-preview_sAZDUmSdK.png', '<p>Chess Women\'s Category</p>', '2024-12-16 11:24:09', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `sports_events`
--

CREATE TABLE `sports_events` (
  `sportEventsId` int(11) NOT NULL,
  `sportsId` int(11) DEFAULT NULL,
  `eventsId` int(11) DEFAULT NULL,
  `bracketType` varchar(255) DEFAULT NULL,
  `coachId` int(11) DEFAULT NULL,
  `maxPlayers` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sports_events`
--

INSERT INTO `sports_events` (`sportEventsId`, `sportsId`, `eventsId`, `bracketType`, `coachId`, `maxPlayers`) VALUES
(1, 1, 1, 'Single Elimination', NULL, 15),
(2, 2, 1, 'Single Elimination', NULL, 15),
(3, 1, 2, 'Single Elimination', NULL, 15);

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `teamId` int(10) UNSIGNED NOT NULL,
  `teamName` longtext NOT NULL,
  `teamLogo` longtext DEFAULT NULL,
  `teamCoach` int(11) NOT NULL,
  `dateAdded` timestamp NULL DEFAULT current_timestamp(),
  `addedBy` int(11) DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`teamId`, `teamName`, `teamLogo`, `teamCoach`, `dateAdded`, `addedBy`, `updatedBy`) VALUES
(1, 'College of Computer Study', 'https://ik.imagekit.io/ghqmiuwd9/1750145954783_ccs_zRYHGSqBs.png', 3, '2024-12-16 11:28:03', 1, 1),
(2, 'College of Art and Science', 'https://ik.imagekit.io/ghqmiuwd9/1750145969986_cas_5vgixclGl.jpg', 3, '2024-12-16 11:28:32', 1, 1),
(3, 'College of Criminal Justice Education', 'https://ik.imagekit.io/ghqmiuwd9/1750145986218_ccje_9-EWKpLez.jpg', 4, '2024-12-16 11:28:57', 1, 1),
(4, 'College of Teacher Education', 'https://ik.imagekit.io/ghqmiuwd9/1750146006703_cted_uONPcDRoj.jpg', 5, '2024-12-16 11:29:23', 1, 1),
(5, 'College of Accountancy and Finance', 'https://ik.imagekit.io/ghqmiuwd9/1750146054930_caf_QTs_6b1ut.jpg', 6, '2024-12-16 11:29:38', 1, 1),
(6, 'College of Health Science', 'https://ik.imagekit.io/ghqmiuwd9/1750146071624_chs_6A-g5B83A.jpg', 7, '2024-12-16 11:29:59', 1, 1),
(7, 'College of Engineering', 'https://ik.imagekit.io/ghqmiuwd9/1750146102910_coe_gINS-hJaa.png', 8, '2024-12-16 11:30:20', 1, 1),
(8, 'College of Business Management', 'https://ik.imagekit.io/ghqmiuwd9/1750146117703_cbm_ciy4EO9zA.jpg', 9, '2024-12-16 11:30:38', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `teams_events`
--

CREATE TABLE `teams_events` (
  `teamEventId` int(11) NOT NULL,
  `sportEventsId` int(11) DEFAULT NULL,
  `teamName` varchar(255) NOT NULL,
  `teamId` int(10) UNSIGNED DEFAULT NULL,
  `coachId` int(11) DEFAULT NULL,
  `teamWin` int(11) DEFAULT 0,
  `teamLose` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teams_events`
--

INSERT INTO `teams_events` (`teamEventId`, `sportEventsId`, `teamName`, `teamId`, `coachId`, `teamWin`, `teamLose`) VALUES
(1, 1, 'College of Computer Study', 1, 3, 1, 0),
(2, 1, 'College of Art and Science', 2, 4, 0, 1),
(3, 1, 'College of Criminal Justice Education', 3, 5, 1, 0),
(4, 1, 'College of Teacher Education', 4, 6, 0, 1),
(5, 1, 'College of Accountancy and Finance', 5, 7, 1, 0),
(6, 1, 'College of Health Science', 6, 8, 0, 1),
(7, 1, 'College of Engineering', 7, 9, 0, 0),
(8, 1, 'College of Business Management', 8, 10, 0, 0),
(9, 2, 'College of Computer Study', 1, 3, 1, 0),
(10, 2, 'College of Art and Science', 2, 4, 0, 1),
(11, 2, 'College of Criminal Justice Education', 3, 5, 0, 0),
(12, 2, 'College of Teacher Education', 4, 6, 0, 0),
(13, 2, 'College of Accountancy and Finance', 5, 7, 0, 0),
(14, 2, 'College of Health Science', 6, 8, 0, 0),
(15, 2, 'College of Engineering', 7, 9, 1, 0),
(16, 2, 'College of Business Management', 8, 10, 0, 1),
(17, 3, 'College of Computer Study', 1, 3, 0, 0),
(18, 3, 'College of Art and Science', 2, 4, 0, 0),
(19, 3, 'College of Criminal Justice Education', 3, 5, 0, 0),
(20, 3, 'College of Teacher Education', 4, 6, 0, 0),
(21, 3, 'College of Accountancy and Finance', 5, 7, 0, 0),
(22, 3, 'College of Health Science', 6, 8, 0, 0),
(23, 3, 'College of Engineering', 7, 9, 0, 0),
(24, 3, 'College of Business Management', 8, 10, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` longtext NOT NULL,
  `type` varchar(255) NOT NULL,
  `teamId` int(11) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `addedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `type`, `teamId`, `status`, `addedBy`) VALUES
(1, 'SuperAdmin', '$2y$10$MYhsfPGpO/PmQDho3CS.ausBok58jWQ93iMumRLr3JkqGm22z3z5K', 'SuperAdmin', NULL, 'Active', NULL),
(2, 'Admin', '$2a$10$uFDEBcFw.OYdpPnX0FBvCuVwKTlmI/iqw5K5Jz/x/iJqVnZmu8vYe', 'Admin', NULL, 'Active', 1),
(3, 'CCS', '$2a$10$arDswbpBstjGKlzPfURIAuaMFtRBEJdeH8JVn3I3h.bGCHmHGKdM.', 'Coach', NULL, 'Active', 1),
(4, 'CAS', '$2a$10$.3P2to.JTJ9Y4UE8higzn.WvvxRKoZnMSPVEsyT5W0B4vz95H32PG', 'Coach', NULL, 'Active', 1),
(5, 'CCJE', '$2a$10$SisrhCaDJG7Zv8ApbYBHU.u9ROJGDABY3PBRJj25uJ0UZtzS8CMiW', 'Coach', NULL, 'Active', 1),
(6, 'CTED', '$2a$10$j.x/ns/CaEfLK5Fad9RpQOMer4J4Fhhz8cnLCV0DTIP6zkn7MukYW', 'Coach', NULL, 'Active', 1),
(7, 'CAF', '$2a$10$2EbhKQjTBG3IV.Zms1nTG.uQ6715CesXX9zAODb6f6.42rz5b3Scy', 'Coach', NULL, 'Active', 1),
(8, 'CHS', '$2a$10$K1NGXFoQrYRPw3zjgCGOEu3mivoEOXqKiBzcalZDTqi7hGgh9Jn8y', 'Coach', NULL, 'Active', 1),
(9, 'COE', '$2a$10$z/jN7pV5lywv1r9BCVRYhOkJKiylonUE2mNS/x64diTZn0pbuTzjK', 'Coach', NULL, 'Active', 1),
(10, 'CBM', '$2a$10$nUV2aJDGSODllsq42ipl..8ipLBzQzhESD7AXoy5emklnqRSwoWVi', 'Coach', NULL, 'Active', 1),
(11, 'PNP', '$2a$10$jpFgKyynqjjy3dNzPZLaKeqI8foIc8mdpt3ys11fSorSIYcnnUJ8m', 'Admin', NULL, 'Active', 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `brackets`
--
ALTER TABLE `brackets`
  ADD PRIMARY KEY (`barcketId`),
  ADD KEY `fk_bSprtEv_idx` (`sportsId`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`eventId`),
  ADD KEY `fk_userBy_idx` (`createdBy`),
  ADD KEY `fk_usersID_idx` (`createdBy`),
  ADD KEY `fk_eusers_idx` (`createdBy`,`updatedBy`);

--
-- Indexes for table `matches`
--
ALTER TABLE `matches`
  ADD PRIMARY KEY (`matchId`),
  ADD KEY `fk_msportEvent_idx` (`sportEventsId`),
  ADD KEY `fk_mteamID_idx` (`team1Id`,`team2Id`),
  ADD KEY `fk_mwinTeam_idx` (`winner_team_id`),
  ADD KEY `fk_mteamID2_idx` (`team2Id`,`winner_team_id`),
  ADD KEY `fk_mBracket_idx` (`bracketId`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`mediaId`);

--
-- Indexes for table `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`playerId`),
  ADD KEY `fk_pTeamEv_idx` (`teamEventId`);

--
-- Indexes for table `sports`
--
ALTER TABLE `sports`
  ADD PRIMARY KEY (`sportsId`),
  ADD KEY `fk_sUsers_idx` (`createdBy`);

--
-- Indexes for table `sports_events`
--
ALTER TABLE `sports_events`
  ADD PRIMARY KEY (`sportEventsId`),
  ADD KEY `fk_seEvent_idx` (`eventsId`),
  ADD KEY `fk_seSport_idx` (`sportsId`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`teamId`),
  ADD KEY `fk_tUsers_idx` (`addedBy`);

--
-- Indexes for table `teams_events`
--
ALTER TABLE `teams_events`
  ADD PRIMARY KEY (`teamEventId`),
  ADD KEY `fk_teTeam_idx` (`teamId`),
  ADD KEY `fk_teUser_idx` (`coachId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `brackets`
--
ALTER TABLE `brackets`
  MODIFY `barcketId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `eventId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `matches`
--
ALTER TABLE `matches`
  MODIFY `matchId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `mediaId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `players`
--
ALTER TABLE `players`
  MODIFY `playerId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sports`
--
ALTER TABLE `sports`
  MODIFY `sportsId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `sports_events`
--
ALTER TABLE `sports_events`
  MODIFY `sportEventsId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `teamId` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `teams_events`
--
ALTER TABLE `teams_events`
  MODIFY `teamEventId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `brackets`
--
ALTER TABLE `brackets`
  ADD CONSTRAINT `fk_bSprtEv` FOREIGN KEY (`sportsId`) REFERENCES `sports_events` (`sportEventsId`) ON UPDATE NO ACTION;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `fk_eusers` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON UPDATE NO ACTION;

--
-- Constraints for table `matches`
--
ALTER TABLE `matches`
  ADD CONSTRAINT `fk_mBracket` FOREIGN KEY (`bracketId`) REFERENCES `brackets` (`barcketId`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_mTeam1` FOREIGN KEY (`team1Id`) REFERENCES `teams_events` (`teamId`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_mTeam2` FOREIGN KEY (`team2Id`) REFERENCES `teams_events` (`teamId`) ON UPDATE NO ACTION;

--
-- Constraints for table `players`
--
ALTER TABLE `players`
  ADD CONSTRAINT `fk_pTeamEv` FOREIGN KEY (`teamEventId`) REFERENCES `teams_events` (`teamEventId`) ON UPDATE NO ACTION;

--
-- Constraints for table `sports`
--
ALTER TABLE `sports`
  ADD CONSTRAINT `fk_sUsers` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON UPDATE NO ACTION;

--
-- Constraints for table `sports_events`
--
ALTER TABLE `sports_events`
  ADD CONSTRAINT `fk_seEvent` FOREIGN KEY (`eventsId`) REFERENCES `events` (`eventId`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_seSport` FOREIGN KEY (`sportsId`) REFERENCES `sports` (`sportsId`) ON UPDATE NO ACTION;

--
-- Constraints for table `teams`
--
ALTER TABLE `teams`
  ADD CONSTRAINT `fk_tUsers` FOREIGN KEY (`addedBy`) REFERENCES `users` (`id`) ON UPDATE NO ACTION;

--
-- Constraints for table `teams_events`
--
ALTER TABLE `teams_events`
  ADD CONSTRAINT `fk_teTeam` FOREIGN KEY (`teamId`) REFERENCES `teams` (`teamId`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_teUser` FOREIGN KEY (`coachId`) REFERENCES `users` (`id`) ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
