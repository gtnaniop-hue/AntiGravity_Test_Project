# FitPulse Deployment Guide

This guide will help you deploy the FitPulse application to the web. We will use **Render** for the backend and **Vercel** for the frontend.

## Prerequisites

- [GitHub Account](https://github.com/) (to host your code)
- [Render Account](https://render.com/) (for Backend)
- [Vercel Account](https://vercel.com/) (for Frontend)
- [MongoDB Atlas Account](https://www.mongodb.com/atlas/database) (which you already have!)

---

## Step 1: Push Code to GitHub

1.  Initialize a git repository in your project root (`fitpulse/`):
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  Create a new repository on GitHub.
3.  Push your code to GitHub:
    ```bash
    git remote add origin <your-repo-url>
    git push -u origin master
    ```

---

## Step 2: Deploy Backend (Render)

1.  Log in to **Render**.
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  Select the repository you just pushed.
5.  Configure the service:
    -   **Name**: `fitpulse-backend`
    -   **Root Directory**: `backend`
    -   **Runtime**: `Node`
    -   **Build Command**: `npm install`
    -   **Start Command**: `node server.js`
6.  **Environment Variables**:
    -   Scroll down to "Environment Variables" and add:
        -   `MONGO_URI`: *Paste your MongoDB Atlas connection string here*
        -   `JWT_SECRET`: *Enter a secret key (e.g., mysecretkey123)*
        -   `NODE_ENV`: `production`
7.  Click **Create Web Service**.
8.  Wait for the deployment to finish. Copy the **Service URL** (e.g., `https://fitpulse-backend.onrender.com`).

---

## Step 3: Deploy Frontend (Vercel)

1.  Log in to **Vercel**.
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  Configure the project:
    -   **Root Directory**: Click "Edit" and select `frontend`.
    -   **Framework Preset**: Vite
5.  **Environment Variables**:
    -   Expand "Environment Variables".
    -   Add:
        -   `VITE_API_URL`: *Paste your Render Backend URL here* (Important: Add `/api` at the end, e.g., `https://fitpulse-backend.onrender.com/api`)
6.  Click **Deploy**.

---

## Step 4: Final Verification

1.  Once Vercel finishes, click the **Visit** button.
2.  Try to **Sign Up** or **Login**.
3.  If everything is configured correctly, your app is now live!

---

## Troubleshooting

-   **CORS Errors**: If you see CORS errors in the browser console, ensure your Backend allows requests from your Vercel domain. (Currently, the backend allows all origins, so this should be fine).
-   **Database Connection**: Check Render logs to ensure the backend connected to MongoDB successfully.
