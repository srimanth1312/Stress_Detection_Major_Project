import React from 'react'
import "../styles/About.css"
const About = () => {
  return (
    <div className='about'>
        <div className="about-content">
        <p className="about-heading">
        Welcome to our major project focused on facial and speech emotion detection. <br /> In today's digital age, understanding human emotions is crucial for various applications, for example stress detection. <br /> Our project aims to provide an advanced solution for detecting emotions from both facial expressions and speech patterns.
        </p>
        <p className="about-details">
        <span>Project done by</span>
            D. Ruthwik Reddy - 20BD1A6610 <br />
            A. Dinesh Reddy - 20BD1A6602 <br />
            K. Srimanth Rao - 20BD1A6623<br />
            K. Sathvik Reddy - 20BD1A6621<br />
        </p>
        <p className="about-details">
        <span>Project Mentor</span>
            Mr T. Venu 
        </p>
        </div>
    </div>
  )
}

export default About

