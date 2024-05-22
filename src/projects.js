import React, { useEffect, useState } from 'react'
import Header from './Components/Header'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from './API'

const Projects = () => {
    const[projectDetails, setProjectDetails] = useState();
    useEffect(() => {
        const fetchProjectDetails = () => {
            axios.get(`${API_URL}/commonReport`)
            .then(response => setProjectDetails(response.data))
            .catch(error => console.error(error));
        }
        fetchProjectDetails();
    },[])
    console.log("ProjectDetails", projectDetails);
  return (
    <>
    <Header/>
    <div className='container'>
        <div className='row mt-5 text-center'>
            <div className='col-lg-3 col-md-4 col-sm-6'>
                <div className='project-card' style={{backgroundColor:'#7AB2B2',color:'white'}}>
                    <Link to="/dashboard" style={{textDecoration:'none',color:'white'}}><h4>UPDC</h4></Link>
                </div>
            </div>
            <div className='col-lg-3 col-md-4 col-sm-6'>
                <div className='project-card'style={{backgroundColor:'#AD88C6',color:'white'}}>
                    <h4>Telangana</h4>
                </div>
            </div>
            <div className='col-lg-3 col-md-4 col-sm-6'>
                <div className='project-card'style={{backgroundColor:'#9BB0C1',color:'white'}}>
                    <h4>Karnataka</h4>
                </div>
            </div>
            <div className='col-lg-3 col-md-4 col-sm-6'>
                <div className='project-card'style={{backgroundColor:'#AC7D88',color:'white'}}>
                    <h4>All Projects</h4>
                </div>
            </div>

        </div>
    </div>
    </>
  )
}

export default Projects