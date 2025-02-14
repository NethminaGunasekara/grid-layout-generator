import Header from "@/components/Header/Header";
import GridEditor from "@/features/grid-editor";
import Instructions from "./components/Instructions/Instructions";
import "react-toastify/dist/ReactToastify.css";
import "./styles/App.scss";
import { Bounce, ToastContainer } from "react-toastify";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <>
      <Header />
      <GridEditor />
      <Instructions />
      <Footer />

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        limit={3}
        toastClassName={"toast-container"}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="dark"
        transition={Bounce}
      />
    </>
  );
}

export default App;
