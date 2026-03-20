// Import necessary components and functions from react-router-dom.
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Contact } from "./pages/Contact";
import { Information } from "./pages/Information";
import { RegistroEmbarazo } from "./pages/RegistroEmbarazo";
import Recordatorios from "./pages/Recordatorios";
import { Noticias } from "./pages/NoticiasParto";
import { NoticiasEmbarazo } from "./pages/NoticiasEmbarazo";
import { AvancesMedicos } from "./pages/AvancesMedicos";
import { Dashboard } from "./pages/Dashboard";

// 1. IMPORTAMOS LA FUNCIÓN INJECTCONTEXT
import injectContext from "./appContext";

// 2. ENVOLVEMOS TU LAYOUT CON EL CONTEXTO GLOBAL
const ContextLayout = injectContext(Layout);

export const router = createBrowserRouter(
  createRoutesFromElements(
    // 3. REEMPLAZAMOS <Layout /> POR <ContextLayout />
    <Route path="/" element={<ContextLayout />} errorElement={<h1>Not found!</h1>} >

      {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/registroEmbarazo" element={<RegistroEmbarazo />} />
      <Route path="/informacion" element={<Information />} />
      <Route path="/recordatorio" element={<Recordatorios />} />
      <Route path="/noticias" element={<Noticias />} />
      <Route path="/noticiasEm" element={<NoticiasEmbarazo />} />
      <Route path="/avances" element={<AvancesMedicos />} />
    </Route>
  )
);