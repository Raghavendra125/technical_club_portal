use technical_club;

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    usn VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);


CREATE TABLE admins (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(10) NOT NULL,
    PRIMARY KEY (id)
);



-- Create table for storing quiz scores with user reference
CREATE TABLE quiz_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    accuracy DECIMAL(5,2),
    attempted_questions INT,
    completion_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
 -- create tables for discussion prompts
CREATE TABLE prompts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      question TEXT NOT NULL
    );
CREATE TABLE responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prompt_id INT NOT NULL,
    user_id INT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prompt_id) REFERENCES prompts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO prompts (question) VALUES
('What are your thoughts on improving quiz engagement and participation?'),
('How can coding assessments be made more inclusive for beginners?'),
('What features would enhance the template creation experience?'),
('Which topics should we prioritize for the "Learn" section videos?'),
('How can we make discussion prompts more engaging for users?');