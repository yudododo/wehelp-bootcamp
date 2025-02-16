## Overview👀

Hello visitors, I created this github repo to help me practice and showcase my not so refined html and css skill.
Hope that you get a grasp of my current front end skills and help me improve what I lack by sending feedbacks.🙏🙏🙏

## Screenshot🐻💥
### week1:
#### desktop & ipad
<div style="display: flex; justify-content:center;">
  <img src="./week1/images/screenshot_desktop.png" style="width: 55%; margin-right:15px;" >
  <img src="./week1/images/screenshot_ipad.png" style="width: 35%; ">
</div> 

#### mobile
<div style="display: flex; justify-content:center;" >
  <img src="./week1/images/screenshot_mobile_01.png" style="width: 35%; margin-right:15px;" >
  <img src="./week1/images/screenshot_mobile_02.png" style="width: 35%;">
</div>


## The challenge🔥

### 每週安排大綱
1. HTML、CSS、RWD 切版實務。
2. JavaScript、Python 基本練習。
3. JavaScript、Python 網路連線與資料運用。
4. 架設 FastAPI 網站後端伺服器。
    #### 路由詳解
    | **路由**        | **方法** | **功能描述**                            | **需要的參數**           |
    |-----------------|--------|------------------------------------------|-------------------------|
    | `/`             | GET    | 顯示首頁，包含登入表單和計算平方數輸入框    |           |
    | `/signin`       | POST   | 處理用戶登入，根據結果重定向至會員頁或錯誤頁 | `username`, `password`, `agreement` |
    | `/member`       | GET    | 顯示會員頁，只有登錄用戶能訪問              |           |
    | `/error`        | GET    | 顯示錯誤訊息頁面                          | `message`  |
    | `/signout`      | GET    | 清除 session 並登出                       |           |
    | `/square/{num}` | GET    | 顯示傳入數字的平方數                       | `num`     |

5. 架設 MySQL 資料庫伺服器。
    #### Task 2 Create database and table in your MySQL server
    - Create a new database named website.
      ```
      create database website
      ```
    - Create a new table named member, in the website database, 
      ```
      create table member (
        id bigint primary key auto_increment,
        name varchar(255) not null,
        username varchar(255) not null,
        password varchar(255) not null,
        follower_count int unsigned not null default 0,
        time datetime not null default current_timestamp
      );
      ```
      ##### task 2_screenshot 
    <div style="display: flex; justify-content:center;">
      <img src="./img/task 2.png" style="width: 80%;" >
    </div> 

    #### Task 3 SQL CRUD
    - INSERT a new row to the member table where name, username and password must be set to test. 
      ```
      insert into member (name, username, password)
      values ('test', 'test', 'test');
      ```
    - INSERT additional 4 rows with arbitrary data.
      ```
        insert into member (name, username, password)
        values
        ('John Doe', 'johndoe', 'password123'),
        ('Jane Smith', 'janesmith', 'mypassword'),
        ('Alice Johnson', 'alicej', 'alicepass'),
        ('Bob Brown', 'bobb', 'bobpass');
      ```
    - SELECT all rows from the member table.
      ```
      select * from member;
      ```
    - SELECT all rows from the member table, in descending order of time.
      ```
      select * from member  
      order by time desc;
      ```
    - SELECT total 3 rows, second to fourth, from the member table, in descending order of time.
      ```
      select * from member
      order by time desc
      limit 3 offset 1;
      ```
    - SELECT rows where username equals to test.
      ```
      select * from member
      where username = 'test'
      ```
    - SELECT rows where name includes the es keyword.
      ```
      select * from member
      where name like '%es%';
      ```
    - SELECT rows where both username and password equal to test.
      ```
      select * from member
      where username = 'test' and password = 'test';
      ```
    - UPDATE data in name column to test2 where username equals to test.
      ```
      update member
      set name = 'test2'
      where username = 'test';
      ```
      ##### task 3_screenshot 
      <div style="display: flex; justify-content:center; flex-direction: column">
        <img src="./img/task 3-1.png"  style="width: 80%, margin-bottom:15px;">
        <img src="./img/task 3-2.png" style="width: 80%;">
      </div> 
    
    #### Task 4: SQL Aggregation Functions
    - SELECT how many rows from the member table.
      ```
      select count(*) as total_members from member;
      ```
    - SELECT the sum of follower_count of all the rows from the member table.
      ```
      select sum(follower_count) as total_followers from member;
      ```
    - SELECT the average of follower_count of all the rows from the member table.
      ```
      select avg(follower_count) as avg_followers from member;
      ```
    - SELECT the average of follower_count of the first 2 rows, in descending order of follower_count, from the member table.
      ```
      select avg(follower_count) as avg_top_2_followers
      from(
      select follower_count from member
      order by follower_count desc
      limit 2
      ) as top_2;
      ```
      ##### task 4_screenshot 
      <div style="display: flex; justify-content:center;">
        <img src="./img/task 4.png" style="width: 80%;" >
      </div> 

    #### Task 5
    - Create a new table named message, in the website database. 
      ```
      create table message(
      id bigint primary key auto_increment,
      member_id bigint not null,
      content varchar(255) not null,
      like_count int unsigned not null default 0,
      time datetime not null default current_timestamp,
      foreign key(member_id) references member(id)
      );
      ```
    - SELECT all messages, including sender names. We have to JOIN the member table
to get that.
      ```
      select message.id, member.name as sender_name, message.content, message.like_count, message.time
      from message
      join member on message.member_id = member.id;
      ```
    - SELECT all messages, including sender names, where sender username equals to
test. We have to JOIN the member table to filter and get that.
      ```
      select message.id, member.name as sender_name, message.content, message.like_count, message.time
      from message
      join member on message.member_id = member.id
      where member.username = 'test';
      ```
    - Use SELECT, SQL Aggregation Functions with JOIN statement, get the average like
count of messages where sender username equals to test.
      ```
      select avg(message.like_count) as avg_likes
      from message
      join member on message.member_id = member.id
      where member.username = 'test';
      ```
    - Use SELECT, SQL Aggregation Functions with JOIN statement, get the average like
count of messages GROUP BY sender username.
      ```
      select member.username, avg(message.like_count) as avg_likes
      from message
      join member on message.member_id = member.id
      group by member.username;
      ```
      ##### task 5_screenshot 
      <div style="display: flex; justify-content:center; flex-direction: column">
        <img src="./img/task 5-1.png"  style="width: 80%, margin-bottom:15px;">
        <img src="./img/task 5-2.png" style="width: 80%;">
      </div> 

6. 基礎會員系統開發。
7. 前端 Fetch 後端 API 整合功能開發。
8. 主題學習，實體活動，轉職經驗分享。

## What I learned💪

- 相關技術：HTML、CSS、JavaScript、Python、FastAPI、MySQL。
- 背景知識：RWD 版面設計、HTTP 通訊協定、網站三層式架構。
- 預期目標：學會網站全端開發的所有基礎技能，完成一個小型專案。
  - 前端的部份練習 RWD 網頁切版，透過 JavaScript 串接後端。
  - 後端的部份利用 Python FastAPI 架設伺服器，並串接 MySQL 資料庫。

## Author🐶

- Instagram - [@yu_dododo](https://www.instagram.com/yu_dododo/)
