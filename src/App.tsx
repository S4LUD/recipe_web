import "./App.css";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("_id");
  console.log(id);

  return <div></div>;
}

export default App;
