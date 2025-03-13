# Backend Docs

## API Endpoints

### Auth - `/api/auth`

#### Register - `/register`

- Method: `POST`
- Description: Register a new user
- Request Body:
  - `username`: string
  - `password`: string
- Response:

```json
{ 
    "message": "User registered",
    "user": {
        "id": 1,
        "email": ""
    }
}
```

#### Login - `/login`

- Method: `POST`
- Description: Login a user
- Request Body:
  - `username`: string
  - `password`: string
- Response:

```json
{ 
    "message": "User registered",
    "loggedInUser": {
        "id": 1,
        "email": "",
    },
    "token": ""
}
```

#### Logout - `/logout`

- Method: `POST`
- Description: Logout a user
- Response:

```json
{ 
    "message": "User logged out"
}
```

### Cart - `/api/cart`

#### Get Cart - `/`

- Method: `GET`
- Description: Get the current user's cart
- Response:

```json
{
    "id": 1,
    "user_id": 1,
    "items": [
        {
            "id": 1,
            "product_id": 1,
            "quantity": 1,
            "product": {
                "id": 1,
                "name": "Product 1",
                "price": 100
            }
        }
    ]
}
```

#### Add to Cart - `/add`

- Method: `POST`
- Description: Add a product to the cart
- Request Body:
  - `product_id`: number
  - `quantity`: number
- Response:

```json
{
    "id": 1,
    "user_id": 1,
    "items": [
        {
            "id": 1,
            "product_id": 1,
            "quantity": 1,
            "product": {
                "id": 1,
                "name": "Product 1",
                "price": 100
            }
        }
    ]
}
```

#### Remove from Cart - `/remove`

- Method: `POST`
- Description: Remove a product from the cart
- Request Body:
  - `product_id`: number
- Response:

```json
    {
        "id": 1,
        "user_id": 1,
        "items": []
    }
```
