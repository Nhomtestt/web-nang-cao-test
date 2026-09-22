CREATE DATABASE online_shop;

USE online_shop;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    image VARCHAR(500),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    status ENUM(
        'pending',
        'confirmed',
        'shipping',
        'completed',
        'cancelled'
    ) DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(15,2) NOT NULL,

    CONSTRAINT fk_order_item_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_order_item_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    method ENUM('COD', 'BANKING', 'E_WALLET') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    paid_at TIMESTAMP NULL,

    CONSTRAINT fk_payment_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


INSERT INTO categories (name, description)
VALUES
('Laptop', 'Laptop các loại'),
('Điện thoại', 'Điện thoại thông minh'),
('Bàn phím', 'Bàn phím máy tính'),
('Chuột', 'Chuột máy tính'),
('Tai nghe', 'Tai nghe các loại');


INSERT INTO users
(name, email, password, phone, address, role)
VALUES
('Nguyen Van A', 'a@gmail.com', '123456', '0900000001', 'Ha Noi', 'customer'),
('Tran Van B', 'b@gmail.com', '123456', '0900000002', 'Ha Noi', 'customer'),
('Admin', 'admin@gmail.com', '123456', '0900000000', 'Ha Noi', 'admin');


INSERT INTO products
(category_id, name, description, price, quantity, image)
VALUES
(1, 'MacBook Air M3', 'Laptop Apple', 25000000, 10, 'macbook.jpg'),
(1, 'Dell Inspiron', 'Laptop Dell', 18000000, 15, 'dell.jpg'),
(2, 'iPhone 16', 'Dien thoai Apple', 22000000, 20, 'iphone.jpg'),
(3, 'Keychron K2', 'Ban phim co', 2000000, 30, 'keychron.jpg'),
(4, 'Logitech M650', 'Chuot khong day', 800000, 40, 'mouse.jpg');
