This project is developed with Node.js, Express, and Mongodb for Shopify Production Engineering Challenge. 



 # Online version

 I have made it run on GCE. The link is **34.73.47.8:3000**. Feel free to use it if you don't want to run it on localhost.

 # Run on your localhost?

If you want to run this server on your localhost, you have to install node, npm, and mongodb.

To run the project, you can type the following commands:

 `npm install`

 `npm start`

 Then, it will run on localhost:3000

  # Authentication
  All the product and cart APIs need to be verified as a registered user. You can create a new account using user api which will be listed below, you can also use a test account. **Username: test; Password:123**
  After login, you will get a token, include the token as the following format "bearer yourtoken" in your header with key "Authorization". The content-type should be application/json.

  # User API description
  #### 1. Register a new user
  ##### URL 
  34.73.47.8:3000/users/signup
  ##### Method
  POST
  ##### Data Params
  {"username":"yourusername","password":"yourpassword"}
  ##### Success Response
  Code: 200 
  Content:{
        success: true,
        status: 'Registration Successful!'
    }

  #### 2. Login
  ##### URL 
  34.73.47.8:3000/users/login
  ##### Method
  POST
  ##### Data Params
  {"username":"yourusername","password":"yourpassword"}
  ##### Success Response
  Code: 200 
  Content:{
      success: true, 
      status: 'Login Successful!', 
      token: token
    }

  #### 3. Logout
  ##### URL 
  34.73.47.8:3000/users/logout
  ##### Method
  GET

 


  # Product API description
  
  #### 1. Get all the products
  ##### URL 
  34.73.47.8:3000/products
  ##### Method
  GET
  ##### Success Response
  Code: 200 
  Content: [
    {
        "_id": "5c44da24007bd5493609f9e5",
        "updatedAt": "2019-01-20T20:50:14.719Z",
        "createdAt": "2019-01-20T20:29:24.446Z",
        "title": "Demo1",
        "price": 16,
        "inventory": 298,
        "owner": "5c44d9ca007bd5493609f9e4",
        "__v": 0
    }
]

  #### 2. Post a new product
  ##### URL 
  34.73.47.8:3000/products
  ##### Method
  POST
  ##### Data Params
  {"title":"product title","price":product price,"inventory":product inventory number}
  ##### Success Response
  Code: 200 
  Content:{
        "_id": "5c44da24007bd5493609f9e5",
        "updatedAt": "2019-01-20T20:50:14.719Z",
        "createdAt": "2019-01-20T20:29:24.446Z",
        "title": "Demo1",
        "price": 16,
        "inventory": 298,
        "owner": "5c44d9ca007bd5493609f9e4",
        "__v": 0
    }

  ##### Error Response
  Code: 404 
  Content: 'Product not found in request body'

  #### 3. Delete all products based on their related owners.
  ##### URL 
  34.73.47.8:3000/products
  ##### Method
  DELETE
  ##### Success Response
  Code: 200 
  Content:{
        "n": 1,
        "ok": 1
    }


  #### 4. Get all the products with available inventory
  ##### URL 
  34.73.47.8:3000/products/available?
  ##### Method
  GET
  ##### Success Response
  Code: 200 
  Content: [
    {
        "_id": "5c44da24007bd5493609f9e5",
        "updatedAt": "2019-01-20T20:50:14.719Z",
        "createdAt": "2019-01-20T20:29:24.446Z",
        "title": "Demo1",
        "price": 16,
        "inventory": 298,
        "owner": "5c44d9ca007bd5493609f9e4",
        "__v": 0
    }
]

  #### 5. Get a specified product with its id
  ##### URL 
  34.73.47.8:3000/products/:productId
  ##### Method
  GET
  ##### Success Response
  Code: 200 
  Content: {
        "_id": "5c44da24007bd5493609f9e5",
        "updatedAt": "2019-01-20T20:50:14.719Z",
        "createdAt": "2019-01-20T20:29:24.446Z",
        "title": "Demo1",
        "price": 16,
        "inventory": 298,
        "owner": "5c44d9ca007bd5493609f9e4",
        "__v": 0
  }


  #### 6. Update a specified product with its id
  ##### URL 
  34.73.47.8:3000/products/:productId
  ##### Method
  PUT
  ##### Data Params
  {"title":"product title","price":product price,"inventory":product inventory number}
  ##### Success Response
  Code: 200 
  Content: {
        "_id": "5c44da24007bd5493609f9e5",
        "updatedAt": "2019-01-20T20:50:14.719Z",
        "createdAt": "2019-01-20T20:29:24.446Z",
        "title": "Demo1",
        "price": 16,
        "inventory": 298,
        "owner": "5c44d9ca007bd5493609f9e4",
        "__v": 0
  }
  ##### Error Response
  Code: 404 
  Content: 'Product not found in request body'


  #### 7. Delete a specified product with its id
  ##### URL 
  34.73.47.8:3000/products/:productId
  ##### Method
  DELETE
  ##### Data Params
  {"title":"product title","price":product price,"inventory":product inventory number}
  ##### Success Response
  Code: 200 
  Content:{
        "n": 1,
        "ok": 1
    }

  # Cart API description
  
  #### 1. Get all the products in the shopping cart based on their related cart owners.
  ##### URL 
  34.73.47.8:3000/carts
  ##### Method
  GET
  ##### Success Response
  Code: 200 
  Content: {
        "total_price": 122,
        "cart_list": [
            {
                "_id": "5c44ec28ed35d35a78851ac3",
                "updatedAt": "2019-01-20T21:46:16.162Z",
                "createdAt": "2019-01-20T21:46:16.162Z",
                "products": {
                    "_id": "5c3561a09362945e942252d6",
                    "updatedAt": "2019-01-20T20:54:30.042Z",
                    "createdAt": "2019-01-09T02:51:12.999Z",
                    "title": "demo5",
                    "price": 122,
                    "inventory": 29,
                    "owner": "5c35549122cf2440f050e2d8",
                    "__v": 0
                },
                "owner": "5c35549122cf2440f050e2d8",
                "__v": 0
            }
        ]
    }

  #### 2. Add a new product to the shopping cart based on their related cart owners.
  ##### URL 
  34.73.47.8:3000/carts
  ##### Method
  POST
  ##### Data Params
  {"products":"product id"}
  ##### Success Response
  Code: 200 
  Content:{
        "_id": "5c44ec28ed35d35a78851ac3",
        "updatedAt": "2019-01-20T21:46:16.162Z",
        "createdAt": "2019-01-20T21:46:16.162Z",
        "products": "5c3561a09362945e942252d6",
        "owner": "5c35549122cf2440f050e2d8",
        "__v": 0
    }

  ##### Error Response
  Code: 404 
  Content: 'Product not found in request body'

  #### 3. Clear all the products in the shopping cart based on their related cart owners.
  ##### URL 
  34.73.47.8:3000/carts
  ##### Method
  DELETE
  ##### Success Response
  Code: 200 
  Content:{
        "n": 1,
        "ok": 1
    }



  #### 4. Delete a specified product in the shopping cart based on its id.
  ##### URL 
  34.73.47.8:3000/carts/:cartId
  ##### Method
  DELETE
  ##### Success Response
  Code: 200 
  Content:{
        "n": 1,
        "ok": 1
    }

  #### 5. Transact all the products in the shopping cart.
  ##### URL 
  34.73.47.8:3000/carts/placeorder?
  ##### Method
  POST
  ##### Success Response
  Code: 200 
  Content:{
        "success": true,
        "status": 'Transaction Successful!'
    }
  ##### Error Response
  Code: 404 
  Content: 'Some products have no inventory and we kept these products in your shopping cart. Other products have been transacted.'