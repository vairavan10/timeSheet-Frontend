import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEnvelope, FaPhoneAlt, FaBriefcase, FaCalendarAlt, FaUsersCog, FaLaptopCode } from "react-icons/fa";
import "../style/profile.css"; // External CSS for styling
import SideMenu from "./sidebar";
import Layout from "./layout";

const Profile = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      const userData = JSON.parse(localStorage.getItem("user"));
      console.log("User data:", userData);

      if (!userData || !userData.id) {
        console.error("No employee ID found in localStorage.");
        setError("No employee ID found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/employees/${userData.id}`
        );
        if (response.status === 200) {
          setEmployee(response.data);
        } else {
          setError("Employee not found.");
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setError("Error fetching employee data.");
      }
      setLoading(false);
    };

    fetchEmployee();
  }, []);

  if (loading) return <p>Loading employee data...</p>;
  if (error) return <p>{error}</p>;

  const formattedJoiningDate = new Date(employee.joiningDate).toLocaleDateString();

  return (
    <Layout>
    {/* <SideMenu/> */}
    <div className="profile-container">
      <div className="profile-header">
        <h2>{employee.name}</h2>
        <p className="role">{employee.role}</p>
      </div>

      <div className="profile-cards">
        <div className="profile-card">
          <FaEnvelope className="profile-icon" />
          <h4>Email</h4>
          <p>{employee.email}</p>
        </div>

        <div className="profile-card">
          <FaPhoneAlt className="profile-icon" />
          <h4>Phone</h4>
          <p>{employee.phone}</p>
        </div>

        <div className="profile-card">
          <FaBriefcase className="profile-icon" />
          <h4>Designation</h4>
          <p>{employee.designation}</p>
        </div>

        <div className="profile-card">
          <FaCalendarAlt className="profile-icon" />
          <h4>Joining Date</h4>
          <p>{formattedJoiningDate}</p>
        </div>

        <div className="profile-card">
          <FaUsersCog className="profile-icon" />
          <h4>Experience</h4>
          <p>{employee.experience} years</p>
        </div>

        <div className="profile-card">
          <FaLaptopCode className="profile-icon" />
          <h4>Skills</h4>
          <p>{employee.skills.join(", ")}</p>
        </div>
      </div>
    </div>
    </Layout>    
  );
};

export default Profile;
