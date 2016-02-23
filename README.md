# Stock collector service

This is an API for Stock collector.
It's a node/express and mongoDB application.

## 1 - Installation

        npm install --production

## 2 - Running the app
Simply type:

        npm start

or

        node server/app.js

# Endpoints

## POST /api/stock
Add new stock into db
 + Body request:

        {
        	"ticket": "NYSE:LNKD",
        	"user": "bernieMadoff",
        	"account": "PonziINC",
        	"sell": 50.50,
        	"rate": 10.00,
        	"time": "2016-04-02T15:04:05Z07:00",
        	"buy": 505.00
        }

+ response

        {
          "success": true,
          "stock": {
                "__v": 0,
                "market": "NYSE",
                "ticket": "NYSE:LNKD",
                "user": "bernieMadoff",
                "account": "PonziINC",
                "sell": 50.5,
                "rate": 10,
                "time": "2016-04-02T15:04:05.000Z",
                "buy": 505,
                "_id": "56ca85507189d6485dcaad66"
          }
        }


## GET /api/stock/mostOperated
Get the most operated stock for each account, where the total operated value is greater than 100K.
+ Response:

        {
          "success": true,
          "stock": [Stock List]
        }

## GET /api/stock/mostActiveUser
Get the most active user in the last hour
+ Response:

        {
          "success": true,
          "user": "bernieMadoff",
          "count": 8765
        }

## GET /api/stock/mostExpensiveStock
Get the most expensive stock for the last day.
+ Response:

        {
          "success": true,
          "stock": [Stock List]
        }

## POST /api/stock/meanAndMedian
Get the mean and the median value for a requested date range
+ For instance, I'm returning only the mean (average)
+ body request:
+
        {
        	"fromDate": "2016-02-02T15:04:05Z07:00",
            "toDate": "2016-04-02T15:04:05Z07:00"
        }

response:

        {
          "success": true,
          "mean": 20.299102691924226
        }
