import React from "react";
import { Link } from "react-router-dom";
import Layout from "./common/Layout";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "./common/Config";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../context/Auth";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { handleSubmit, register, formState: { errors }, setError } = useForm();

  const onSubmit = async (data) => {
    // Handle login logic here
    await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 200) {
        // Handle successful login (e.g., redirect to dashboard)
        const userInfo = {
          name: data.name,
          id: data.id,
          token: data.access_token
        };
        localStorage.setItem("userInfoLms", JSON.stringify(userInfo));
        login(userInfo);
        navigate("/account/dashboard");
      } else {
        toast.error(data.message);
      }
    });
  };

  return (
    <Layout>
      <div className="container py-5 mt-5">
        <div className="d-flex align-items-center justify-content-center">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card border-0 shadow login">
              <div className="card-body p-4">
                <h3 className="border-bottom pb-3 mb-3">Login</h3>
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && <p className="text-danger">{errors.email.message}</p>}
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    {...register("password", { required: "Password is required" })}
                  />
                  {errors.password && <p className="text-danger">{errors.password.message}</p>}
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <button className="btn btn-primary">Login</button>
                  <Link to={`/account/register`} className="text-secondary">
                    Register Here
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
