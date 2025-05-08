create database jewlvery;
use jewlvery;
drop table user;
create table user(
	user_id int primary key auto_increment,
    user_password varchar(30),
    user_name varchar(50),
	user_email varchar(50) check (`user_Email` regexp "^[a-zA-Z0-9][a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]*?[a-zA-Z0-9._-]?@[a-zA-Z0-9][a-zA-Z0-9._-]*?[a-zA-Z0-9]?\\.[a-zA-Z]{2,63}$"),
    user_mobile char(10) check (regexp_replace(user_mobile, '[^0-9]', '')),
	user_address varchar(150),
	date_created date
);

create table catagories(
	catagories_id int primary key auto_increment,
    catagories_name varchar(100)
);
insert into catagories(catagories_name) value('vong');
select * from catagories;

create table sub_catagories(
	sub_id int primary key auto_increment,
    catagories_id int,
    sub_name char(100),
    
    foreign key (main_id) references main_categories(main_id)
);

create table jewlvery(
	jewlvery_id int primary key auto_increment,
    jewlvery_name char(50),
    sub_id int,
    jewlvery_price varchar(30),
    jewlvery_decribe varchar(200),
    jewlvery_size int,
    
    foreign key(sub_id) references sub_catagories(sub_id)
);

create table cart(
	cart_id int primary key auto_increment,
    user_id int,
    jewlvery_id int,
    quantity int,
    
    foreign key(user_id) references user(user_id),
    foreign key(jewlvery_id) references jewlvery(jewlvery_id)
);

create table favorite(
	favorite_id int primary key auto_increment,
    user_id int,
    jewlvery_id int,
    
    foreign key(user_id) references user(user_id),
    foreign key(jewlvery_id) references jewlvery(jewlvery_id)
)



