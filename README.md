Project Overview

This Angular project demonstrates complete CRUD (Create, Read, Update, Delete) operations using RESTful APIs. It integrates the following features:

Product Listing: Fetch and display a list of products.

Add Product: Create a new product and store its ID using BehaviorSubject.

Update Product: Update a product fully using PUT and partially using PATCH.

Delete Product: Remove a product from the list.

Merge Product List: Combine newly added products with the default product list.

Features and Functionalities

Product Listing

Fetch all products using GET API.- Display products using Angular Material table.

Add Product

Use POST API to add a new product.-Capture the product ID from the response and store it using BehaviorSubject.-Merge the newly added product with the existing product list.

Update Product

Use PUT API to update the entire product.-Use PATCH API to update specific product attributes.

Delete Product

Use DELETE API to remove a product by ID.


State Management with BehaviorSubject
The newly added product IDs are stored using BehaviorSubject.
These IDs are used to fetch the latest products and merge them with the default product list.

Technologies Used
Angular: Framework for building the front-end.
Angular Material: UI components.
RxJS BehaviorSubject: For managing state.
Bootstrap: Additional styling.
Angular CLI: 19.2.5
Node: 20.17.0
Package Manager: npm 10.8.2
OS: win32 x64

How to Run the Project

npm install

ng serve
