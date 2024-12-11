-- CREATE DATABASE WebStore

USE WebStore

CREATE TABLE Products(
    Product_ID      INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    Name            VARCHAR(100) NOT NULL,
    Price           DECIMAL(10, 2) NULL,
    Qty             INT NULL,
    Description     TEXT
)