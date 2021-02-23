import React from 'react'
import './notification.css'
export const showErrmsg = (msg) => {
    return <div className="errMsg">{msg}</div>
}

export const showSuccessmsg = (msg) => {
    return <div className="SuccessMsg">{msg}</div>
}