import React, { useEffect, useState } from "react";

interface Recipe {
  _id: string;
  title: string;
  author: {
    name: string;
  };
}

interface User {
  _id: string;
  totalLikes: number;
}

const Dashboard: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalRecipes, setTotalRecipes] = useState<number>(0);
  const [topLikedRecipes, setTopLikedRecipes] = useState<Recipe[]>([]);
  const [topRecommendedUsers, setTopRecommendedUsers] = useState<User[]>([]);
  const [isAuth, setAuth] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const cardColors = ["#FFA07A", "#87CEEB", "#FFD700", "#98FB98"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, recipesResponse] = await Promise.all([
          fetch("https://recipe-be-ekcs.onrender.com/api/users/count"),
          fetch("https://recipe-be-ekcs.onrender.com/api/recipes/count"),
        ]);

        const [usersData, recipesData] = await Promise.all([
          usersResponse.json(),
          recipesResponse.json(),
        ]);

        setTotalUsers(usersData?.count || 0);
        setTotalRecipes(recipesData?.count || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchRecipesTopLiked = async () => {
      try {
        const response = await fetch(
          "https://recipe-be-ekcs.onrender.com/api/recipes/top-liked"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setTopLikedRecipes(data.topLikedRecipes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchUsersTopLiked = async () => {
      try {
        const response = await fetch(
          "https://recipe-be-ekcs.onrender.com/api/users/top-liked"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setTopRecommendedUsers(data.topLikedUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    fetchRecipesTopLiked();
    fetchUsersTopLiked();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "https://recipe-be-ekcs.onrender.com/api/user/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to login");
      }
      const result = await response.json();
      if (result?.username === "ADMIN") {
        setAuth(true);
      } else {
        alert("Username or password is wrong");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleLogout = () => {
    setAuth(false);
  };

  return (
    <div>
      {isAuth ? (
        <>
          <header className="dashboard-header">
            <div className="dashboard-title">Dashboard</div>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </header>
          <div className="dashboard-container">
            <div className="dashboard-grid">
              <div
                className="dashboard-card"
                style={{ backgroundColor: cardColors[0] }}
              >
                <h2>Total Users</h2>
                <p>{totalUsers}</p>
              </div>
              <div
                className="dashboard-card"
                style={{ backgroundColor: cardColors[1] }}
              >
                <h2>Total Recipes</h2>
                <p>{totalRecipes}</p>
              </div>
              <div
                className="dashboard-card"
                style={{ backgroundColor: cardColors[2] }}
              >
                <h2>Top Liked Recipes</h2>
                <ul>
                  {topLikedRecipes.map((recipe) => (
                    <li key={recipe._id}>
                      <h3>{recipe.title}</h3>
                      <p>Author: {recipe.author.name}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className="dashboard-card"
                style={{ backgroundColor: cardColors[3] }}
              >
                <h2>Top Recommended Users</h2>
                <ul>
                  {topRecommendedUsers.map((user) => (
                    <li key={user._id}>
                      <p>{user._id}</p>
                      <p>Total Likes: {user.totalLikes}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="login-container">
          <h2>Login</h2>
          <div className="form-group">
            <label>Username:</label>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              type="text"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
            />
          </div>
          <button type="submit" onClick={handleLogin}>
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
