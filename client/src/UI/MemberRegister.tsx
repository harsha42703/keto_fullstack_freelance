import { FaRegEye } from "react-icons/fa";
import { RiEyeCloseFill } from "react-icons/ri";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState<string[]>(["STUDENT"]); // Default role
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordToggle = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleRoleChange = (e: any) => {
    const { value, checked } = e.target;
    setRoles((prevRoles) =>
      checked
        ? [...prevRoles, value]
        : prevRoles.filter((role) => role !== value)
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, roles }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("User registered successfully.");
        navigate("/admin/dashboard");
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex items-justify-center w-[80vw] rounded-lg ">
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24 w-full bg-slate-100">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          <h3 className="text-2xl sm:text-4xl font-bold border bg-gray-100 pb-1 pt-2 px-4 rounded-md w-[50%]">
            <span className="text-cyan-700">K</span>eto
            <span className="text-cyan-700">.</span>
          </h3>
          <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">
            Register User
          </h2>

          <form onSubmit={handleSubmit} className="mt-8">
            <div className="space-y-5">
              <div>
                <label className="text-base font-medium text-gray-900">
                  Name
                </label>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-400 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400"
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-base font-medium text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-400 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400"
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-base font-medium text-gray-900">
                  Password
                </label>
                <div className="mt-2">
                  <div className="flex items-center border border-gray-400 rounded-md">
                    <input
                      className="h-10 w-full rounded-l-md bg-transparent px-3 py-2 text-sm placeholder:text-gray-400"
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <div
                      onClick={handlePasswordToggle}
                      className="flex items-center px-3 cursor-pointer"
                    >
                      {isPasswordVisible ? "👁️" : "👁️‍🗨️"}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-base font-medium text-gray-900">
                  Roles
                </label>
                <div className="mt-2 space-y-2">
                  {["STUDENT", "TEACHER", "ADMIN", "PARENT"].map((role) => (
                    <div key={role} className="flex items-center">
                      <input
                        type="checkbox"
                        value={role}
                        checked={roles.includes(role)}
                        onChange={handleRoleChange}
                        className="mr-2"
                      />
                      <span>{role}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-100"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                    </svg>
                  ) : (
                    <>Register</>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AdminRegister;
