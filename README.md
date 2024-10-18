# EXPRESS EXTRACT ROUTES

This package allows you to define and extract routes from class methods through decorators. It simplifies route declaration and management for your Node.js applications.

This package makes routing more declarative and keeps your routing logic clean and maintainable!

[github.com/kitchanismo/express-extract-routes](https://github.com/kitchanismo/express-extract-routes)

## Installation

Install the package using npm:

```bash
npm install express-extract-routes
```

## Defining Routes with Decorators

You can define routes directly within class methods using the @route decorator. The package supports various HTTP methods like GET, POST, PUT, PATCH, and DELETE through dedicated decorators.

Here’s how to use it:

```
import { route }  from express-extract-routes

class UserController {
  // Define a GET route
  @route.get('/users')
  getAllUsers() {
    // Logic for handling GET /users
  }

  // Define a POST route
  @route.post('/users')
  createUser() {
    // Logic for handling POST /users
  }
}
```

You can also apply a prefix to the routes by decorating the class itself:

```
@route('/api')
class UserController {
  @route.get('/users')
  getAllUsers() {
    // Handles GET /api/users
  }
}
```

## Route Options

You can optionally pass route-specific options, such as whether a route is protected or any other custom logic, which will be applied either to individual routes or at the class level.

## Protected Routes

You can protect specific routes by passing a protected option into the decorator:

```
@route.get('/users', { protected: true })
getAllUsers() {
  // Logic for protected route GET /users
}
```

## Override Protected Routes

You can override protected routes by passing a protected option into the decorator methods

```

@route('/api', { protected: true })
class UserController {
  @route.get('/users', { protected: false })
  getAllUsers() {
    // Handles GET /api/users
  }
}
```

## Extracting Routes

Once you’ve defined your routes, use the extract function to gather them into an array, which can be used in your application.

```
import { extract }  from express-extract-routes

const routes = extract(UserController, AuthController) // register here all your controller with routes

console.log(routes)
/* Example Output:
[
  {
    method: 'get',
    path: '/api/users',
    action: 'getAllUsers',
    options: { protected: true },
    controller: UserController
  },
  ...
]
*/
```
