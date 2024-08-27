import React, { useEffect, useState } from 'react';
import Header from './Components/Header';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from './API';
import SideBar from './Components/SideBar';
import Chart from 'react-apexcharts';
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";

const ProjectGraph = () => {
    const [projectData, setProjectData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/fetchexcel`);
                setProjectData(response.data);
            } catch (error) {
                console.error('Error fetching project data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const chartOptions = (categories, data) => ({
        chart: {
            type: 'line',
            height: 350,
        },
        stroke: {
            curve: 'smooth'
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories,
        }
    });

    const projects = [
        { id: 1, name: 'UPDC' },
        { id: 2, name: 'Telangana' },
        { id: 3, name: 'Karnataka' },
        { id: 4, name: 'Nimhans' },
        { id: 5, name: 'LIC' },
        { id: 6, name: 'NMML' },
        { id: 7, name: 'CAG' },
        { id: 8, name: 'Tata Power' },
        { id: 9, name: 'Allahabad HC' },
        { id: 10, name: 'BLR' },
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header />
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-2'></div>
                    <div className='col-9 ms-5'>
                        <SideBar />
                        <div className='row mt-3 mb-2'>
                            {projectData.map((project, index) => {
                                const projectID = projects[index]?.id || 'Unknown Project';
                                const projectName = projects[index]?.name || 'Unknown Project';

                                const categories = [
                                    'Received', 'Scanned', 'QC', 'Flagging',
                                    'Indexing', 'CBSL_QA', 'Client_QC', 'Export'
                                ];

                                // Assuming the data for each category is available in the project object
                                const data = categories.map(category => project[category] || 0);

                                return (
                                    <div className='col-6 mt-2 mb-2' key={index}>
                                        <Card className='project-graph'>
                                            <CardBody>
                                                <div className='row'>
                                                    <div className='col-6'>
                                                        {/* Handwritten Data Section */}
                                                        <CardTitle tag="h5">{projectName}</CardTitle>
                                                        <CardSubtitle tag="h6" className="mb-2 text-muted">
                                                            Project ID: {projectID}
                                                        </CardSubtitle>
                                                        <div>
                                                            <p><strong>Received:</strong> {project.Received || 0}</p>
                                                            <p><strong>Scanned:</strong> {project.Scanned || 0}</p>
                                                            <p><strong>QC:</strong> {project.QC || 0}</p>
                                                            <p><strong>Flagging:</strong> {project.Flagging || 0}</p>
                                                            <p><strong>Indexing:</strong> {project.Indexing || 0}</p>
                                                            <p><strong>CBSL_QA:</strong> {project.CBSL_QA || 0}</p>
                                                            <p><strong>Client_QC:</strong> {project.Client_QC || 0}</p>
                                                            <p><strong>Export:</strong> {project.Export || 0}</p>
                                                        </div>
                                                        <Link to={`/Dashboard/${projectID}`} style={{ color: '#508D69', textDecoration: 'none' }}>
                                                            More...
                                                        </Link>
                                                    </div>
                                                    <div className='col-6'>
                                                        {/* Line Chart Section */}
                                                        <Chart
                                                            options={chartOptions(categories, data)}
                                                            series={[{ data }]}
                                                            type="line"
                                                            height={350}
                                                        />
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProjectGraph;
