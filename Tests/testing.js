const expect = require("chai").expect;
const request = require("request");
const mongoose = require('mongoose');
const key = process.env.WORLDTRADINGDATA_API_KEY;
const testURL = `https://www.worldtradingdata.com/api/v1/stock?symbol=`;

// Basic test to make sure the testing files are working
describe("test", function () {
    it("pass because everything is ok", function () {
        expect(true).to.be.true;
    });
});


// Test 1: make sure our queries to the World Trading Data API work
describe("Querying the API", function () {
    it("Looking for Apple, Microsoft, and Tesla tickers", function (done) {
        request.get({ url: `testURLAAPL,MSFT,TSLA&api_token=${key}` }, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
});


// Test 2: Look for a user in the database by email using the ID of a dummy user
describe('Database Tests for finding a user', function () {
    // create the connection
    before(function (done) {
        mongoose.connect('mongodb://localhost/stockSimple');
        let db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function () {
            console.log('We are connected to test database!');
            done();
        });
    });


    it("should find the test user with the name email david@mail.com", function (done) {
        // user information
        let userID = '5bbfbee91098ec0a78649de6';
        let email = 'david@mail.com';
       
        db.users.find({ email }).then(function () {
            // Request the route that returns the user information
            // for testing the token authentication on the server is removed to make sure the route works
            // during production, a web token is extracted from the headers to authenticate the user

            request.get(`auth/users/authenticate/${userID}`).end(function (err, res) {
                let responseStatus = res.status;
                let responseBody = res.body;

                // Run assertions on the response

                expect(err).to.equal(404);

                expect(responseStatus).to.equal(200);

                expect(responseBody)
                    .to.be.an("array")
                    .that.has.lengthOf(1);

                expect(responseBody[0])
                    .to.be.an("object")
                    .that.includes({ name: "David", email: "david@mail.com" });

                // The `done` function is used to end any asynchronous tests
                done();
            });
        });
    });


    //After all tests are finished drop database and close connection
    after(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            mongoose.connection.close(done);
        });
    });
});




// Test 3: Make sure the post route for creating a new user is functional
describe('Database Test for creating a new user', function () {
    // Database connection
    before(function (done) {
        mongoose.connect('mongodb://localhost/stockSimple');
        let db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function () {
            console.log('We are connected to test database!');
            done();
        });
    });


    it("should add a new user to the database", function (done) {
        // Create an object to send to the endpoint
        let reqBody = {
            name: 'John Doe',
            email: 'johndoe@mail.com',
            password: 'johndoepassword',
            ofAge: true
        };

        // POST the request body to the server to create a new user
        request
            .post("/auth/users/register")
            .send(reqBody)
            .end(function (err, res) {
                var responseStatus = res.status;
                var responseBody = res.body;

                // Run assertions on the response

                expect(err).to.be.null;

                expect(responseStatus).to.equal(200);

                expect(responseBody)
                    .to.be.an("object")
                    .that.includes(reqBody);

                // The `done` function is used to end any asynchronous tests
                done();
            });
    });

    //After all tests are finished drop database and close connection
    after(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            mongoose.connection.close(done);
        });
    });
});


// Test 4: Create a new investment
describe('Database Test for creating a new investment', function () {
    // connection
    before(function (done) {
        mongoose.connect('mongodb://localhost/stockSimple');
        let db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function () {
            console.log('We are connected to test database!');
            done();
        });
    });


    it("should add a new user to the database", function (done) {
        // Create an object to send to the endpoint with all the information reaquired to create a new investment
        let reqBody = {
            ticker: 'AAPL',
            name: 'Apple',
            dateInvested: '10/13/2018',
            sharesPurchased: 5,
            pricePurchased: 220
        };

        // POST the request body to the server
        request
            .post("/data/investment")
            .send(reqBody)
            .end(function (err, res) {
                var responseStatus = res.status;
                var responseBody = res.body;

                // Run assertions on the response

                expect(err).to.be.null;

                expect(responseStatus).to.equal(200);

                expect(responseBody)
                    .to.be.an("object")
                    .that.includes(reqBody);

                // The `done` function is used to end any asynchronous tests
                done();
            });
    });

    //After all tests are finished drop database and close connection
    after(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            mongoose.connection.close(done);
        });
    });
});


