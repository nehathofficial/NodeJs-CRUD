# Node.js CRUD API with Express & MongoDB

This document provides a clear description of a simple CRUD (Create, Read, Update, Delete) API built using **Node.js**, **Express**, and **MongoDB**. It focuses on two main modules: **Users** and **Items**.

---

## 🚀 Overview

This API enables performing CRUD operations on two collections:

* **Users**: Stores user profile details
* **Items**: Stores product/item information

The API follows RESTful standards and communicates using JSON.

---

## 📦 Technology Used

* **Node.js** – JavaScript runtime environment
* **Express.js** – Web application framework
* **MongoDB** – NoSQL database
* **Mongoose** – Object Data Modeling (ODM) library

---

## 📁 Project Structure Description

The project contains:

* A main file to start the server
* Separate folders for database configuration, data models, routes, and controllers
* Environment configuration using `.env`

This modular structure ensures scalability and easy maintenance.

---

# 📌 API Description

## 👤 User Module (Users CRUD)

### Create User

Allows adding a new user by providing details such as name, email, and phone number.

### Get All Users

Returns a list of all users stored in the database.

### Get User by ID

Fetches detailed information of a single user using a unique ID.

### Update User

Updates specific data of an existing user.

### Delete User

Removes a user from the database.

---

## 📦 Item Module (Items CRUD)

### Create Item

Allows adding a new item with details like title, price, and description.

### Get All Items

Retrieves a list of all items.

### Get Item by ID

Fetches information for a specific item using its ID.

### Update Item

Modifies details of an existing item.

### Delete Item

Deletes an item permanently.

---

## 🗄 Database

MongoDB is used to store user and item data. Mongoose manages schema definitions and ensures structured data storage.

---

## 🛣 Routing

Routes are separated into dedicated files for Users and Items. Each route corresponds to one of the CRUD actions.

---

## ▶ Server

Express runs the API server, listens on a port defined in the environment file, and connects to MongoDB during startup.

---

## 📝 Summary

This CRUD API provides:

* Clean and modular structure
* Separate control for Users and Items
* Easy scalability
* RESTful standards

If you want, I can add **project setup instructions**, **database explanation**, or convert this into a **professional README format**.
