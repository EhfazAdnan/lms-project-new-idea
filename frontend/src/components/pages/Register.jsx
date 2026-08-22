import React from "react";
import Layout from "./common/Layout";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { apiUrl } from "./common/Config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Register = () => {

  const { handleSubmit, register, formState: { errors }, setError, watch } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    await fetch(`${apiUrl}/register`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 200) {
        // Handle successful registration (e.g., redirect to login page)
        toast.success(data.message);
        navigate("/account/login");
      } else {
         Object.keys(data.errors).forEach((field) => {
          setError(field, { type: "manual", message: data.errors[field][0] });
        });
      }
    });
  }

  return (
    <Layout>
      <div className="container py-5 mt-5">
        <div className="d-flex align-items-center justify-content-center">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card border-0 shadow register">
              <div className="card-body p-4">
                <h3 className="border-bottom pb-3 mb-3">Register</h3>

                <div className="mb-3">
                  <label className="form-label" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    placeholder="Name"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && <p className="invalid-feedback">{errors.name.message}</p>}
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    placeholder="Email"
                    {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })}
                  />
                  {errors.email && <p className="invalid-feedback">{errors.email.message}</p>}
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""} `}
                    placeholder="Password"
                    {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })} 
                  />
                  {errors.password && <p className="invalid-feedback">{errors.password.message}</p>}
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="password_confirmation">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className={`form-control ${errors.password_confirmation ? "is-invalid" : ""} `}
                    placeholder="Confirm Password"
                    {...register("password_confirmation", { required: "Please confirm your password", validate: (value) => value === watch("password") || "Passwords do not match" })} 
                  />
                  {errors.password_confirmation && <p className="invalid-feedback">{errors.password_confirmation.message}</p>}
                </div>

                <div>
                  <button className="btn btn-primary w-100">Register</button>
                </div>

                <div className="d-flex justify-content-center py-3">
                  Already have account? &nbsp;
                  <Link className="text-secondary" to={`/account/login`}>
                    {" "}
                    Login
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

export default Register;
