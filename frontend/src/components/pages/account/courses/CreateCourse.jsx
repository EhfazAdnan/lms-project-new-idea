import React from "react";
import Layout from "../../common/Layout";
import { Link } from "react-router-dom";
import UserSidebar from "../../common/UserSidebar";
import { useForm } from "react-hook-form";
import { apiUrl } from "../../common/Config";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { token } from "../../common/Config";

const CreateCourse = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, setError },
  } = useForm();

  const onSubmit = async (data) => {
    await fetch(`${apiUrl}/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          toast.success("Course created successfully");
          navigate("/account/courses/edit/" + data.data.id);
        } else {
          toast.error("Something went wrong");
        }
      })
    
  };

  return (
    <Layout>
      <section className="section-4">
        <div className="container pb-5 pt-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/account">Account</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Dashboard
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-md-12 mt-5 mb-3">
              <div className="d-flex justify-content-between">
                <h2 className="h4 mb-0 pb-0">Create Course</h2>
              </div>
            </div>
            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>
            <div className="col-lg-9">
              <div className="row">
                <form onSubmit={handleSubmit(onSubmit)}> 
                  <div className="card border-0 shadow-lg">
                    <div className="card-body p-4">
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                          Title
                        </label>
                        <input
                          type="text"
                          {...register("title", {
                            required: "Title is required",
                          })}
                          className={`form-control ${
                            errors.title ? "is-invalid" : ""
                          }`}
                          placeholder="Enter title"
                        />
                        {errors.title && (
                          <div className="invalid-feedback">
                            {errors.title.message}
                          </div>
                        )}
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Continue
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CreateCourse;
