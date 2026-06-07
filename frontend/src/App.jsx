import Header from "./components/Header";
import ReservationPage from "./pages/ReservationPage";
import "./style.css";

const App = () => {
  return (
    <div className="app">
      <Header />
      <ReservationPage />
    </div>
  );
};

export default App;