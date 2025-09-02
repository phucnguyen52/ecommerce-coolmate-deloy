import React from 'react'

const Select = ({ label, options, value, setValue, type, reset, name }) => {
    return (
        <div className="flex flex-1 flex-col gap-2">
            <label className="font-medium" htmlFor="select-address">
                {label}
            </label>
            <select
                value={reset ? '' : value}
                onChange={(e) =>
                    !name ? setValue(e.target.value) : setValue((prev) => ({ ...prev, [name]: e.target.value }))
                }
                id="select-address"
                className="w-full truncate rounded-md border border-gray-300 p-2 outline-none"
            >
                <option value="">{`--Chọn ${label}--`}</option>
                {options?.map((item) => {
                    return (
                        <option key={item.code} value={item.code} className="truncate">
                            {item.name}
                        </option>
                    )
                })}
            </select>
        </div>
    )
}

export default Select
