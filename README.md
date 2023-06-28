# Description

This is my first full-stack personal project that follows the completion of my software engineering bootcamp with General Assembly.
I built an e-commerce website, fully responsive, whose design is inspired by Amazon.
The users of this website can:
- Sign in/sign up using an authentication system and have access to gated functionalities.
- Filter and view products including detailed description, images, customer reviews.
- Sell products, using a drag and drop feature for uploading images.
- See and manage their orders, post product reviews.
- Add and remove products to their basket and proceed to a Stripe payment.
- Manage their whishlist.

Below you can see a few screenshots of the website on different devices, for an overview of the general design:

Mobile view of the sign-in page:

![image](https://github.com/gael37/Emporium/assets/113553373/5b49ecca-bab0-4a63-a6c6-e2a54db2e8bc)

Desktop view of the landing page (list of all the products and product filters):

![image](https://github.com/gael37/Emporium/assets/113553373/091c1c46-b8ab-44eb-8595-d21a2ea69067)

Tablet view of the basket page:

![image](https://github.com/gael37/Emporium/assets/113553373/f927954d-fa5a-4fa1-befc-9367f31b0888)


# Deployment link:

I have deployed my application on Heroku, it might take a few seconds to load:
https://emporium.herokuapp.com/

# Getting Started/Code Installation

To run the app locally, download the zip file and open it with your code editor, then split the terminal and run these commands:

On the first terminal window:
- cd in the project root
- pip install pipenv
- pipenv install django
- python manage.py runserver

In another terminal window:
- cd in the client folder:
- npm i
- npm run start

The application should open in your browser.

# Timeframe & Working Team

This project was created individually, between March and May 2023.

Technologies Used

Code editor:
- VScode

Design:
- Sass
- Bootstrap

Front-end:
- React.js

Back-end:
- Django (with Python)

Database:
- PostgreSQL

Others:
- Quick Database Diagrams
- Figma
- TablePlus
- Cloudinary
- -bcrypt
- Stripe


# Planning

I started by drawing a wireframe of my website, using Figma.
Then, I wrote the relationship diagram of my SQL database.

# Build/Code Process

I started by building my Django back-end, containg the eight apps that I used in my diagram:
- basket
- categories
- comments
- jwt_auth
- orders
- payments
- products
- wishes

Then, I connected my React front-end to my back-end, and started writing my components.
I started with the navigation bar, then the home page (list of all the products), then detailed product page, etc.

# Challenges

One of the challenges was managing the product images, allowing the users to add and delete them during the upload phase in a smooth way. To do so, I used the dropzone library, and I wrote some conditional code in my 'newProduct' component to make sure there is a loading information visible for the users as well as a way for them to manage the uploaded images:
![image](https://github.com/gael37/Emporium/assets/113553373/6d6d80e8-0074-4363-9f8c-81d564e28e97)
 to let the user know if the upload (which could take a few seconds)
 is actually going throught:

 
One of the challenges was to integrate the Stripe payment system to my website. I needed to do some research to figure out how to use the Stripe API in test mode, and make sure I send the correct pieces of information regarding the products that are in the users' basket.
Below you can see the main piece of the views.py in my 'payments' django app:

<img width="779" alt="image" src="https://github.com/gael37/Emporium/assets/113553373/39362723-2b19-439f-b799-e0338e5d17d1">


# Wins



# Key Learnings/Takeaways



# Future Improvements


