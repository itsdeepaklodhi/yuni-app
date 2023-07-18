# Yunistore Web App

Yunistore is a **location-based marketplace** that connects vendors and customers in the same area. It allows customers to browse products online and enjoy the benefits of physical retail, such as product testing, customer support and fast delivery. It also enables vendors to market and sell their products to a wider and more relevant audience.

This repository contains the web app for Yunistore. It is live at [yunistore.in](https://www.yunistore.in). It provides the frontend interface for the marketplace, allowing users to search, browse, buy and sell products. It communicates with the [RESTful web service for Yunistore](https://github.com/itsdeepaklodhi/yuni-webservice), which provides the backend functionality.

## Motivation
Despite the popularity of online shopping, physical retail stores still dominate the market with over 80% of retail sales, as customers value their service and product quality. However, the current shopping experience is outdated and inefficient, requiring customers to visit multiple stores to find what they need. Moreover, vendors lack a reliable way to connect with their local customers and promote their products. Yunistore is a location-based marketplace that bridges the gap between vendors and customers in the same area. It allows customers to browse products online and enjoy the benefits of physical retail, such as product testing, customer support and fast delivery. It also enables vendors to market and sell their products to a wider and more relevant audience. Yunistore is the future of shopping, combining the best of both worlds: online and offline.

## Built with

Yunistore is built with React and Bootstrap.It uses Formik for form validation, React Router DOM for navigation and TomTom API for map integration. Here's complete list:
- React 18.2.0
- Bootstrap 5.23
- React router 6.4.2
- TomTom 6.23.0
- Formik 2.2.9
- Yup 1.0.0
- React-Infinite-Scroller 1.2.6
- Popper js 2.11.7


## Features

- **Search products by query**: Users can enter keywords to find products that match their query within specified distance.
- **Browse products by category**: Users can select a category to see all the products in that category within specified distance.
- **Search store**: Users can also search store with query.
- **Navigate to store with map**: Users can see the location of the store that sells a product and get directions to it using TomTom API.
- **Sign up and log in**: Users can create an account and log in using their email and password.
- **Update user details**: Users can edit their profile information, such as name, email and password.
- **Delete account**: Users can delete their account and all their data from the marketplace.
- **Add, update and delete store**: Vendors can create their store profile and update  or remove it from the marketplace.
- **Manage products**: Vendors can add, edit or remove their products from the marketplace, including name, description, price, category and location.
- **Add or remove from wishlist**: Customers can save their favorite products for later purchase or remove them from their wishlist.

## Installation
To run this web app locally, you need to have Node.js and npm installed on your machine. You also need to have the RESTful web service for Yunistore running on your local machine or a remote server.

Clone this repository using the following command:
`git clone https://github.com/itsdeepaklodhi/yuni-app.git`

install the dependencies
`npm install`

Edit the src/config.js file with your  TomTom API key:
`export const TOMTOM_API_KEY = "<your-tomtom-api-key>";`

Run the web app using npm:
`npm start`

The web app will be available at `http://localhost:3000`


## Usage
You can use any web browser to access the web app and test its features. Here are some screenshots of the web app:
### Home page
![home](https://github.com/itsdeepaklodhi/yuni-app/assets/63474652/7320f3bb-754c-4047-aeaa-eae6d06d313f)

### Search results
![search](https://github.com/itsdeepaklodhi/yuni-app/assets/63474652/fe68c2d0-8466-4c6e-a625-981fafb20e66)

### Category page 
![category](https://github.com/itsdeepaklodhi/yuni-app/assets/63474652/79c9d051-9e5e-42aa-9a69-fdb1161cc95c)

### Product details
![product](https://github.com/itsdeepaklodhi/yuni-app/assets/63474652/2447ab2d-22e5-40b0-8f3c-035d40f4631d)

### Map directions
![direction](https://github.com/itsdeepaklodhi/yuni-app/assets/63474652/1a46ade4-ec1e-4964-b2ef-d6cedacffc09)

### Signup page
![signup](https://github.com/itsdeepaklodhi/yuni-app/assets/63474652/3666f251-a4f2-4554-aafe-1318859bae1f)

### Profile page
![profile](https://github.com/itsdeepaklodhi/yuni-app/assets/63474652/cdfe0469-ab31-413f-94f1-1c0c26b8e965)

### Store page
![store](https://github.com/itsdeepaklodhi/yuni-app/assets/63474652/350534fc-4d92-4886-bb0a-f2657169e289)

### Product form
![updateproduct](https://github.com/itsdeepaklodhi/yuni-app/assets/63474652/81872588-b73d-489a-94b6-018245e9f6dd)

### Wishlist 
![wishlist](https://github.com/itsdeepaklodhi/yuni-app/assets/63474652/e32e9b27-2d19-40f5-9ee5-9e55cdb58f33)

## Limitations
This web app is still under development and does not have the following features yet:
- Sorting and filtering functionality
- Order and shipping functionality
- Payment integration


## Contributing
If you want to contribute to this project, please follow these steps:
- Fork this repository and clone it to your local machine.
- Create a new branch for your feature or bug fix.
- Make your changes and commit them with a descriptive message.
- Push your branch to your forked repository and create a pull request.
- Wait for the code review and feedback.

