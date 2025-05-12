create database jewelry;
use jewelry;

drop table user;
create table user(
	user_id int primary key auto_increment,
    user_password varchar(255),
    user_name varchar(50),
	user_email varchar(50) check (`user_Email` regexp "^[a-zA-Z0-9][a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]*?[a-zA-Z0-9._-]?@[a-zA-Z0-9][a-zA-Z0-9._-]*?[a-zA-Z0-9]?\\.[a-zA-Z]{2,63}$"),
    user_mobile char(10) check (regexp_replace(user_mobile, '[^0-9]', '')),
	user_address varchar(150),
	date_created date
);

select * from user;
drop table sub_categories;
create table categories(
	categories_id int primary key auto_increment,
    categories_name varchar(100)
);
insert into categories(categories_name) value('daychuyen');
select * from categories;
create table color_code(
	color_id int primary key auto_increment,
    color_name varchar(12)
);

insert into color_code (color_name) values ('blue');

create table sub_categories(
	sub_id int primary key auto_increment,
    categories_id int,
    sub_name char(100),
    
    foreign key (categories_id) references categories(categories_id)
);
insert into sub_categories(categories_id,sub_name) value(3,'day chuyen vang');
select * from sub_categories;

create table jewelry(
	jewelry_id int primary key auto_increment,
    jewelry_name char(50),
    sub_id int,
    color_id int,
    jewelry_price varchar(30),
    jewelry_decribe varchar(200),
    jewelry_img varchar(255) default 'default.jpg',
    
    foreign key(sub_id) references sub_categories(sub_id),
	foreign key(color_id) references color_code(color_id)
);
insert into jewelry(jewelry_name,sub_id,color_id, jewelry_price) values('pandora bac',1,2,200000);
select * from jewelry;

create table cart(
	cart_id int primary key auto_increment,
    user_id int,
    jewlvery_id int,
    quantity int,
    
    foreign key(user_id) references user(user_id),
    foreign key(jewelry_id) references jewelry(jewelry_id)
);

create table size(
	size_id int primary key auto_increment,
    size_number int,
    jewelry_id int,
    quantity int,
    
    foreign key(jewelry_id) references jewelry(jewelry_id)
);
insert into size(size_number,jewelry_id,quantity) value(20,1,5);
-- ---------getJewById-----------------------------
select j.jewelry_name,
	   j.jewelry_img,
	   s.size_number,
       s.quantity
from jewelry j
join size s on j.jewelry_id = s.jewelry_id;
-- ---------------------------------------------------

-- getJewBysubCategory------------------------
SELECT 
    j.jewelry_name,
    j.jewelry_img,
    j.jewelry_price,
    c.color_name,
    s.sub_name
FROM jewelry j
JOIN color_code c ON j.color_id = c.color_id
JOIN sub_categories s ON j.sub_id = s.sub_id;
-- ---------------------------------------------------

-- getJewByCategory--------------------------------
select c.categories_name,
		s.sub_name
        from categories c
join sub_categories s
on s.categories_id=c.categories_id;
-- ----------------------------------------


