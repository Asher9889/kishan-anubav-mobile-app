# User Profile API Endpoints

## 1. GET /users/:id — Fetch user profile

Fetch another user's public profile by ID.

### Request

```
GET /users/{userId}
Authorization: Bearer <token>
```

### Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User fetched successfully",
  "data": {
    "user": {
      "id": "string",
      "fullName": "string",
      "name": "string | null",
      "username": "string",
      "bio": "string",
      "occupation": "string | null",
      "avatar": "string | null",
      "state": "string | null",
      "city": "string | null",
      "district": "string | null",
      "village": "string | null",
      "postsCount": 0,
      "followersCount": 0,
      "followingCount": 0
    }
  }
}
```

### Consumed by

- `src/features/user-profile/api/userProfile.api.ts` → `fetchUserProfile(userId)`
- Hook: `src/features/user-profile/hooks/useUserProfile.ts` (via `useQuery`)

---

## 2. GET /posts — Fetch user's posts

Fetch paginated posts belonging to a specific user.

### Request

```
GET /posts?userId={userId}&limit=20&page=1
Authorization: Bearer <token>
```

### Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Posts fetched successfully",
  "data": {
    "posts": [
      {
        "id": "string",
        "userId": "string",
        "name": "string",
        "location": "string",
        "state": "string",
        "district": "string",
        "knowledge": "string",
        "images": ["string"],
        "likesCount": 0,
        "commentsCount": 0,
        "isActive": true,
        "createdAt": "string",
        "updatedAt": "string"
      }
    ],
    "totalPosts": 0
  }
}
```

### Consumed by

- `src/features/user-profile/api/userProfile.api.ts` → `fetchUserPosts(userId)`
- Hook: `src/features/user-profile/hooks/useUserProfile.ts` (via `useQuery`, `select` transforms to `posts[]`)

---

## Notes

- Both endpoints reuse the existing `nodeApi` axios instance which handles auth tokens automatically.
- The `/posts` endpoint is already defined at `endPoints.POSTS.GET` (`GET /posts`). It already exists in the codebase — only the user profile endpoint `/users/:id` is new.
- Error responses should follow the standard format: `{ success: false, statusCode: 4xx/5xx, message: "error description" }`.
