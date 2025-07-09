# `POST /api/posts`: Create a new post

## Request Body

```json
{
    "author": "string",
    "password": "string",
    "title": "string",
    "content": "string"
}
```

## Response

```json
{
    "id": "number",
    "author": "string",
    "title": "string",
    "content": "string"
}
```

# `GET /api/posts`: Retrieve all posts

## Response

```json
[
    {
        "id": "number",
        "author": "string",
        "title": "string",
        "content": "string"
    },
    ...
]
```

# `GET /api/posts/{id}`: Retrieve a specific post by ID

## Response

```json
{
    "content": "string",
    "author": "string",
    "title": "string",
    "id": "number",
    "createdAt": "string",
    "updatedAt": "string",
    "password": "string"
}
```

# `PUT /api/posts/{id}`: Update a specific post by ID

## Request Body

```json
{
    "title": "string",
    "content": "string",
    "password": "string"
}
```

# `DELETE /api/posts/{id}`: Delete a specific post by ID

## Request Body

```json
{
    "password": "string"
}
```

# `GET /api/comments/post/{postId}`: Retrieve all comments for a specific post by post ID

## Response

```json
[
    {
        "id": "string",
        "postId": "number",
        "author": "string",
        "content": "string",
        "createdAt": "string"
    },
    ...
]
```

# `POST /api/comments/post/{postId}`: Create a new comment for a specific post by post ID

```json
{
    "postId": "number",
    "author": "string",
    "content": "string",
    "password": "string"
}
```

# `PUT /api/comments/{id}`: Update a specific comment by ID

## Request Body

```json
{
    "content": "string",
    "password": "string"
}
```

# `DELETE /api/comments/{id}`: Delete a specific comment by ID

## Request Body

```json
{
    "password": "string"
}
```
