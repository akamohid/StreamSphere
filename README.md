# 🎥 StreamSphere  
*A full-stack video streaming platform with secure authentication, subscriptions, playlists, and rich user interaction.*

---

## 🚀 Overview  
**StreamSphere** is a modern, full-stack video platform inspired by real-world streaming applications. It enables users to upload, watch, and interact with video content through features like likes, comments, subscriptions, and playlists.  

The project is built with a clean separation between frontend and backend, focusing on scalability, security, and maintainability.

---

## ✨ Key Features  
- 🔐 **Secure Authentication** – JWT-based login/signup with protected routes  
- 🎥 **Video Upload & Streaming** – Videos stored and served efficiently  
- 👍 **Likes System** – Like/unlike videos and comments  
- 💬 **Comments** – Engage with video discussions  
- 🔔 **Subscriptions** – Subscribe to channels and track creators  
- 📋 **Playlists** – Create and manage personalized playlists  
- 🧱 **Modular Architecture** – Clean MVC-style backend & component-based frontend  

---

## 🛠️ Technologies Used  

### Frontend  
- ⚛️ **React** – Component-based UI  
- ⚡ **Vite** – Fast build tool & dev server  
- 🎨 **Tailwind CSS** – Utility-first styling  
- 🔁 **React Router** – Client-side routing  
- 🌐 **Axios** – API communication  

### Backend  
- 🟢 **Node.js** – Runtime environment  
- 🚂 **Express.js** – REST API framework  
- 🍃 **MongoDB** – NoSQL database  
- 🧩 **Mongoose** – ODM for MongoDB  
- 🔐 **JWT** – Authentication & authorization  
- 🔑 **Bcrypt** – Password hashing  
- ☁️ **AWS S3** – Video storage  
- 📂 **Multer** – File upload handling  

---

## 📁 Project Structure  
```
StreamSphere/
│
├── src/
│ ├── Backend/
│ │ ├── Controller/
│ │ ├── Model/
│ │ ├── Routes/
│ │ ├── Middleware/
│ │ ├── AWS/
│ │ ├── DataBase/
│ │ ├── Auth/
│ │ └── server.js
│ │
│ └── Frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── hooks/
│ │ ├── store/
│ │ ├── utils/
│ │ └── routes/
│ └── index.html
```
---

## ⚙️ Setup & Usage  

### 1️⃣ Clone the Repository  
    git clone https://github.com/akamohid/StreamSphere.git
    cd StreamSphere

### 2️⃣ Backend Setup  
    cd src/Backend
    npm install


### 3️⃣ Frontend Setup  
    cd ../Frontend
    npm install

### 4️⃣ Run the Project  
Run backend and frontend in separate terminals:

    npm start      # Backend
    npm run dev    # Frontend

---

## 📌 Design Philosophy  
- Separation of concerns (routes, controllers, models)  
- Reusable UI components  
- Secure authentication workflow  
- Scalable and extendable architecture  

---

## 🤝 Contribution  
Contributions are welcome!  
- Fork the repository  
- Create a feature branch  
- Commit meaningful changes  
- Submit a pull request  

---

## 📄 License  
This project is licensed under the **MIT License**.  
You are free to use, modify, and distribute it.

---

## 👤 Author  
**Mohid Arshad**  
- GitHub: (akamohid)[https://github.com/akamohid]
- LinkedIn: (akamohid)[https://www.linkedin.com/in/akamohid]

---

⭐ If you find this project useful, consider giving it a star!  
Happy Coding 🚀
