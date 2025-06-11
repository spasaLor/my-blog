# My blog 

A fully functional blog website featuring **two separate frontends** — one for readers and one for writers — all powered by a shared REST API backend.

---

## Features

- **Public Reading:** Anyone can read articles without logging in
- **User Authentication:** Login and registration for readers and writers
- **Commenting:** Only logged-in users can comment on posts
- **Writer Dashboard:** Writers can create, edit, publish, and delete their posts
- **Dual Frontends:** React-based frontends for both readers and writers

---

## 🖥️ Live Demo

Check out the live version here: [my-blog-rt9u.onrender.com](https://my-blog-rt9u.onrender.com)

---

## 🛠️ Tech Stack

- **Frontend:** React (two separate apps for users and writers)
- **Backend:** Node.js, Express REST API
- **Database:** PostgreSQL (hosted on Neon)
- **ORM:** Prisma
- **Styling:** CSS

---

## 🚀 Getting Started

1. **Clone the repository**

2. **Install dependencies for backend and frontends**

3. **Set up environment variables**
- Create `.env` files for backend and frontends
- Add your database credentials, JWT secrets, and other configs

4. **Run the backend**
5. **Run the user or the author frontend**

---

## 📡 REST API Endpoints

### Authors API (`/authors`)

| Method | Endpoint                       | Description                    |
|--------|-------------------------------|---------------------------------|
| POST   | `/register`                   | Register a new author           |
| POST   | `/login`                      | Login an author                 |
| GET    | `/personal`                   | Get the personal area           |
| POST   | `/new_post`                   | Create a new post               |
| GET    | `/all_from_author`            | Get all posts from an author    |
| GET    | `/all_unpublished_from_author`| Get all unpublished posts       |
| PUT    | `/publish`                    | Publish a post                  |
| PUT    | `/edit_post`                  | Edit a post                     |
| DELETE | `/delete_post`                | Delete a post                   |
| GET    | `/:authorId`                  | Get author details by ID        |

### Posts API (`/posts`)

| Method | Endpoint               | Description                    |
|--------|-----------------------|---------------------------------|
| GET    | `/limit/:limit`        | Get limited number of posts    |
| GET    | `/all`                 | Get all posts                  |
| GET    | `/:postId`             | Get post by ID                 |
| POST   | `/:postId/new_comment` | Add a new comment to a post    |
| GET    | `/all_from_author`     | Get all posts from an author   |

### App-level APIs

| Method | Endpoint    | Description                  |
|--------|-------------|------------------------------|
| POST   | `/register` | Register a user              |
| POST   | `/login`    | User login                   |
| GET    | `/me`       | Get current user info        |
| GET    | `/logout`   | Logout the user              |

---

## 🙌 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests. For major changes, please open an issue first to discuss your ideas.

---

## 📬 Contact

For questions or feedback, please open an issue or contact me via GitHub.

---

## 👏 Credits

Built with ❤️ using React, Express, Prisma, and PostgreSQL.

---

