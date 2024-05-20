import React, { useState } from 'react';
import Header from './Components/Header';
import axios from 'axios';
import { API_URL } from './API';

const TaskForm = () => {
    const [formData, setFormData] = useState({
        TaskName: '',
        IsTech: true,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API_URL}/createtask`, formData);
            console.log("Task created:", response.data);
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        console.log("Input changed:", { [name]: type === 'checkbox' ? checked : value });
    };

    return (
        <>
            <Header />
            <div className='container'>
                <div className='row'>
                    <form onSubmit={handleSubmit}>
                        <div className="row mt-2 me-1 search-report-card">
                            <label>Task Name</label>
                            <input type='text' name='TaskName' onChange={handleInputChange} /><br />
                            <label>IsTech</label>
                            <input 
                                type="checkbox" 
                                id="booleanInput" 
                                name="IsTech" 
                                checked={formData.IsTech} 
                                onChange={handleInputChange} 
                            /><br />
                            <input type='submit' value='Submit' />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default TaskForm;
