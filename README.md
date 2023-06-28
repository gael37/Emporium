# Description

This is my first full-stack personal project that follows the completion of my software engineering bootcamp with General Assembly.
I built an e-commerce website, fully responsive, whose design is inspired by Amazon.
The users of this website can:
- Sign in/sign up using an authentication system and have access to gated functionalities.
- Filter and view products including a detailed description, images, customer reviews.
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

I started by building my Django back-end, containg the eight 'apps' that I used in my previous relationship diagram:
- basket
- categories (product categories for future filtering)
- comments (product reviews)
- jwt_auth (users)
- orders
- payments
- products
- wishes (products put to wishlist)

Then, I connected my React front-end to my back-end, and started writing my components.
I started with the navigation bar, then the home page (list of all the products), then detailed product page, etc.

# Challenges

One of the challenges was managing the product images, allowing the users to add and delete them during the upload phase in a smooth way. To do so, I used the dropzone library, and I wrote some conditional code in my 'newProduct' component to make sure there is a loading information visible for the users as well as a way for them to manage their uploaded images:

You can see below a piece of this component, containing the state value 'selectedImages' and some conditional logic:

<img width="824" alt="image" src="https://github.com/gael37/Emporium/assets/113553373/864bed5b-1167-41f7-8a45-7cda355dd37f">

You can see below a 'loading in progress' informative message:

![image](https://github.com/gael37/Emporium/assets/113553373/6d6d80e8-0074-4363-9f8c-81d564e28e97)

You can see below the numbered images with a 'delete' button:

![image](https://github.com/gael37/Emporium/assets/113553373/df148d3c-96bb-456d-af99-3fa7ca59dc90)

 
Another challenge was to integrate the Stripe payment system to my website. I needed to do some research to figure out how to use the Stripe API in test mode, and make sure I send the correct pieces of information regarding the products that are in the users' basket.
Below you can see the main piece of the views.py in my 'payments' django app:

<img width="779" alt="image" src="https://github.com/gael37/Emporium/assets/113553373/39362723-2b19-439f-b799-e0338e5d17d1">

# Wins

This project was another practice for working on full-stack applications , I was able to practice the design in a concrete way, inspiring myself from an industry efficient pre-existing one, which was really useful for me to help me learn how to design my website in a user-friendly and industry approved way.
Using the Stripe payment test mode on my project is a big win, because now I feel more confortable on working with tools that are new to me, so it helps me feeling more confident about implementing functionalities in my future projects. It also forced me to search for documentation online, which I feel is a good skill to have to be able to sort yourself out and become a better developer in general.
Additionally, by practicing useState and useEffect a lot, I'm getting used to the React way of thinking.

# Key Learnings/Takeaways

I got tangled up a few times with bits of my own code, especially with the state management and using the useEffect hook a bit too loosely, which led to bugs that took me while to sort out. This makes me realize the importance of writting concise code and not to repeat myself.

# Future Improvements

I loved working on this personal project and I could continue improving it for a long time as I have many ideas. But in the same time I would like to move on to new projects and keep learning new things and practicing other technologies.
I think my filter selector in the middle of the screen looks a bit clunky. I would like to change it, and implement numerous filters on the left-side of the screen instead. Filters like ‘by city’, ‘by price with a cursor’, by ‘ratings’ etc.
I could also seed the database with more products.
I could also make sure to decrease the main page loading time, by not displaying all the database products at once (10 by 10 for example, with a button to display more).
The loading time for adding/removing product from the basket is a bit long as well. I could re-write my code so that it makes the API call only once, for example when the user leaves the page, instead of each time he clicks on 'add product to basket' for example.

