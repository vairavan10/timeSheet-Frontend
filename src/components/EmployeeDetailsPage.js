import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To get the employee ID from the URL
import axios from 'axios';
import '../style/profile.css'; // Import the CSS

const EmployeeDetailsPage = () => {
  const { id } = useParams(); // Get the employee ID from the URL
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch employee details when the component mounts
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/employees/${id}`); // Adjust URL to match your API endpoint
        setEmployee(response.data); // Store the employee data
      } catch (error) {
        setError('Error fetching employee details');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeDetails();
  }, [id]); // Fetch details when the ID changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!employee) return <p>No employee found</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>{employee.name}</h2>
        <p className="role">{employee.role}</p>
      </div>

      <div className="profile-cards">
        <div className="profile-card">
          <h4>Email</h4>
          <p>{employee.email}</p>
        </div>
        <div className="profile-card">
          <h4>Phone</h4>
          <p>{employee.phone}</p>
        </div>
        <div className="profile-card">
          <h4>Designation</h4>
          <p>{employee.designation}</p>
        </div>
        <div className="profile-card">
          <h4>Skills</h4>
          <p>{employee.skills.join(', ')}</p>
        </div>
        <div className="profile-card">
          <h4>Experience</h4>
          <p>{employee.experience} years</p>
        </div>
        <div className="profile-card">
          <h4>Joining Date</h4>
          <p>{new Date(employee.joiningDate).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsPage;
