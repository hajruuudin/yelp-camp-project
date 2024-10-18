# yelp-camp-project
Web Application Development for a Campgrounds site search applciation. Browse different campgrounds from all over the world, view their physical location, information and their reviews, as well as add your own campgrounds as well. 

# Table of Contents
- [Description](#description)
- [Requirements](#requirements)


# Description
This is a project developed as part of a web-development course on udemy: The Web Developer bootcamp 2024 - Become a Developer With ONE course - HTML, CSS, JavaScript, React, Node, MongoDB and More!. The project has been modified (predominantly style wise) with slight improvements on its functionality, as well as changes to some used libraries (some have been replaced compared to other libraries). It uses NodeJS as its predominant backend language, MongoDB for its database and Bootstrap + Plain JS for the frontend. Key libraries include: Express, Mongoose, Passport...

# Requirements
This project requires node.js, npm as well as MongoDb as three basic elements to run.

## Running on Local Enviroment
To run the project on a local enviroment, clone the repository and run the following commands:

```javascript
npm install // will install all necessary libraries

node index.js // Running the actual project
```

The project will not run immediately, as three key variables will be missing from an .env file.
To make the project runnable, create a .env file in the root directory with the following 3 varbaibles
- MAPBOX_TOKEN: This is required to run the acual maps on the app. The key is goten from registering on MapBox: https://www.mapbox.com/
- IMGBB_API_KEY: This is required to enable image impload from the form. Default seeded campsites will have images, however, to add users own images, they are uploaded to a users specific imgbb account: https://imgbb.com/
- DB_CONN: This can be left as an empty string as it will not run on the local enviroment. It is still required in order to not break the code

Once these are set in place, the project should run normally. It will create a database named 'yelp-camp'

## Seeding the database (Optional)
There is also a seed file in the project which will seed the database with 500 random campsites. This is purely to see the functionality of the application. DO NOTE: It will not work immediatly as it relies on having at least one registered user in the database. Firstly, you should create a user from the application itself. After that, you'll need to replace one line of code from the file in seeds/seed.js which creates the actual campground objects:
```javascript
const seedDb = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 500; i++){
        const randomDescription = Math.floor(Math.random() * 10);
        const randomImages = Math.floor(Math.random() * 8)
        const random1000 = Math.floor(Math.random() * 889);
        const price =  Math.floor(Math.random() * 30 + 10);
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            author: '670cef3b1035b396c5675e22', // REPLACE THIS WITH ACTUAL _id OF AN EXISITNG USER
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: images[randomImages],
            description: campgroundDescriptions[randomDescription],
            price: price
        })
        await camp.save();
    }
}
```

Once that has been repalced, the file can be executed the same as running the server:

```javascript
node seeds/seed.js
```

