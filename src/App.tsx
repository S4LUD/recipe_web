import "./App.css";
import { useLocation } from "react-router-dom";
import { useEffect, useCallback, useState } from "react";

interface Author {
  name: string;
  username: string;
  image: string;
}

interface UserId {
  _id: string;
  image: string;
}

interface Ingredient {
  value: string;
  _id: string;
}

interface Method {
  value: string;
  number: number;
  _id: string;
  public_id?: string;
  secure_url?: string;
}

interface Comment {
  _id: string;
  comment: string;
  user_id: {
    _id: string;
    firstName: string;
    lastName: string;
    image: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Recipe {
  author: Author;
  _id: string;
  userId: UserId;
  title: string;
  info: string;
  ingredients: Ingredient[];
  methods: Method[];
  categories: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  image: string;
  image_public_id: string;
  likes: number;
  comments_id: Comment[];
}

function App() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const _id = queryParams.get("_id");
  const [recipeData, setRecipeData] = useState<Recipe | undefined>(undefined);

  const fetchRecipe = useCallback(async () => {
    try {
      const abortController = new AbortController();
      const signal = abortController.signal;

      setTimeout(() => {
        // Cancel the fetch request if component unmounts or dependency changes
        abortController.abort();
      }, 1000);

      const response = await fetch(
        "https://recipe-be-ekcs.onrender.com/api/user/get/recipe",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _id: _id,
          }),
          signal, // Pass the AbortSignal to the fetch request
        }
      );

      if (!signal.aborted) {
        const result = await response.json();
        setRecipeData(result.mostRecentRecipe["0"]);
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        console.log("Fetch request aborted");
      } else {
        console.log(error);
      }
    }
  }, [_id]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  const generateInitials = (name: string) => {
    const nameWords = name.split(" ");
    return nameWords
      .map((word: string) => word.charAt(0).toUpperCase())
      .join("");
  };

  return (
    <div className="container">
      <div className="content">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            flexDirection: "column",
            gap: 20,
          }}
        >
          <p style={{ fontSize: 35, fontWeight: "600" }}>Recipes</p>
          <p style={{ textAlign: "center" }}>{recipeData?.info}</p>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap", // Allow items to wrap to the next line
            alignItems: "center",
            justifyContent: "center",
            gap: 15,
            marginBottom: 20,
            maxWidth: "100%", // Set a maximum width to control when wrapping occurs
          }}
        >
          {recipeData?.categories.map((item, index) => {
            return (
              <div
                style={{
                  background: "#FFC6C8",
                  paddingTop: 5,
                  paddingBottom: 5,
                  paddingLeft: 15,
                  paddingRight: 15,
                  borderRadius: 10,
                  whiteSpace: "nowrap", // Prevent text from wrapping within each category
                }}
                key={index}
              >
                {item}
              </div>
            );
          })}
        </div>
        <div>
          <img className="image" src={recipeData?.image} />
          <div>
            <p style={{ fontSize: 22, fontWeight: "600" }}>
              {recipeData?.title}
            </p>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginTop: 10,
          }}
        >
          {recipeData && (
            <div
              style={{
                display: "flex",
                background: "#3CA2FA",
                paddingTop: 5,
                paddingBottom: 5,
                paddingRight: 10,
                paddingLeft: 10,
                borderRadius: 10,
                gap: 5,
              }}
            >
              <p style={{ color: "white" }}>Likes:</p>
              <p style={{ color: "white" }}>
                {recipeData.likes <= 0 ? 0 : recipeData.likes}
              </p>
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 20,
            alignItems: "center",
            marginTop: 10,
          }}
        >
          {recipeData?.userId.image ? (
            <img
              src={recipeData?.userId.image}
              height={50}
              style={{ borderRadius: 100 }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                height: 50,
                width: 50,
                borderRadius: 100,
                background: "#3CA2FA",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
                {generateInitials(recipeData?.author.name || "")}
              </p>
            </div>
          )}
          <div>
            <p>{recipeData?.author.name}</p>
            <p>@{recipeData?.author.username}</p>
          </div>
        </div>
        <div style={{ marginTop: 15 }}>
          <p style={{ fontSize: 18, marginBottom: 10, fontWeight: "500" }}>
            Ingredients
          </p>
          {recipeData?.ingredients.map((item, index) => {
            return (
              <div style={{ marginBottom: 5 }} key={index}>
                - {item.value}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 15 }}>
          <p style={{ fontSize: 18, marginBottom: 10, fontWeight: "500" }}>
            Methods
          </p>
          {recipeData?.methods
            .slice() // Create a shallow copy to avoid mutating the original array
            .sort((a, b) => a.number - b.number) // Sort by item.number in ascending order
            .map((item, index) => {
              return (
                <div style={{ marginBottom: 5 }} key={index}>
                  <p>
                    {item.number}. {item.value}
                  </p>
                  <img src={item.secure_url} style={{ width: "100%" }} />
                </div>
              );
            })}
        </div>
        <div>
          <p style={{ fontSize: 18, marginBottom: 10, fontWeight: "500" }}>
            Recipe Feedbacks
          </p>
          {recipeData?.comments_id.map((item, index) => {
            return (
              <div key={index} style={{ display: "flex", marginBottom: 15 }}>
                <div style={{ marginRight: 10 }}>
                  {item.user_id.image ? (
                    <img
                      src={item.user_id.image}
                      height={50}
                      style={{ borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        height: 50,
                        width: 50,
                        borderRadius: 100,
                        background: "#3CA2FA",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <p
                        style={{
                          color: "white",
                          fontSize: 18,
                          fontWeight: "600",
                        }}
                      >
                        {generateInitials(
                          `${item.user_id.firstName} ${item.user_id.lastName}` ||
                            ""
                        )}
                      </p>
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 5 }}
                  >
                    <p style={{ fontWeight: "bold" }}>
                      {item.user_id.firstName} {item.user_id.lastName}
                    </p>
                    <p>{item.comment}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
