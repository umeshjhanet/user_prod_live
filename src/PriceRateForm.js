import React, { useState, useEffect, useRef } from 'react';
import Header from './Components/Header';
import axios from 'axios';
import { API_URL } from './API';

const PriceRateForm = () => {
    const [showLocation, setShowLocation] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState("");
    const dropdownRef = useRef(null);
    const [selectedLocationId, setSelectedLocationId] = useState('');
    const [location, setLocation] = useState([]);
    const [formData, setFormData] = useState({
        ScanRate: '',
        QcRate: '',
        IndexRate: '',
        FlagRate: '',
        CbslQaRate: '',
        ClientQcRate: '',
        LocationId: ''
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowLocation(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [dropdownRef]);

    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                const response = await fetch(`${API_URL}/locations`);
                const data = await response.json();
                setLocation(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchLocationData();
    }, []);

    const handleSelectLocation = (id, name) => {
        setSelectedLocation(name);
        setSelectedLocationId(parseInt(id));
        setFormData(prevFormData => ({
            ...prevFormData,
            LocationId: parseInt(id)
        }));
        setShowLocation(false);
        console.log("Selected Location ID:", parseInt(id)); // Log the selected location ID
        console.log("Updated formData:", formData); // Log the updated formData
    };

    const handleShowLocation = (e) => {
        e.stopPropagation();
        setShowLocation(!showLocation);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const convertedFormData = {
            ...formData,
            ScanRate: parseFloat(formData.ScanRate) || 0,
            QcRate: parseFloat(formData.QcRate) || 0,
            IndexRate: parseFloat(formData.IndexRate) || 0,
            FlagRate: parseFloat(formData.FlagRate) || 0,
            CbslQaRate: parseFloat(formData.CbslQaRate) || 0,
            ClientQcRate: parseFloat(formData.ClientQcRate) || 0,
        };

        console.log("Submitting form data:", convertedFormData); // Log the form data before submission

        try {
            const response = await axios.post(`${API_URL}/createbusinessrate`, convertedFormData);
            console.log("Business rate created:", response.data);
        } catch (error) {
            console.error("Error creating business rate:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        console.log("Input changed:", { [name]: value });
    };

    return (
        <>
            <Header />
            <div className='container'>
                <div className='row'>
                    <form onSubmit={handleSubmit}>
                        <div className="row mt-2 me-1 search-report-card">
                            <input 
                                type='text' 
                                placeholder='Location' 
                                name='LocationId' 
                                value={selectedLocation} 
                                onClick={handleShowLocation} 
                                onChange={handleInputChange} 
                            />
                            {showLocation && (
                                <div className='locations-card' ref={dropdownRef}>
                                    {location.map((elem, index) => (
                                        <div key={index} onClick={() => handleSelectLocation(elem.LocationID, elem.LocationName)}>
                                            <p>{elem.LocationName}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <label>Scanned</label>
                            <input type='number' name='ScanRate' onChange={handleInputChange} /><br />
                            <label>QC</label>
                            <input type='number' name='QcRate' onChange={handleInputChange} /><br />
                            <label>Indexing</label>
                            <input type='number' name='IndexRate' onChange={handleInputChange} /><br />
                            <label>Flagging</label>
                            <input type='number' name='FlagRate' onChange={handleInputChange} /><br />
                            <label>CBSL-QA</label>
                            <input type='number' name='CbslQaRate' onChange={handleInputChange} /><br />
                            <label>Client-QC</label>
                            <input type='number' name='ClientQcRate' onChange={handleInputChange} /><br />
                            <input type='submit' value='Submit' />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default PriceRateForm;
