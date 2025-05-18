create database jewelry;
use jewelry;


create table user(
	user_id int primary key auto_increment,
    user_password varchar(255),
    user_name varchar(50),
	user_email varchar(50) check (`user_Email` regexp "^[a-zA-Z0-9][a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]*?[a-zA-Z0-9._-]?@[a-zA-Z0-9][a-zA-Z0-9._-]*?[a-zA-Z0-9]?\\.[a-zA-Z]{2,63}$"),
    user_mobile char(10) check (regexp_replace(user_mobile, '[^0-9]', '')),
	user_address int,
	date_created date
);
select * from user;
-- bỏ address lúc đk và sau khi đăng kí thì mới cho cập nhật địa chỉ và chỉ cập nhật vào record

insert into user(user_name,user_email,address_id) value('tuitennhan','nhan9@gmail.com','3');
select u.user_name,u.user_email,u.user_mobile,a.address_detail,u.date_created
from user u
join address a on u.address_id=a.address_id;

create table user_record (
	record_id int primary key auto_increment,
    user_id int,
    record_username varchar(50),
    record_mobile char(10) check (regexp_replace(record_mobile, '[^0-9]', '')),
    record_district varchar(50),
    record_province varchar(50),
    record_ward varchar(50),
    street_address varchar(50),
    
    foreign key(user_id) references user(user_id),
    foreign key(province_id) references province(province_id),
    foreign key(district_id) references district(district_id),
    foreign key(ward_id) references ward(ward_id)

);

create table categories(
	categories_id int primary key auto_increment,
    categories_name varchar(100)
);
insert into categories(categories_name) value('daychuyen');
select * from categories;
create table color_code(
	color_id int primary key auto_increment,
    jewelry_id int,
    color_name varchar(12) unique,
    
    foreign key(jewelry_id) references jewelry(jewelry_id)
);
select * from color_code;
drop table color_code;

insert into color_code (jewelry_id,color_name) values (1,'red');
insert into color_code (jewelry_id,color_name) values (2,'pink');

create table sub_categories(
	sub_id int primary key auto_increment,
    categories_id int,
    sub_name char(100),
    
    foreign key (categories_id) references categories(categories_id)
);
insert into sub_categories(categories_id,sub_name) value(1,'vong bac');
select * from sub_categories;

create table jewelry(
	jewelry_id int primary key auto_increment,
    jewelry_name char(50),
    sub_id int,
    jewelry_price varchar(30),
    jewelry_decribe varchar(200),
    jewelry_img varchar(255) default 'default.jpg',
    
    foreign key(sub_id) references sub_categories(sub_id)
);
insert into jewelry(jewelry_name,jewelry_img,sub_id,jewelry_price) values('pandora bac','./src/assets/image/vongbac.jpg',1,300000);
insert into jewelry(jewelry_name,jewelry_img,sub_id,jewelry_price) values('pandora cheap','./src/assets/image/vongbac.jpg',1,2,200000);
select * from jewelry;

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

create table size(
	size_id int primary key auto_increment,
    size_number int unique,
    jewelry_id int,
    quantity int,
    
    foreign key(jewelry_id) references jewelry(jewelry_id)
);
select * from size;
insert into size(size_number,jewelry_id,quantity) values(1,1,1);
insert into size(size_number,jewelry_id,quantity) value(20,1,5);
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

select* from cart;





