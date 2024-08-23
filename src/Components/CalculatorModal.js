import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const CalculatorModal = ({ onClose }) => {
  const [salary, setSalary] = useState('')
  const [target, setTarget] = useState('')
  const [workingDays, setWorkingDays] = useState('')

  const handleSubmit = () => {
    if (salary && target && workingDays) {
      const rate = (Number(salary) / ((Number(target)) * Number(workingDays)))
      toast(`Calculated Rate: ${rate.toFixed(2)}`)
      onClose();
    } else {
      toast.error('Please fill in all fields')
    }
  }
  const handleToggle = () => {
    onClose(true);
  }

  return (
    <>
      <ToastContainer />
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>&times;</span>
          <div className='row'>
            <div className='col-4'>
            <input
            className='mt-1'
            type='text'
            placeholder='Enter Salary'
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
            </div>
            <div className='col-4'>
            <input
            className='mt-1'
            type='text'
            placeholder='Enter Target'
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
            </div>
            <div className='col-4'>
            <input
            className='mt-1'
            type='text'
            placeholder='Enter No. of Working days'
            value={workingDays}
            onChange={(e) => setWorkingDays(e.target.value)}
          />
            </div>
          </div>
          <button
            type='button'
            className='mt-1 btn search-btn'
            onClick={handleSubmit}
          >
            Submit
          </button>
         
        </div>
      </div>
    </>
  )
}

export default CalculatorModal
