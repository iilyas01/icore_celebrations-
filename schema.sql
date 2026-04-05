CREATE DATABASE ICORE_CELEBRATIONS;
USE ICORE_CELEBRATIONS;

-- USERS
CREATE TABLE USERS (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer','admin') NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- THEMES
CREATE TABLE THEMES (
    theme_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255) NOT NULL
);

-- VENUES
CREATE TABLE VENUES (
    venue_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(255) NOT NULL,
    price_per_day DECIMAL(10,2) NOT NULL,
    vendor_link VARCHAR(255),
    capacity INT NOT NULL
);
-- SERVICES
CREATE TABLE SERVICES (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    estimated_price DECIMAL(10,2) NOT NULL,
    vendor_link VARCHAR(255)
);
-- PACKAGES
CREATE TABLE PACKAGES (
    package_id INT AUTO_INCREMENT PRIMARY KEY,
    theme_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (theme_id) REFERENCES THEMES(theme_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
-- PLANS
CREATE TABLE PLANS (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    theme_id INT NOT NULL,
    venue_id INT NOT NULL,
    event_date DATE NOT NULL,
    guest_count INT NOT NULL,
    total_estimate DECIMAL(10,2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (theme_id) REFERENCES THEMES(theme_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (venue_id) REFERENCES VENUES(venue_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
-- PLAN_PACKAGES 
CREATE TABLE PLAN_PACKAGES (
    plan_id INT NOT NULL,
    package_id INT NOT NULL,
    quantity INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (plan_id, package_id),
    FOREIGN KEY (plan_id) REFERENCES PLANS(plan_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (package_id) REFERENCES PACKAGES(package_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
-- PLAN_SERVICES 
CREATE TABLE PLAN_SERVICES (
    plan_service_id INT AUTO_INCREMENT PRIMARY KEY,
    plan_id INT NOT NULL,
    service_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (plan_id) REFERENCES PLANS(plan_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (service_id) REFERENCES SERVICES(service_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
-- ORDERS
CREATE TABLE ORDERS (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    plan_id INT NOT NULL,
    user_id INT NOT NULL,
    order_status ENUM('pending','confirmed','cancelled') NOT NULL,
    payment_status ENUM('paid','unpaid','refunded') NOT NULL,
    submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES PLANS(plan_id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id)
        ON DELETE CASCADE
);
-- ORDER_APPROVALS
CREATE TABLE ORDER_APPROVALS (
    approval_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    decision ENUM('approved','rejected') NOT NULL,
    decided_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES ORDERS(order_id)
        ON DELETE CASCADE
);
SHOW TABLES;

INSERT INTO SERVICES (name, category, estimated_price, vendor_link) VALUES
-- CAKE VENDORS
('Sweet Karma Desserts', 'Custom Cakes', 150.00, 'https://sweetkarmadesserts.com'), 
('Campbell\'s Bakery', 'Custom Cakes', 120.00, 'https://campbellsbakeryli.com'),
('Sweet Dreams NY', 'Dessert Tables', 300.00, 'https://sweetdreamsny.com'),
('Nita\'s Pastries', 'Custom Cakes', 100.00, 'https://nitaspastries.com'),

-- CATERING VENDORS
('Uncle Giuseppe\'s Marketplace Catering', 'Catering', 250.00, 'https://uncleg.com/catering'),
('Mannino\'s Italian Kitchen & Lounge', 'Catering', 400.00, 'https://manninosrestaurant.com'),

-- ENTERTAINMENT
('Clowns.com', 'Clown Entertainment', 250.00, 'https://clowns.com'),
('Magic of Amore', 'Magician', 250.00, 'https://magicofamore.com'),
('Face Art by Melissa', 'Face Painting', 150.00, 'https://faceartbymelissa.com'),
('Marc Solomon Photography', 'Photography', 1000.00, 'https://marcsolomonphoto.com'),

-- DECOR & BALLOONS
('Balloon Artistry LI', 'Balloon Decor', 180.00, 'https://balloonartistry.com'),
('Dream Events NY', 'Birthday Decor', 400.00, 'https://dreameventsny.com'),
('Party City', 'Party Supplies', 100.00, 'https://partycity.com'),

-- FOOD TRUCKS
('Island Empanada Food Truck', 'Food Truck Catering', 500.00, 'https://islandempanada.com'),
('Long Island Pizza Truck', 'Pizza Catering', 700.00, 'https://longislandpizzatruck.com'),

-- Bounce Houses & Inflatables
('Dave\'s Bounce & Play', 'Bounce House Rental', 250.00, 'https://davesbounceandplay.com'); 

SELECT * FROM SERVICES;

INSERT INTO VENUES (name, location, price_per_day, vendor_link, capacity) VALUES

('My Gym Children\'s Fitness Center - Stony Brook', 'Stony Brook, NY', 450.00, 'https://www.mygym.com/stonybrook', 40),

('Social Play Haus', '200 Express St, Plainview, NY', 900.00, 'https://www.socialplayhaus.com', 80),

('Bowlero Commack', '2183 Jericho Turnpike, Commack, NY', 1500.00, 'https://www.bowlero.com/location/bowlero-commack', 200),

('Dave & Buster\'s Islandia', '1856 Veterans Memorial Hwy, Islandia, NY', 2000.00, 'https://www.daveandbusters.com/locations/islandia', 250),

('Hibernian Hall', '85 Grand Ave, Massapequa, NY', 550.00, 'https://www.aohdiv15.com', 100),

('The Party Lab Long Island', '3728 Park Ave, Wantagh, NY', 850.00, 'https://partylablongisland.com', 60);

SELECT * FROM VENUES;

INSERT INTO THEMES (name, description, image_url) VALUES

('Superhero Adventure', 'A vibrant superhero-themed celebration featuring capes, masks, and action-packed decor.', 'https://i.pinimg.com/1200x/58/57/66/5857660f0428c591abc10995f8c4ddf2.jpg'),
('Princess Castle', 'A magical princess castle theme with royal decorations and fairy-tale elements.', 'https://i.pinimg.com/1200x/6d/fc/66/6dfc6665c5d42766720f304a64222465.jpg'),
('Dinosaur World', 'A prehistoric dinosaur adventure with jungle props and dino figurines.', 'https://i.pinimg.com/1200x/fd/01/c2/fd01c20d72820d178e41def6c0ca32bd.jpg'),
('Space Galaxy', 'A cosmic space-themed party with planets, astronauts, and glowing stars.', 'https://i.pinimg.com/1200x/cd/fd/bd/cdfdbd152ca5f359cbe4de33394663dd.jpg'),
('Under the Sea', 'An ocean-themed celebration with mermaids, fish, and underwater scenery.', 'https://i.pinimg.com/736x/05/59/88/0559881984505fee5c15f33049c013ff.jpg'),
('Jungle Safari', 'A wild safari adventure with animal prints, greenery, and explorer props.', 'https://i.pinimg.com/1200x/1c/b9/64/1cb964025d72e798e5002c6e216995f9.jpg'),
('Cartoon Carnival', 'A colorful cartoon-inspired theme with fun characters and playful decor.', 'https://i.pinimg.com/1200x/0a/54/cc/0a54cc596711b4dd9668466eec5048b7.jpg'),
('Construction Zone', 'A builder-themed party with trucks, cones, and construction props.', 'https://i.pinimg.com/1200x/4b/e9/59/4be9594a7f3c33b4491f19a89c76a67a.jpg'),
('Fairy Garden', 'A whimsical fairy garden theme with flowers, wings, and magical lights.', 'https://i.pinimg.com/1200x/0e/0b/3a/0e0b3aecd465690db222d4ab769c1c56.jpg'),
('Neon Glow Party', 'A high-energy neon and UV glow party with vibrant lighting effects.', 'https://i.pinimg.com/1200x/b4/9a/98/b49a98662d4123a23d5510a86e8f59b9.jpg'),
('K-Pop Dance Night', 'A trendy K-pop inspired theme with music, lights, and dance vibes.', 'https://i.pinimg.com/1200x/e8/c8/1e/e8c81e47e6225ce40835ce7ce3f8c62e.jpg'),
('Gaming Arena', 'A gamer-themed celebration with consoles, LED lights, and digital decor.', 'https://i.pinimg.com/1200x/58/49/e9/5849e9dc2f8021eec7e76fddb1888e7c.jpg'),
('Hollywood Red Carpet', 'A glamorous red carpet theme with spotlights and celebrity-style decor.', 'https://i.pinimg.com/1200x/09/be/15/09be15db9bf078abc9aa4b4f39f49230.jpg'),
('Sports Mania', 'A sports-themed party featuring jerseys, trophies, and stadium-style decor.', 'https://i.pinimg.com/1200x/44/c4/ee/44c4eecc9eb774471adc0e72ff3d2b91.jpg'),
('Music Festival', 'A festival-inspired theme with boho decor, lights, and live music vibes.', 'https://i.pinimg.com/1200x/22/0f/c3/220fc3cf0d1c9730a26b81daeeca5378.jpg'), 
('Elegant Black & Gold', 'A classy black and gold theme perfect for milestone celebrations.', 'https://i.pinimg.com/736x/e5/c0/ff/e5c0ff49d86fbc8fd0ca6b2adca036d5.jpg'),
('Tropical Luau', 'A Hawaiian luau theme with tropical decor and island vibes.', 'https://i.pinimg.com/736x/fe/db/f0/fedbf02942723f30c0d0d8a6ab81b78e.jpg'); 

SELECT * FROM THEMES;

INSERT INTO PACKAGES (theme_id, name, price) VALUES

(1, 'Superhero Basic Kit', 150.00),
(1, 'Superhero Mega Experience', 320.00),
(2, 'Princess Royal Package', 250.00),
(2, 'Princess Castle Deluxe', 480.00),
(3, 'Dino Explorer Pack', 180.00),
(3, 'Jurassic Adventure Deluxe', 400.00),
(4, 'Galaxy Starter Pack', 170.00),
(4, 'Full Space Mission Experience', 360.00),
(5, 'Underwater Fun Pack', 160.00),
(5, 'Mermaid Fantasy Deluxe', 340.00),
(6, 'Safari Adventure Pack', 190.00),
(6, 'Ultimate Jungle Safari', 380.00),
(7, 'Cartoon Carnival Fun Pack', 140.00),
(7, 'Cartoon Carnival Premium', 290.00),
(8, 'Construction Crew Kit', 160.00),
(8, 'Builder Mega Zone', 330.00),
(9, 'Fairy Garden Starter', 150.00),
(9, 'Enchanted Fairyland Deluxe', 310.00),
(10, 'Neon Glow Essentials', 230.00),
(10, 'Full Glow Party Experience', 450.00),
(11, 'K-Pop Dance Starter', 220.00),
(11, 'K-Pop Stage Experience', 420.00),
(12, 'Gaming Arena Basic', 260.00),
(12, 'Pro Gamer Setup', 520.00),
(13, 'Red Carpet Essentials', 300.00),
(13, 'Hollywood Premiere Deluxe', 600.00),
(14, 'Sports Mania Starter', 210.00),
(14, 'Ultimate Sports Arena', 430.00),
(15, 'Mini Music Festival Pack', 280.00),
(15, 'Full Festival Experience', 550.00),
(16, 'Black & Gold Elegant Set', 350.00),
(16, 'Luxury Black & Gold Experience', 700.00),
(17, 'Tropical Luau Essentials', 260.00),
(17, 'Full Hawaiian Luau Experience', 540.00); 

SELECT * FROM PACKAGES; 

