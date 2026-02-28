

import "./style.css";
import NavBar from "shared/NavBar.jsx";

function App() {
  const links = [
    { to: "/", label: "Home", end: true },
    { to: "/about", label: "About" }
  ];
  return (
    <BrowserRouter>
      <NavBar links={links} />
      <main className="main-content">
        <AppRoutes />
      </main>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
