create database jewelry;
use jewelry;

drop database jewelry;

create table user(
	user_id int primary key auto_increment,
    user_password varchar(255),
    user_name varchar(50),
	user_email varchar(50) check (`user_Email` regexp "^[a-zA-Z0-9][a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]*?[a-zA-Z0-9._-]?@[a-zA-Z0-9][a-zA-Z0-9._-]*?[a-zA-Z0-9]?\\.[a-zA-Z]{2,63}$"),
    user_mobile char(10) check (regexp_replace(user_mobile, '[^0-9]', '')),
	user_address int,
	date_created date
);

create table user_record (
	record_id int primary key auto_increment,
    user_id int,
    record_username varchar(50),
    record_mobile char(10) check (regexp_replace(record_mobile, '[^0-9]', '')),
    province_id int,
    ward_id int,
    street_address varchar(50),
    address_type varchar(50),
    
    foreign key(user_id) references user(user_id),
    foreign key(province_id) references province(province_id),
    foreign key(ward_id) references ward(ward_id)

);
create table province(
	province_id int auto_increment primary key,
    province_name varchar(50)

);
insert into province(province_name) values('Cần Thơ');

create table ward(
	ward_id int auto_increment primary key,
    ward_name varchar(50),
    province_id int,
    
    foreign key (province_id) references province(province_id)
);
insert into ward(ward_name,province_id) values('Ninh Kiều',1),('Bình Thuỷ',1),('Cái Răng',1);
create table categories(
	categories_id int primary key auto_increment,
    categories_name varchar(100)
);
insert into categories(categories_name) value('daychuyen'),('vong');


select * from categories;

create table sub_categories(
	sub_id int primary key auto_increment,
    categories_id int,
    sub_name char(100),
    
    foreign key (categories_id) references categories(categories_id)
);
insert into sub_categories(categories_id,sub_name) value(2,'vong bac'),(2,'vong vang');
select * from sub_categories;

insert into color_code (jewelry_id,color_name) values (1,'red');
insert into color_code (jewelry_id,color_name) values (2,'pink');


create table jewelry(
	jewelry_id int primary key auto_increment,
    jewelry_name char(50),
    sub_id int,
    jewelry_price varchar(30),
    jewelry_decribe varchar(200),
    
    foreign key(sub_id) references sub_categories(sub_id)
);
insert into jewelry(jewelry_name,sub_id,jewelry_price) values('vong tay bac',1,300000);

select * from jewelry;

create table color_code(
	color_id int primary key auto_increment,
    jewelry_id int,
    color_name varchar(12),
    
    foreign key(jewelry_id) references jewelry(jewelry_id)
);
delete from color_code where color_id = 8;
select * from color_code;
drop table color_code;
insert into color_code(jewelry_id,color_name) values(4,'gray');
select * from jewelry;
create table size(
	size_id int primary key auto_increment,
    size_number int,
    jewelry_id int,
    color_id int,
    quantity int,
    
    foreign key(jewelry_id) references jewelry(jewelry_id),
    foreign key(color_id) references color_code(color_id)
);
select * from size;
INSERT INTO size (size_number, jewelry_id, quantity, color_id) VALUES (45, 1, 1, 1);
INSERT INTO size (size_number, jewelry_id, quantity, color_id) VALUES (50, 1, 1, 1);
INSERT INTO size (size_number, jewelry_id, quantity, color_id) VALUES (45, 2, 1, 2);
INSERT INTO size (size_number, jewelry_id, quantity, color_id) VALUES (45, 3, 1, 3);
INSERT INTO size (size_number, jewelry_id, quantity, color_id) VALUES (45, 4, 1, 6);
INSERT INTO size (size_number, jewelry_id, quantity, color_id) VALUES (45, 5, 1, 7);

ALTER TABLE size DROP INDEX size_number;

create table jewelry_img(
	img_id int primary key auto_increment,
    image varchar(255) default 'default.jpg',
    color_id int,
    jewelry_id int,
    
    foreign key (color_id) references color_code(color_id),
    foreign key (jewelry_id) references jewelry(jewelry_id)

);
INSERT INTO jewelry_img (image, color_id, jewelry_id) VALUES ('vongbac.jpg', 9, 4),
('vongbac.jpg', 1, 1),
('vongbac.jpg', 2, 1),
('vongbac.jpg', 3, 4),
('vongbac.jpg', 3, 2),
('vongbac.jpg', 6, 5),
('vongbac.jpg', 7, 3);


truncate table jewelry_img;
select * from jewelry_img;
create table cart(
	cart_id int primary key auto_increment,
    user_id int,
    jewelry_id int,
    color_id int,
    size_id int,
    quantity int,
    
    foreign key(user_id) references user(user_id),
    foreign key(color_id) references color_code(color_id),
    foreign key(size_id) references size(size_id),
    foreign key(jewelry_id) references jewelry(jewelry_id)
);
select * from cart;
TRUNCATE TABLE cart;
insert into cart(user_id,jewelry_id,color_id,size_id,quantity) values(1,2,1,1,2);

-- ---------getJewById-----------------------------
select j.jewelry_name,
	   j.jewelry_id,
	   j.jewelry_img,
	   s.size_number,
       s.quantity
from jewelry j
join size s on j.jewelry_id = s.jewelry_id;
-- ---------------------------------------------------

-- getJewBysubCategory------------------------
SELECT 
	j.jewelry_id,
    j.jewelry_name,
    j.jewelry_img,
    j.jewelry_price,
    c.color_id,
    s.sub_name,
    s.sub_id
FROM jewelry j
JOIN color_code c ON j.jewelry_id = c.jewelry_id
JOIN sub_categories s ON j.sub_id = s.sub_id;
-- ---------------------------------------------------

-- getJewByCategory--------------------------------
select c.categories_name,
		s.sub_name
        from categories c
join sub_categories s
on s.categories_id=c.categories_id;
-- ----------------------------------------
-- search-------------------
SELECT  j.jewelry_name,
		j.jewelry_price,
        color_code.color_name,
        size.size_number
FROM jewelry j
JOIN color_code  ON color_code.jewelry_id = j.jewelry_id
JOIN size ON size.jewelry_id = j.jewelry_id
WHERE jewelry_name LIKE '%pandora bac%';


SELECT 
  jewelry.jewelry_name,
  jewelry.jewelry_price, 
  color_code.color_name,
  size.size_number,
  jewelry_img.image
FROM jewelry
INNER JOIN size ON size.jewelry_id = jewelry.jewelry_id
LEFT JOIN color_code 
  ON color_code.jewelry_id = jewelry.jewelry_id 
  AND color_code.color_id = size.color_id
LEFT JOIN jewelry_img 
  ON jewelry_img.jewelry_id = jewelry.jewelry_id 
  AND jewelry_img.color_id = color_code.color_id
WHERE jewelry_name LIKE '%pandora bac%'
GROUP BY jewelry.jewelry_id, color_code.color_id
LIMIT 4;

-- get jewelry detail-------------------------
SELECT 
    jewelry.jewelry_name,
    jewelry.jewelry_img,
    jewelry.jewelry_price,
    color_code.color_name,
    size.size_number,
    size.quantity
FROM jewelry
left JOIN size ON jewelry.jewelry_id = size.jewelry_id
left JOIN color_code ON color_code.jewelry_id = jewelry.jewelry_id
WHERE jewelry.jewelry_id = 1 AND color_code.color_id = 4;

SELECT 
	j.jewelry_id,
    j.jewelry_name,
    j.jewelry_img,
    j.jewelry_price,
    c.color_id,
    s.sub_name,
    s.sub_id
FROM jewelry j
JOIN color_code c ON j.jewelry_id = c.jewelry_id
JOIN sub_categories s ON j.sub_id = s.sub_id;

-- ------------------------------
INSERT INTO cart (jewelry_id, quantity, color_id)
VALUES (1, 1, 1);
SELECT 
    jewelry.jewelry_name,
    jewelry.jewelry_id,
    sub_categories.sub_name,
    jewelry.jewelry_price,
    CONCAT('./assets/image/', jewelry_img.image) AS image,
    jewelry_img.img_id,
    color_code.color_name,
    color_code.color_id
FROM 
    jewelry
INNER JOIN 
    sub_categories ON sub_categories.sub_id = jewelry.sub_id
INNER JOIN 
    color_code ON color_code.jewelry_id = jewelry.jewelry_id
LEFT JOIN 
    jewelry_img 
    ON jewelry_img.jewelry_id = jewelry.jewelry_id 
    AND jewelry_img.color_id = color_code.color_id
GROUP BY 
    jewelry.jewelry_id, sub_categories.sub_name, color_code.color_id
LIMIT 10;

-- luc het session ma them gio hang khong duoc phai bao loi




