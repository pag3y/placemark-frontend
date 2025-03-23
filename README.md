
# 📍 Placemark App — Frontend

This is the **frontend** for the Historical Placemark application. It is built using **React**, **Vite**, and communicates with the Firebase-backed Node.js API for placemark and user management.

---

## 🚀 Features

- 🧭 View, create, edit, and delete placemarks
- 🗺️ Interactive map view (Leaflet)
- 🔐 Authentication with JWT
- 🧑‍🤝‍🧑 Role-based access (admin and user)
- 💬 Public social feed with likes and comments
- 📱 Fully responsive design
- 🎨 Clean UI with historical theme

---

## 🛠️ Technologies Used

- React (via Vite)
- Firebase Authentication (JWT issued by backend)
- Leaflet (maps)
- Axios (HTTP requests)
- React Router DOM
- Date-fns (timestamps)
- CSS Modules / Custom Styling

---

## 🧪 Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/placemark-frontend.git
cd placemark-frontend

# Install dependencies
yarn install

# Run the development server
yarn dev
```

Frontend will run on `http://localhost:5173`

---

## 📁 Project Structure

```
src/
├── api/                 # Axios instance
├── components/          # UI components (Navbar, Forms, Cards)
├── pages/               # Route pages (Dashboard, Login, Signup, Profile)
├── styles/              # Global & component-level CSS
├── utils/               # Auth helpers & context
└── main.jsx             # Entry point
```

---

## 🌍 Deployment (Netlify)

This app is ready for Netlify deployment.

1. Push your frontend to GitHub
2. Go to [Netlify](https://app.netlify.com/)
3. Choose "Import from GitHub"
4. Set the build command as: `yarn build`
5. Set the publish directory to: `dist`

---

## 🔐 Environment Variables

Create a `.env` file in the root:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Adjust the API base URL as needed depending on deployment.

---

## 👨‍💻 Author

Developed by Tom as part of the Higher Diploma in Computer Science, Assignment 1.

---

## 📜 License

This project is for academic use. No license provided.