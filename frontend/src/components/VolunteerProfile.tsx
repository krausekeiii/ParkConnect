import React from 'react';

interface VolunteerProfileProps {
  name: string;
  experience: string;
  skills: string[];
}

const VolunteerProfile: React.FC<VolunteerProfileProps> = ({ name, experience, skills }) => {
  return (
    <div>
      <h1>{name}</h1>
      <p>Experience: {experience}</p>
      <h3>Skills:</h3>
      <ul>
        {skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>
  );
};

export default VolunteerProfile;
