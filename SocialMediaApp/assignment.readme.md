<!-- Social Network (NodeJS Assignment)
Estimated Completion time: Core - 3 Days, Stretch - 5 Days

Overview:
* Build a Social network backend for users to connect and share posts.
* A user should be able to sign up and follow/unfollow other users.
* A feed will show all the posts by users we follow.
Additionally the feed can be hidden behind a paywall and integrated with stripe to create a subscription or a one time payment option.
* Another layer of users could be added to moderate the content on the network.

Core Modules

* Data Models (1 Day)
* DB Setup
* Schemas for Users and their Posts
TODO: Unauthenticated Routes to access all content for CRUD operations (Partially Completed)
* Pagination of the queries

* User Relationships (½ Day)
* Create Relationships between Users
* Routes to follow and unfollow other users

* Authentication (½ Day)
* Introduce auth middleware to handle JWT Authentication
* Apply middleware to all restricted routes

* Social Feed (1 Day)
* Create a feed based on content by users followed
* Feed should be sortable based on query params
* Feed should be paginated to support infinite scrolling techniques
* Use sockets to receive live updates on the feed i.e whenever a new post is added to the feed, it should show up on the frontend for all users who follow the creator of that post.

Stretch Goals
Stripe Integration and Paywall (1 Day)
Restrict the social feed to paid users
Handle payments using Stripe Checkout
All payment logic should be stored on the backend

Moderators (½ Day)
* Add another layer of users that can modify global content
* The users should only be able to access the posts, not their creators to ensure unbiased moderation
Create routes for this new layer of users

General Notes / Guidelines:
Preference would be to do this in Typescript if you were part of that training or know it else you can do simple javascript.
All of the assignment tasks must be committed to git on the daily basis.
Make feature branches and generate pull-requests for review against a develop branch for each feature.
Assign Jawad, Muneeb & Zulqarnain as reviewers for the pull-request
Send a daily update email to the above team members about the progress and also mention if there are any roadblocks.
Make sure the assignment is documented well, also attach a postman collection along for testing.
Deploy the assignment on free heroku dyno. -->
