create table users(
    id varchar2(20) primary key,
    pwd varchar2(20),
    name varchar2(20),
    email varchar2(40),
    zip_code varchar2(7),
    address varchar2(100),
    phone varchar2(20),
    useyn number default 1, -- 활동 : 1, 탈퇴 : 2
    regdate date default sysdate);
