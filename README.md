Todo List Web App
=======
Libaries used:
- Backbone
- RequireJS
- Underscore
- jQuery
- Bootstrap
- Animate.css
- spinner.js

Thoughts
=======
- I have taken extra steps to escape all user inputs on the clientside to prevent any XSS attacks from happening.
- I thought about parameterizing queries on the backend. After some reading on the way Activerecord handles queries, I realized Activerecord does the sanitization and parameterization of queries. However, I should be careful if I am writing my own queries.
- I will encrypt the user id and todo ids when they are returned to client side for security purposes. When a RESTful call is made, the encrypted user_id or todo id that is being sent will be decrypted on the backend for processing.
- Since I am encrypting the todo ids, that may interfere with the ordering of collections. Therefore, I would add a timestamp just so that it would be easier to sort the todos according to the time they were added.
<<<<<<< HEAD
- I will usually minimize the files during deployment. However, since this code will be reviewed, I will keep it as it is so that it is easily verifiable online.
=======
>>>>>>> origin/master
