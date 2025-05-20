import React from 'react';
import { TbMathYPlusY } from 'react-icons/tb';

const InputLabel = ({ label, getFunc, name, err, patternObj = {}, typeObj = "text" }) => {
    return (
        <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
                {label}
            </label>
            <input
                type={typeObj}
                {...getFunc(name, { 
                    required: name + " is required",
                    pattern: patternObj
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md 
                          focus:outline-none focus:ring-2 focus:ring-teal-500
                          bg-white dark:bg-gray-800 
                          dark:border-gray-600 
                          dark:text-white 
                          dark:placeholder-gray-400
                          transition-colors duration-200"
            />
            {err[name] && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {err[name].message}
                </p>
            )}
        </div>
    );
};

export default InputLabel;