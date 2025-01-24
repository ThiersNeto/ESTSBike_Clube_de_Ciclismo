CREATE DATABASE IF NOT EXISTS estsbike;
CREATE USER IF NOT EXISTS pw_usr IDENTIFIED BY 'PW@20242025';
GRANT ALL ON estsbike.* TO pw_usr;

USE estsbike;

DROP TABLE IF EXISTS `event_types`;
DROP TABLE IF EXISTS `events`;
DROP TABLE IF EXISTS `members`;
DROP TABLE IF EXISTS `member_event_types`;
DROP TABLE IF EXISTS `member_events`;

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