import React from 'react'

const InputReadOnly = ({ label, value }) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="font-medium" htmlFor="exactly-address">
                {label}
            </label>
            <input
                type="text"
                id="exactly-address"
                readOnly
                className="w-full rounded-md border border-gray-200 bg-gray-100 p-2 outline-none"
                value={value || ''}
            />
        </div>
    )
}

export default InputReadOnly
