import { useEffect, useState } from "react";

export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalRecipes, setTotalRecipes] = useState<number>(0);
  const [topLikedRecipes, setTopLikedRecipes] = useState<string[]>([]);
  const [topRecommendedUsers, setTopRecommendedUsers] = useState([]);
  const [isAuth, setAuth] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>();
  const [password, setPassword] = useState<string | null>();

  // Array of background colors for each dashboard card
  const cardColors = ["#FFA07A", "#87CEEB", "#FFD700", "#98FB98"];

  // Assume you have functions to fetch data from backend
  useEffect(() => {
    // Function to fetch total number of users
    const fetchTotalUsers = async () => {
      const abortController = new AbortController();
      const signal = abortController.signal;

      setTimeout(() => {
        // Cancel the fetch request if component unmounts or dependency changes
        abortController.abort();
      }, 1000);

      const response = await fetch(
        "https://recipe-be-ekcs.onrender.com/api/users/count",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal, // Pass the AbortSignal to the fetch request
        }
      );

      if (!signal.aborted) {
        const result = await response.json();
        if (result?.status) {
          setTotalUsers(result?.count);
        }
      }
    };

    // Function to fetch total number of recipes
    const fetchTotalRecipes = async () => {
      const abortController = new AbortController();
      const signal = abortController.signal;

      setTimeout(() => {
        // Cancel the fetch request if component unmounts or dependency changes
        abortController.abort();
      }, 1000);

      const response = await fetch(
        "https://recipe-be-ekcs.onrender.com/api/recipes/count",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal, // Pass the AbortSignal to the fetch request
        }
      );

      if (!signal.aborted) {
        const result = await response.json();
        if (result?.status) {
          setTotalRecipes(result?.count);
        }
      }
    };

    // Function to fetch top liked recipes
    const fetchTopLikedRecipes = async () => {
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

    // Function to fetch top recommended users
    const fetchTopRecommendedUsers = async () => {
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

    // Fetch data when the component mounts
    fetchTotalUsers();
    fetchTotalRecipes();
    fetchTopLikedRecipes();
    fetchTopRecommendedUsers();
  }, []);

  const handleLogin = async () => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    setTimeout(() => {
      // Cancel the fetch request if component unmounts or dependency changes
      abortController.abort();
    }, 1000);

    const response = await fetch(
      "https://recipe-be-ekcs.onrender.com/api/user/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
        signal, // Pass the AbortSignal to the fetch request
      }
    );

    if (!signal.aborted) {
      const result = await response.json();
      if (result?.username === "ADMIN") {
        setAuth(true);
      } else {
        alert("username or password is wrong");
      }
    }
  };

  const handleLogout = () => {
    // Replace this with actual logout logic
    setAuth(false);
  };

  return (
    <div>
      {isAuth ? (
        <>
          {/* Header */}
          <header className="dashboard-header">
            <div className="dashboard-title">Dashboard</div>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </header>

          {/* Dashboard Content */}
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
                    <li key={recipe?._id}>
                      <h3>{recipe?.title}</h3>
                      <p>Author: {recipe?.author.name}</p>
                      {/* Add more details as needed */}
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
                    <li key={user?._id}>
                      <p>{user?._id}</p>
                      <p>Total Likes: {user?.totalLikes}</p>
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
              onChange={(event) => setUsername(event.target.value)}
              type="text"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              onChange={(event) => setPassword(event.target.value)}
              type="password"
            />
          </div>
          <button type="submit" onClick={() => handleLogin()}>
            Login
          </button>
        </div>
      )}
    </div>
  );
}
