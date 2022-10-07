create table cust(
    id varchar(35) primary key,
    pwd varchar(12),
    name varchar(4),
    email varchar(40),
    address_num int,
    signdate timestamp default Now(),
    address varchar(40),
    phone varchar(15),
    useyn int default 1, -- 활동 : 1, 탈퇴 : 0
    isadmin int default 0 -- 관리자 : 1, 회원 : 0
);
create table emp(
	id varchar(35) ,
	pwd varchar(12),
    name varchar(4),
    email varchar(40),
    phone varchar(15),
    primary key (id),
    FOREIGN KEY (id) REFERENCES cust(id)
);
create table item(
	id varchar(40),
    name varchar(20),
    category int,
    cost int,
    price int,
    profit int,
    content varchar(1000),
    image varchar(100),
	useyn int default 1, -- 판매 1, 미판매 0
    signdate timestamp default Now(),
    primary key (id)
);
create table item_order(
	id int,
    item_id varchar(40),
    count int,
    complete int default 0,-- 주문 처리 후 0, 주문 해결완료(배송완료) 1
    cust_id varchar(35),
    primary key (id),
	FOREIGN KEY (item_id) REFERENCES item(id),
    FOREIGN KEY (cust_id) REFERENCES cust(id)
);
/*
insert into users
values ('U26c8ad1695d48e6b4bcccd4e6d25f3d9',
'124578','민구','ggalsrn@naver.com','17117',default ,'0288',default,default)
*/