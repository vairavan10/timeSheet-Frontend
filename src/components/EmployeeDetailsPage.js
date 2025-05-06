import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To get the employee ID from the URL
import axios from '../axios';
import '../style/profile.css'; // Import the CSS
import Layout from './layout';

const EmployeeDetailsPage = () => {
  const { id } = useParams(); // Get the employee ID from the URL
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch employee details when the component mounts
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(`api/employees/${id}`); // Adjust URL to match your API endpoint
        setEmployee(response.data); // Store the employee data
      } catch (error) {
        setError('Error fetching employee details');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeDetails();
  }, [id]); // Fetch details when the ID changes

  // Loading, error, or no employee found cases
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!employee) return <p>No employee found</p>;

  return (
    <Layout>
      <div className="hero-profile-container">
        <div className="hero-profile-card">
          {/* Profile Image */}
          <img
            src={`https://ui-avatars.com/api/?name=${employee.name}&background=random`}
            alt="Profile"
            className="hero-avatar"
          />
          {/* Employee Name and Role */}
          <h1 className="hero-name">{employee.name}</h1>
          <p className="hero-role">{employee.role}</p>
  
          {/* Contact Information */}
          <div className="hero-contact">
            <p>📧 {employee.email}</p>
            <p>📞 {employee.phone}</p>
          </div>
  
          {/* Employee Details */}
          <div className="hero-details-grid">
            <div className="hero-detail">
              <h4>🧑‍💼 Designation</h4>
              <p>{employee.designation}</p>
            </div>
            <div className="hero-detail">
              <h4>🛠️ Skills</h4>
              <p>{employee.skills.join(', ')}</p>
            </div>
            <div className="hero-detail">
              <h4>📈 Experience</h4>
              <p>{employee.experience} years</p>
            </div>
            <div className="hero-detail">
              <h4>📅 Joining Date</h4>
              <p>{new Date(employee.joiningDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeDetailsPage;
