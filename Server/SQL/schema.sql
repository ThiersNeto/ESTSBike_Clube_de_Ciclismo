CREATE DATABASE IF NOT EXISTS estsbike;

DROP USER IF EXISTS 'pw_usr'@'localhost';
CREATE USER IF NOT EXISTS 'pw_usr'@'localhost' IDENTIFIED BY 'PW@20242025';
GRANT ALL PRIVILEGES ON estsbike.* TO 'pw_usr'@'localhost';
FLUSH PRIVILEGES;

USE estsbike;

DROP TABLE IF EXISTS `member_events`;
DROP TABLE IF EXISTS `member_preferred_event_types`;
DROP TABLE IF EXISTS `events`;
DROP TABLE IF EXISTS `members`;
DROP TABLE IF EXISTS `event_types`;

CREATE TABLE event_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);

CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_id INT,
    description TEXT,
    date DATE NOT NULL,
    FOREIGN KEY (type_id) REFERENCES event_types(id)
);

CREATE TABLE members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE member_preferred_event_types (
    member_id INT,
    event_type_id INT,
    PRIMARY KEY (member_id, event_type_id),
    FOREIGN KEY (member_id) REFERENCES members(id),
    FOREIGN KEY (event_type_id) REFERENCES event_types(id)
);

CREATE TABLE member_events (
    member_id INT,
    event_id INT,
    PRIMARY KEY (member_id, event_id),
    FOREIGN KEY (member_id) REFERENCES members(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);

DELETE FROM member_events;
DELETE FROM member_preferred_event_types;
DELETE FROM events;
DELETE FROM members;
DELETE FROM event_types;

INSERT INTO event_types (description) VALUES 
('Estrada'), 
('BTT'), 
('BMX'), 
('Pista'), 
('Ciclocrosse'), 
('Cicloturismo');

INSERT INTO members (name) VALUES 
('Thiers Neto'), 
('Lucas Gomes'), 
('Eduardo Vemba'), 
('Saymon Gabriel'), 
('João Silva');

INSERT INTO events (description, type_id, date) VALUES 
('Clássica da Arrábida', 1, '2025-10-15'), 
('BTT Noturno', 2, '2025-11-15'), 
('Volta a Setúbal', 1, '2025-11-01'), 
('Passeio das Vindimas', 6, '2025-09-20'), 
('Tour do Alentejo', 6, '2025-09-30'), 
('BMX Extreme Show', 3, '2025-10-05');

INSERT INTO member_preferred_event_types (member_id, event_type_id) VALUES 
(1, 1), (1, 2), 
(2, 3), (2, 4), 
(3, 5), (3, 6), 
(4, 2), (4, 4), 
(5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (5, 6);