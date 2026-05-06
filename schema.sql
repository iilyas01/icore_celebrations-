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

ALTER TABLE venues
ADD CONSTRAINT unique_venue_name UNIQUE (name),
ADD CONSTRAINT unique_venue_link UNIQUE (vendor_link);

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

ALTER TABLE PACKAGES
ADD description TEXT NOT NULL;

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

INSERT IGNORE INTO SERVICES (name, category, estimated_price, vendor_link) VALUES
-- VIDEO GAME TRUCKS & GAMING
('Rolling Video Games Long Island', 'Video Game Truck', 550.00, 'https://rollingvideogameslongisland.com'),
('GameTruck Long Island', 'Video Game Truck', 575.00, 'https://gametruckparty.com/long-island'),

-- DJ & PARTY ENTERTAINMENT
('DJ Zeke Entertainment', 'DJ Services', 800.00, 'https://djzeke.com'),

-- PHOTO BOOTHS & MEDIA
('TapSnap 1165', 'Photo Booth', 700.00, 'https://tapsnap.net'),

-- GLAM, BEAUTY & SPA PARTIES
('Glitter & Glam LI', 'Spa Party', 350.00, 'https://glitterandglamspa.com'); 

SELECT * FROM SERVICES;

INSERT IGNORE INTO VENUES (name, location, price_per_day, vendor_link, capacity) VALUES

('My Gym Children\'s Fitness Center - Stony Brook', 'Stony Brook, NY', 450.00, 'https://www.mygym.com/stonybrook', 10),

('Social Play Haus', '200 Express St, Plainview, NY', 900.00, 'https://www.socialplayhaus.com', 20),

('Bowlero Commack', '2183 Jericho Turnpike, Commack, NY', 1500.00, 'https://www.bowlero.com/location/bowlero-commack', 30),

('Dave & Buster\'s Islandia', '1856 Veterans Memorial Hwy, Islandia, NY', 2000.00, 'https://www.daveandbusters.com/locations/islandia', 40),

('Hibernian Hall', '85 Grand Ave, Massapequa, NY', 550.00, 'https://www.aohdiv15.com', 15),

('The Party Lab Long Island', '3728 Park Ave, Wantagh, NY', 850.00, 'https://partylablongisland.com', 20);

INSERT IGNORE INTO VENUES (name, location, price_per_day, vendor_link, capacity) VALUES
-- Valley Stream
('Pump It Up – Valley Stream', '225 E Sunrise Hwy, Valley Stream, NY', 850.00, 'https://www.pumpitupparty.com/valley-stream-ny', 25),
('Laser Bounce Family Fun Center', '2710 Hempstead Turnpike, Levittown, NY', 1150.00, 'https://www.laserbounce.com', 30),

-- Elmont / Floral Park
('Active Kidz Party Place', '200 Robbins Ln, Jericho, NY', 970.00, 'https://www.activekidzlongisland.com', 30),

-- Westbury
('Chuck E. Cheese – Westbury', '1350 Old Country Rd, Westbury, NY', 1150.00, 'https://www.chuckecheese.com', 45),

-- Farmingdale
('Adventureland Amusement Park', '2245 Broadhollow Rd, Farmingdale, NY', 3000.00, 'https://www.adventureland.us', 50),
('RPM Raceway – Farmingdale', '40 Daniel St, Farmingdale, NY', 2500.00, 'https://www.rpmraceway.com', 30),

-- New Hyde Park / Hillside Ave
('Safari Adventure Party Room', '1074 Pulaski St, Riverhead, NY', 900.00, 'https://thesafariadventure.com', 20);

INSERT IGNORE INTO VENUES (name, location, price_per_day, vendor_link, capacity) VALUES
('The Inn at New Hyde Park', '214 Jericho Turnpike, New Hyde Park, NY', 3500.00, 'https://www.innatnhp.com', 450),
('Jericho Terrace', '249 Jericho Turnpike, Mineola, NY', 4000.00, 'https://www.jerichoterrace.com', 400),
('The Sterling Caterers', '345 Hicksville Rd, Bethpage, NY', 3000.00, 'https://www.thesterlingcaterers.com', 350),
('Crest Hollow Country Club', '8325 Jericho Turnpike, Woodbury, NY', 5000.00, 'https://www.cresthollow.com', 400); 

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

INSERT INTO PACKAGES (theme_id, name, price, description) VALUES
(1, 'Superhero Basic Kit', 300.00, 'Includes  masks, themed decor, and basic hero activities.'),
(1, 'Superhero Mega Experience', 520.00, 'Full superhero training, premium décor, and character appearance.'),

(2, 'Princess Royal Package', 350.00, 'Elegant princess décor, tiara, gown, and royal-themed games.'),
(2, 'Princess Castle Deluxe', 850.00, 'Full castle setup, princess makeover, storytelling, and deluxe decorations.'),

(3, 'Dino Explorer Pack', 380.00, 'Dinosaur-themed décor, explorer hats, fossil dig activities, and games.'),
(3, 'Jurassic Adventure Deluxe', 700.00, 'Large dino props, interactive dig site, adventure challenges, and premium décor.'),

(4, 'Galaxy Starter Pack', 270.00, 'Space-themed decorations, astronaut props, and simple cosmic games.'),
(4, 'Full Space Mission Experience', 460.00, 'Mission control setup, space challenges, glowing décor, and astronaut training.'),

(5, 'Underwater Fun Pack', 360.00, 'Ocean-themed décor, bubbles, sea creature props, and underwater games.'),
(5, 'Mermaid Fantasy Deluxe', 640.00, 'Mermaid meet-and-greet, shimmering décor, themed crafts, and premium props.'),

(6, 'Safari Adventure Pack', 290.00, 'Safari décor, explorer hats, animal games, and jungle props.'),
(6, 'Ultimate Jungle Safari', 580.00, 'Large jungle setup, animal encounters (props), adventure challenges, and premium décor.'),

(7, 'Cartoon Carnival Fun Pack', 240.00, 'Colorful carnival décor, cartoon props, and fun mini-games.'),
(7, 'Cartoon Carnival Premium', 390.00, 'Full carnival setup, booths, premium props, and character-themed activities.'),

(8, 'Construction Crew Kit', 360.00, 'Construction décor, toy tools, safety vests, and building activities.'),
(8, 'Builder Mega Zone', 630.00, 'Large construction zone setup, obstacle course, premium props, and team challenges.'),

(9, 'Fairy Garden Starter', 350.00, 'Whimsical décor, fairy wings, and magical garden activities.'),
(9, 'Enchanted Fairyland Deluxe', 610.00, 'Full fairyland setup, glowing décor, fairy visit, and enchanted crafts.'),

(10, 'Neon Glow Essentials', 430.00, 'Glow sticks, neon décor, UV lights, and glow games.'),
(10, 'Full Glow Party Experience', 650.00, 'Complete glow room setup, premium lighting, neon props, and glow activities.'),

(11, 'K-Pop Dance Starter', 320.00, 'K-pop décor, basic dance session, and themed props.'),
(11, 'K-Pop Stage Experience', 520.00, 'Stage setup, choreography session, lighting effects, and premium décor.'),

(12, 'Gaming Arena Basic', 360.00, 'Gaming décor, consoles setup, and basic tournament activities.'),
(12, 'Pro Gamer Setup', 620.00, 'Full gaming arena, LED décor, multiple stations, and competitive tournament features.'),

(13, 'Red Carpet Essentials', 300.00, 'Hollywood décor, red carpet, photo backdrop, and glam props.'),
(13, 'Hollywood Premiere Deluxe', 800.00, 'Full premiere setup, spotlight décor, VIP props, and premium photo experience.'),

(14, 'Sports Mania Starter', 210.00, 'Sports décor, mini-games, and team challenges.'),
(14, 'Ultimate Sports Arena', 530.00, 'Arena-style setup, multiple sports stations, premium props, and competitions.'),

(15, 'Mini Music Festival Pack', 280.00, 'Festival décor, mini stage, music props, and fun activities.'),
(15, 'Full Festival Experience', 550.00, 'Large festival setup, lighting, stage props, and premium music-themed activities.'),

(16, 'Black & Gold Elegant Set', 350.00, 'Elegant black and gold décor, table settings, and premium accents.'),
(16, 'Luxury Black & Gold Experience', 700.00, 'Full luxury setup, premium décor, lighting, and upscale experience.'),

(17, 'Tropical Luau Essentials', 260.00, 'Luau décor, leis, tiki props, and tropical games.'),
(17, 'Full Hawaiian Luau Experience', 580.00, 'Complete luau setup, premium décor, tropical activities, and themed entertainment.');

SELECT * FROM PACKAGES;
SHOW DATABASES;

ALTER TABLE services
ADD image_url VARCHAR(255);

UPDATE services SET IMAGE_URL = 'https://sweetdreamsny.com/wp-content/uploads/2022/07/Bridal-Shower-Dessert-Table-NYC-Long-Island-9-scaled.jpg'
WHERE service_ID= 3;
UPDATE services SET IMAGE_URL = 'https://s3-media0.fl.yelpcdn.com/bphoto/1UpYsmCG9RcIAMq_Xm8_wA/348s.jpg'
WHERE service_ID= 4;
UPDATE services SET IMAGE_URL = 'https://manninos.net/pluto-images/funnel/images/2ba54e92-c27a-4d02-a633-f959f59482c4?w=1920&quality=60&fit=cover'
WHERE service_ID= 6;
UPDATE services SET IMAGE_URL = 'https://cdn.foodstorm.com/662183fbc94241be92d563d6becef6c7/images/7d464532edf248acb1bae8fc6e62bf3a_540w.jpg'
WHERE service_ID= 5;
UPDATE services SET IMAGE_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ34T2KFQ4DCaVbc8_4Thi68asUhkRJuaeVaQ&s'
WHERE service_ID= 11;
UPDATE services SET IMAGE_URL = 'https://www.tycatheclown.com/wp-content/uploads/2019/12/Tyca-The-Clown-02-scaled.jpg'
WHERE service_ID= 7;
UPDATE services SET IMAGE_URL = 'https://happier.sg/wp-content/uploads/2018/08/Kids-party-magician-singapore-580x580.jpg'
WHERE service_ID= 8;
UPDATE services SET IMAGE_URL = 'https://cdn.canvasrebel.com/wp-content/uploads/2023/08/c-MelissaMunn__MelissafromFaceArtbyMelissafpsamples_1691629715839.jpg'
WHERE service_ID= 9;
UPDATE services SET IMAGE_URL = 'https://susymartinezphotography.com/wp-content/uploads/2020/08/Leo_0180-1.jpg.webp'
WHERE service_ID= 10;
UPDATE services SET IMAGE_URL = 'https://dreameventsny.com/wp-content/uploads/2025/09/Shower-4.jpg'
WHERE service_ID= 12;
UPDATE services SET IMAGE_URL = 'https://ae-pic-a1.aliexpress-media.com/kf/S850a5834f8884219826c4989336482231.jpg'
WHERE service_ID= 13;
UPDATE services SET IMAGE_URL = 'https://images.squarespace-cdn.com/content/v1/5f22d79f2c11cb30a2c8bc10/8a5b4dcf-fc3f-4208-a39a-3b07ef557780/Empanadas%2C+Hot+Sauces%2C+Yellow+Background%2C+Rope%2C+Tropical+Plants+and+Mini+Cocktails.jpg'
WHERE service_ID= 14;
UPDATE services SET IMAGE_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqG2p0g3_XhTNHh8HK7HxtsaCitZKw2hu3xg&s'
WHERE service_ID= 15;
UPDATE services SET IMAGE_URL = 'https://clownaroundpartyrental.com/wp-content/uploads/2024/10/22ft.-Sugar-Rush-Slide-e1728502484590.jpg'
WHERE service_ID= 16;
UPDATE services SET IMAGE_URL = 'https://rollingvideogameslongisland.com/wp-content/uploads/2020/09/Rolling-Video-Game-Truck-8.jpg'
WHERE service_ID= 17;
UPDATE services SET IMAGE_URL = 'https://lh6.googleusercontent.com/proxy/BaW_kbFGnn9Y1z4EHVi-Ejg_63xBuUw7kUkMwQUhY3DSHDtq6u7rt19ufg2QPYG9LBcExfmkDZLkAPmcTUqtQWd5zfNcCGhiBiX8f3m8UF7wrdRr456rsuyU9ezoCHUHxPg'
WHERE service_ID= 18;
UPDATE services SET IMAGE_URL = 'https://www.djzeke.com/wp-content/uploads/2024/07/Dj-Zeke-2.jpg'
WHERE service_ID= 19;
UPDATE services SET IMAGE_URL = 'https://www.sunstarvending.com/wp-content/uploads/2025/01/671aabbdc450ef99aa711fd9_AHOq17FjmHbnVObvoCrZw9DHosuWzOFHDuhNwRZBYYHS5ZMVqtQfoFnJXKLudA_tzWAYNfJao7wlmD_X_YihyN5n2K1atQC6vv5mcr4u3JA9bzWTDR0la3zaqlH1DyHoOpgAEI9TJyOuzw.png'
WHERE service_ID= 20;
UPDATE services SET IMAGE_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR0Uh8tRoBulFXOiPqH7HhlvbOv9wfzKS19g&s'
WHERE service_ID= 21;
UPDATE services SET IMAGE_URL = 'https://s3-media0.fl.yelpcdn.com/bphoto/sU-KHditm-jdjhO5F1cT3Q/348s.jpg'
WHERE service_ID= 1;
UPDATE services SET IMAGE_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFPTJtcxMTKw0dDRT2-QX75zemHYR9rmwMMw&s'
WHERE service_ID= 2;


ALTER TABLE packages
ADD image_url VARCHAR(255);

UPDATE packages SET image_url= 'https://i.pinimg.com/1200x/63/17/e5/6317e54791423dfd7bd69b3eab1fa6fa.jpg'
WHERE PACKAGE_ID = 1; 
UPDATE packages SET image_url= 'https://i.pinimg.com/736x/97/f8/72/97f87287e7993c01ba19b6e953d94af0.jpg'
WHERE PACKAGE_ID = 2; 
UPDATE packages SET image_url= 'https://i.pinimg.com/736x/91/e1/78/91e178fa136c89ad28fff25bc832b944.jpg'
WHERE PACKAGE_ID = 3; 
UPDATE packages SET image_url= 'https://i.pinimg.com/1200x/62/26/cb/6226cbc8798b5e3e76da18a14a486ef6.jpg'
WHERE PACKAGE_ID = 4; 
UPDATE packages SET image_url= 'https://i.pinimg.com/1200x/ca/12/ce/ca12ce9a6c2b1697d2a23b57c63d70f0.jpg'
WHERE PACKAGE_ID = 5; 
UPDATE packages SET image_url= 'https://i.pinimg.com/1200x/1c/b9/64/1cb964025d72e798e5002c6e216995f9.jpg'
WHERE PACKAGE_ID = 6; 
UPDATE packages SET image_url= 'https://i.pinimg.com/1200x/df/a4/03/dfa403693b37da2b0d60afd8430372a0.jpg'
WHERE PACKAGE_ID = 7; 
UPDATE packages SET image_url= 'https://i.pinimg.com/1200x/5f/fa/4a/5ffa4a790a7250afbce6ad2236452011.jpg'
WHERE PACKAGE_ID = 8; 
UPDATE packages SET image_url= 'https://i.pinimg.com/1200x/2d/db/7d/2ddb7d573f880f608d61134c9ea902f5.jpg'
WHERE PACKAGE_ID = 9; 
UPDATE packages SET image_url= 'https://i.etsystatic.com/25903056/r/il/eeff63/6658715098/il_1588xN.6658715098_tdrk.jpg'
WHERE PACKAGE_ID = 10; 
UPDATE packages SET image_url= 'https://i.pinimg.com/736x/b0/cd/ec/b0cdec20eeef3fb0286de0f7ae876180.jpg'
WHERE PACKAGE_ID = 11; 
UPDATE packages SET image_url= 'https://i.pinimg.com/736x/c7/82/58/c7825803e2eaa03217e0ee793cea9f1f.jpg'
WHERE PACKAGE_ID = 12; 
UPDATE packages SET image_url= 'https://i.pinimg.com/1200x/0a/54/cc/0a54cc596711b4dd9668466eec5048b7.jpg'
WHERE PACKAGE_ID = 13; 
UPDATE packages SET image_url= 'https://i.pinimg.com/1200x/ae/c5/89/aec58997d3d8eff5c0b9a84507066ae2.jpg'
WHERE PACKAGE_ID = 14; 
UPDATE packages SET image_url= 'https://i.pinimg.com/1200x/35/d6/2f/35d62f6646c1c5b4fd6bf3c63cf0e8d5.jpg'
WHERE PACKAGE_ID = 15; 
UPDATE packages SET image_url= 'https://i.pinimg.com/1200x/56/41/6a/56416aa7472c5aed645ea6bca9cd46d6.jpg'
WHERE PACKAGE_ID = 16; 
UPDATE packages SET image_url= 'https://i.pinimg.com/736x/59/28/39/5928393ee8cc234ad2ffe86624b61196.jpg'
WHERE PACKAGE_ID = 17; 
UPDATE packages SET image_url= 'https://i.pinimg.com/736x/d3/53/88/d35388759bf18b382d56fae5ea96e2e7.jpg'
WHERE PACKAGE_ID = 18; 
UPDATE packages SET image_url= 'https://i.pinimg.com/1200x/10/1d/0c/101d0caf834e96d0a393ab9483c36bcf.jpg'
WHERE PACKAGE_ID = 19; 
UPDATE packages SET image_url= 'https://i.pinimg.com/736x/96/ef/5e/96ef5e0efaa8d12795d6d22cab81d5ec.jpg'
WHERE PACKAGE_ID = 20; 
UPDATE packages SET image_url= 'https://i.pinimg.com/1200x/38/d2/4b/38d24b027a7db223c69aabd7426879f8.jpg'
WHERE PACKAGE_ID = 21; 
UPDATE packages SET image_url= 'https://i.pinimg.com/1200x/fa/cc/01/facc01a8a80f998ed83d15fdd34e1768.jpg'
WHERE PACKAGE_ID = 22; 
UPDATE packages SET image_url= 'https://i.pinimg.com/1200x/e7/21/cf/e721cfa3368d605eb50fab7a9e9ee591.jpg'
WHERE PACKAGE_ID = 23; 
UPDATE packages SET image_url= 'https://i.pinimg.com/1200x/51/13/35/5113350d07a9a2c5e35baec04389401d.jpg'
WHERE PACKAGE_ID = 24; 
UPDATE packages SET image_url= 'https://i.pinimg.com/1200x/29/07/8d/29078d88764f33f9c782c4c899478ed4.jpg'
WHERE PACKAGE_ID = 25; 
UPDATE packages SET image_url= 'https://i.pinimg.com/736x/1e/c8/9c/1ec89c16e62444327bd0ea17ee776ea8.jpg'
WHERE PACKAGE_ID = 26; 
UPDATE packages SET image_url= 'https://i.pinimg.com/736x/e5/7f/92/e57f92cee5ae67282562daa9761be07d.jpg'
WHERE PACKAGE_ID = 27; 
UPDATE packages SET image_url= 'https://i.pinimg.com/1200x/01/f0/0e/01f00ec3b43c4e7bcd89c3f82a4fea5d.jpg'
WHERE PACKAGE_ID = 28; 
UPDATE packages SET image_url= 'https://i.pinimg.com/736x/07/19/18/071918a67c4f0b898108b7985cbf4dc4.jpg'
WHERE PACKAGE_ID = 29; 
UPDATE packages SET image_url= 'https://i.pinimg.com/1200x/0e/48/f4/0e48f41f88010bcf539e8411099dbc91.jpg'
WHERE PACKAGE_ID = 30; 
UPDATE packages SET image_url= 'https://i.pinimg.com/736x/d9/57/c5/d957c51a751117e05a84c69586565f69.jpg'
WHERE PACKAGE_ID = 31; 
UPDATE packages SET image_url= 'https://i.pinimg.com/1200x/18/e1/23/18e123cb348b56e92d0cdf152f2d01e9.jpg'
WHERE PACKAGE_ID = 32; 
UPDATE packages SET image_url= 'https://i.pinimg.com/1200x/5b/e2/a1/5be2a1009c0f4f23147043f862eeb6c0.jpg'
WHERE PACKAGE_ID = 33; 
UPDATE packages SET image_url= 'https://i.pinimg.com/1200x/11/cd/ec/11cdecee9ceb729cd417be2cba68a314.jpg'
WHERE PACKAGE_ID = 34; 


