# Description

The 12th and final week of General Assembly’s Software Engineering Immersive bootcamp was about creating a full stack application, individually, using React.js for the front end, Django for the back-end and a PostgreSQL database. My application, called The Bargain Corner, is a Gumtree-like ad hosting platform with an authentication system and CRUD functionalities, where customers can post and browse ads and also message each other.

# Deployment link:

https://gd-spare-sock.herokuapp.com/

# Getting Started/Code Installation

To run the app locally, download the zip file and open it with your code editor, then split the terminal and run these commands:

- on the project root: 
pipenv install django
python manage.py runserver

- cd in the client folder:
npm i
npm run start

The application should open in your browser.

# Timeframe & Working Team (Solo/Pair/Group)

This project was fully created individually, within a one week timeframe.

Technologies Used

Code editor:
- VScode

Design:
- Sass
- Bootstrap

Front-end:
- React.js

Back-end:

- Django

Database:
- PostgreSQL

Others:
- Quick Database Diagrams
- Excalidraw
- Insomnia
- TablePlus
- Cloudinary
- -bcrypt

# Brief

Build a full-stack application by making our own front-end and our own back-end.
Use a Python Django API, using Django REST Framework to serve our data from a Postgres database.
Consume our API with a separate front-end built with React.
Our application must be a complete product, which most likely means multiple relationships and CRUD functionality for at least a couple of models.
Our application must have a visually impressive design.
Implement thoughtful user stories/wireframes.
Be deployed online.

# Planning

I wanted to create a Gumtree-like platform because I thought it would be adapted to the brief (there are many CRUD functionalities possible with this type of app).
Here is the wireframe of what I wanted to build:

- Home page: 
As you can see below, the website would have a navigation bar at the top with a search bar, a login/logout link, a register link, a home page link, and an ad post link.
The home page in particular would have a list of ads in the form of an index of cards with an image and descriptive features. It would also have filters (a category selector and a city selector for example).

![image](https://user-images.githubusercontent.com/113553373/213533281-9feb44c3-4cae-47d7-8d5d-3cad724e01f8.png)

- If you’re logged in:
As you can see below, when the users are logged in, they have access to their account.

![image](https://user-images.githubusercontent.com/113553373/213533316-8ba04af7-fec4-4c61-ac9a-f54893963fd5.png)


- Account:
On the account section, the user has access to their personal data, as well as a history of his purchases/sales, with clickable links.

![image](https://user-images.githubusercontent.com/113553373/213533436-1bd6e66e-f08f-4d91-8d96-4ace9d773af7.png)

- Single ad page:
If you’re logged-in, you have access to more information on that page, and can also contact the seller:

![image](https://user-images.githubusercontent.com/113553373/213533466-67a9fbc0-ccab-4214-afae-28139659fb91.png)

- Register/log in pages:

![image](https://user-images.githubusercontent.com/113553373/213533509-72feedf9-b463-46da-bccc-002184533bad.png)

- Page to post an ad:

![image](https://user-images.githubusercontent.com/113553373/213533557-a5d31d49-64cf-41f4-89bd-fbf15da405c8.png)

- Page to edit your personal details in the account section:

![image](https://user-images.githubusercontent.com/113553373/213533701-c055d2af-aed7-4e9e-9569-966aef84c0d9.png)


On the following diagram are displayed my relationships:

![image](https://user-images.githubusercontent.com/113553373/213533741-6acbb3e5-bd5a-4e84-8db1-aac71e7d0162.png)



# Build/Code Process

I started with the setup of my Django backend, including:
Creation of a virtual environment and installing Django on it.
Starting a new Django project.
Migrating the default migrations to our database.
Running the server.
Creating a superuser to access the admin panel of our Django project.
Setting the default database to be a postgresql database.

Once the backend setup done, I was ready to create my apps one by one following that procedure for each app:
Creation of the app with the django command ‘startapp’.
Registering the app in ‘installed apps’ in the project folder so that they are detected when migrating:

![image](https://user-images.githubusercontent.com/113553373/213533804-6f971a1b-08b2-47e0-8490-01ca4c4c44fa.png)

Setting the path in ‘urlpatterns’ in project/urls:

![image](https://user-images.githubusercontent.com/113553373/213533838-4e4a22cd-664c-4407-9aa4-b616a97a065d.png)

Creating the model for the app, as you can see for example for the app ‘products’:

![image](https://user-images.githubusercontent.com/113553373/213533866-7ae13b63-cda3-4746-ba95-c5dd47ba1d15.png)

The tricky thing here is that ‘image’ is actually of type Charfield as it will be converted into a Cloudinary url on submission from the user.
‘Owner’ is linked to ‘products’ via a one-to-many relationship.
‘Categories’ is linked to ‘products’ via a many-to-many relationship.
‘Created_at’ is automatically filled on submission.

Definition of the serializers:
There is a common one, returning all the fields of the model:

![image](https://user-images.githubusercontent.com/113553373/213533929-285c7769-2e51-4aad-ab17-098e35df4d60.png)

And there is a populated one, returning all the fields of the model, plus a detailed version of the stated field, for example ‘owner’ in the following screenshot will be returned following the User model, not only its Foreign Key value:

![image](https://user-images.githubusercontent.com/113553373/213533971-f828bace-5bff-4959-883a-ba5c8a76e7dc.png)

Definition of the views (equivalent to controllers):
For example if I want to get all the products or post a product, I set the view like so:

![image](https://user-images.githubusercontent.com/113553373/213534060-8ffedfd7-922d-4927-916a-7ea72e58ee45.png)

The ‘permission_classes’ states the rights of the user given if he’s authenticated or not. In this example, the user needs to be authenticated in order to post (write), but not for getting (read) all the products.
I use built-in methods from the REST Django framework such as .is_valid() or .objects.all() to set the instructions to my views.
Note: for the post method I can display two types of errors: with the key ‘errors’ I can display an error when the object is not valid for example. Whereas with the class ‘Exception’ I can display all other sorts of errors such as an internal one.

For the other view : ProductDetailView, it is attached to another url that uses the pk (primary key):

![image](https://user-images.githubusercontent.com/113553373/213534102-73d026ec-9bb3-4651-a0dd-86941c5598cb.png)

Then I set the url patterns of my app:

![image](https://user-images.githubusercontent.com/113553373/213534140-f74da8f4-383e-49cc-a853-a4f6135a4f0d.png)

I also don’t forget to add the model in admin.py so that it is visible in the admin CMS:

![image](https://user-images.githubusercontent.com/113553373/213534166-4b38d1db-140a-4482-ae92-234730d4153b.png)

In total, I have 4 apps:
jwt_auth which is a User model app (with login and register).
categories 
comments
products

Client side:
The home page of my client side is where the user can see all the ads posted on the website: to do so I used a get request:

![image](https://user-images.githubusercontent.com/113553373/213534211-2bac0362-21fb-4960-8074-ceb7064b4fb7.png)

And in the JSX wrapper I return the descriptive information on each ad using a map method:

![image](https://user-images.githubusercontent.com/113553373/213534282-4009287d-de91-43bd-8398-82cc89e26a39.png)

I also have two filters. For each one of them I use an ‘onChange’ event listener. ‘HandleChange’ is for the search bar, and ‘filter products’ is for the select button.
They are linked to one another so that the filters apply combinatorially.

![image](https://user-images.githubusercontent.com/113553373/213534327-5e45b418-9fca-408f-bdd1-7eb51212a291.png)

![image](https://user-images.githubusercontent.com/113553373/213534369-270372fa-c77d-4549-930a-0fe0e6f8b8bd.png)


I also set another functionality on this page. If the user is logged in, their geolocation is retrieved from their postcode via a third party api. This API accepts valid UK postcodes as an input and sends back a lot of information including the corresponding latitude and longitude. Then, the geolocation of every ad owner is retrieved too, via a useEffect in a loop through all the ads. And then via a ‘maths’ function I calculate the distance from the logged in user to the ad owners:
UseEffect:

![image](https://user-images.githubusercontent.com/113553373/213534409-f141ec4a-0fbd-4a1f-af26-350edd654e12.png)

Function to calculate the distance:

![image](https://user-images.githubusercontent.com/113553373/213534468-28ffde1c-60d6-4afe-8456-32cfdc8f26bb.png)

I reuse that function in the JSX return when the user is logged in, using a conditional statement:

![image](https://user-images.githubusercontent.com/113553373/213534518-0b9c38b1-36d2-4286-a437-a1cfe139c96a.png)

I had a white screen when React tried to retrieve the geolocalisation for a non logged in user, as there is no postcode to send through. So I decided to solve this by having two home pages, one when the user is logged in and one for just browsing without being logged in:

![image](https://user-images.githubusercontent.com/113553373/213534544-c0e95279-24f6-43c8-a878-51c12efd6c43.png)

![image](https://user-images.githubusercontent.com/113553373/213534588-fbd22b97-562e-4439-82e2-4477c8a3225c.png)

![image](https://user-images.githubusercontent.com/113553373/213534620-d119b7ef-72ad-4fc3-a97b-89107d3a58b7.png)


In the register component, along with some other fields such as email or username, I have an image upload section where a user is able to upload a profile picture:

![image](https://user-images.githubusercontent.com/113553373/213534665-01104c72-3408-4785-9f42-d74d057859d4.png)

This image upload is made via Cloudinary tool:

![image](https://user-images.githubusercontent.com/113553373/213534723-00aab1e9-4dda-4ca9-a59a-2f9259ea64b0.png)

Messaging system:
There is a messaging functionality on my app, for this I send a request to get all comments for one user:

![image](https://user-images.githubusercontent.com/113553373/213534761-92073668-dcc0-426a-8876-c7cbd822239f.png)

And the user is able to send a message back sending a request to the generic endpoint:

![image](https://user-images.githubusercontent.com/113553373/213534807-0d597765-23fe-43a6-a465-6605f8084152.png)


Edit profile section:
A user has the possibility to update his profile details such as password, email, etc. To do so, I retrieve the data for this user, track the state of all the fields in the form and ‘onChange’ set them to their new value:

![image](https://user-images.githubusercontent.com/113553373/213534851-7d5bcf22-7c53-486b-a7a9-da704de14369.png)

![image](https://user-images.githubusercontent.com/113553373/213534892-f8f3ef4d-7cd5-4f2c-ab45-eed700b96026.png)

![image](https://user-images.githubusercontent.com/113553373/213534926-ead6e13f-59af-49e3-aba0-95cd7bfc6434.png)


Profile section:
In this section, I display information about the user, such as the products that he owns and the messages that he might have sent or received. I use conditionals in the JSX wrapper to display the relevant information, if there is any:

![image](https://user-images.githubusercontent.com/113553373/213534971-3324df38-171d-4c51-8ec4-2ac2ef67ecac.png)

Delete profile functionality:
The user is being asked to confirm if he really wants to delete his profile and is redirected on the proper page:

![image](https://user-images.githubusercontent.com/113553373/213535007-7984d96b-374e-40fb-b4b5-c874cf2acc92.png)

As straightforward as it sounds I then send a delete request with the proper headers.

![image](https://user-images.githubusercontent.com/113553373/213535043-bd8a1aa4-7033-4e26-a345-008623123ca1.png)



Edit/delete product functionality:
Any owner when navigating to the single product page is offered the possibility to edit or delete his ad, in the same manner as for the profile details.

# Challenges

- The Django relationships system was hard to deal with at the beginning. I was confused at how to set my apps, models and serializers according to what I wanted to achieve in the front-end. I overcame this difficulty by taking my time and properly using the relationship diagram that I had set before coding.
- I spent some time on the filters of my home page as well. I wanted them to work in a combinatory way so I had to find the good order in which to use my variables: first setting the ‘searchedProducts’ from the search bar input and then using this same variable in the ‘filterProducts’ callback function.
- The biggest challenge I faced was to display the distance between the current user and the owner of each ad. I thought I needed the coordinates and to use them to make a distance calculation. After some consideration, I had the idea of using a postcode but it was hard to find a free API that could send back the latitude and longitude. I finally found one but it’s for the UK only. 
- I faced on immediate problem linked to the previous challenge: if the user postcode was somehow not valid, or outside of the UK, or just if there was no user logged-in,  the axios request would fail and then in my JSX wrapper the variables ‘latitude’ and ‘longitude’ would be undefined, leading to a blank rendered page. I partially overcame this problem by creating two home pages components. One for a logged-in user and one for a random user who is just browsing through the application, where no request for geo-localisation is sent. 

# Wins

- I felt a certain satisfaction when I got the ‘distance’ functionality to work, as I was not particularly confident at the time using React, so it was definitely a challenge.
- I’m also happy about having inserted an image upload functionality both for the user profile and for the ads.
- I tried my best to make my application as user-friendly as possible and to implement as many CRUD  functionalities as I could within the timeframe in order to enable the user to achieve as many actions as possible without having to navigate too much himself through the application.
- In addition to these wins, from a more personal point of view, on the very last day of my project I ran into multiple last-minute coding errors that I had to pinpoint and solve within a tight timeframe which could have been stressful but I did my best to keep calm and figuring out from the errors display where exactly I did something wrong and progressively made my way out of it.

# Key Learnings/Takeaways

- I feel more confident about searching for third party APIs and using them wisely to add more functionalities to my application.
- I feel more confident with using React.js, especially regarding the good use of useState and useEffect, also using filters.
- I have a better understanding of how the Django relationships system works.
- I practised using a relational database and some tools to manipulate it such as TablePlus and the Django admin CMS.
- When things are not working the way I intended there is always a rational reason for it, and patience and persistence are key to move forward and get through difficulties as a coder.

# Future Improvements

- The design of my website needs a lot of improvement.
- The validity of the postcode field should be checked during the first user form submission in order to avoid future problems.
- A lot more functionalities can be added to my application, such as sorting ads by price, by distance.
- The messaging system is not user-friendly as you have to navigate to your account to see them. It would be better to have a proper ‘messages’ category for example.
- A wishlist system would be a good add-on.
- The code itself needs some cleaning and more commenting.
