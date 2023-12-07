# bot-products-server

### Project setup

- npm install
- Create .env file and paste environment variables from env.example.txt
- npm run server (for starting server)

### Implmented features

- JWT for authentication and autharizations
- Added validation on login and register apis
- Used standard password validation and unique email validation
- JWT token only valid for 5 minutes
- Implemented rate limiter on server to only accept 5 requests in 1 second.
- Used MongoDb for storing users data and products data.
- Created Products API
  - Used validation for product fields
  - Added logic to validate URLs
  - Implemented 5 products per page
  - Impleneted Pagination, searching and filtering products in single API
    - http://localhost:3030/api/users/get-all
    - Pagination
      - Use page and limit query parameters to get paginated data
      - Ex. http://localhost:3030/api/products/get-all?page=1&limit=10
    - Searching
      - Use search query parameters to get search result of products
      - Ex. http://localhost:3030/api/products/get-all?search=Product
    - Filtering
      - Use filter query parameters to get filtered result of products based on productType
      - Ex. http://localhost:3030/api/products/get-all?filter=simple
    - Created API for update and delete products
