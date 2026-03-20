import { Navigate, Route, Routes } from "react-router";
import { ScreenServices } from "../services/components/ScreenServices";
import { Login } from "./Login";
import { FormRegister } from "./FormRegister";
import { PrivateRoute } from "../components/PrivateRoute ";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<FormRegister />} />
      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<ScreenServices />} />
      </Route>
    </Routes>
  );
};
