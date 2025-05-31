import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import axios from "axios";

const BatchSectionsModal = ({ isOpen = true, onClose, id, batchSetFunc, name}) => {
    const [sections, setSections] = useState([]);
    const [newSection, setNewSection] = useState("");
    const [showInput, setShowInput] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get('https://leaveflow.runasp.net/api/BatchSection/GetSections?batchId=' + id)
                if(res.data.sections) setSections(res.data.sections)
            }
            catch (err) {
                console.log(err)
                alert('Error fetching batches. Please try again later.')
            }
        })()
    }, [])

    const handleRemoveBatch = () => {
        (async ()=>{
            try {
                const res = await axios.post('https://leaveflow.runasp.net/api/BatchSection/DeleteBatch?batchId=' + id)
                alert(res.data.message)
                batchSetFunc(prev => prev.filter(e => e.batchId !== id));
                onClose()
            }
            catch (err) {
                console.log(err)
                alert('Error removing batch. Please try again later.')
            }
        })()
    }

    const handleRemove = (sectionId, indexToRemove) => {
        (async () => {
            try {
                const res = await axios.post('https://leaveflow.runasp.net/api/BatchSection/DeleteSection?sectionId=' + sectionId)
                alert(res.data.message)
                batchSetFunc(prev => prev.map(e =>
                    e.batchId === id
                        ? { ...e, section: e.section.filter((_, idx) => idx !== indexToRemove) }
                        : e
                ));
                setSections(prev => prev.filter((_, index) => index !== indexToRemove));
            }
            catch (err) {
                console.log(err)
                alert('Error removing section. Please try again later.')
            }
        })()
    };

    const handleAddSection = () => {
        if (newSection.trim() === "") return;
        (async () => {
            try {
                const res = await axios.post('https://leaveflow.runasp.net/api/BatchSection/AddSection?batchId=' + id+ '&sectionName=' + newSection);
                alert(res.data.message);
                batchSetFunc(prev => prev.map(e => e.batchId === id ? { ...e, section: [...e.section, newSection] } : e));
                sections.length<=0 ? setSections( [ { sectionName: newSection, sectionId: res.data.sectionId }]) :setSections(prev => [...prev, { sectionName: newSection, sectionId: res.data.sectionId }]);
                setNewSection("");
                setShowInput(false);
            } catch (err) {
                console.log(err);
                alert("Error adding section. Please try again later.");
            }
        })();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-lg p-5 w-full max-w-md mx-4 shadow-lg border border-teal-100"
            >
                <h2 className="text-lg font-semibold mb-4 text-teal-700">{name}</h2>

                <div className="space-y-2">
                    {sections && sections.map((section, index) => (
                        <div
                            key={section.sectionId || index}
                            className="flex justify-between items-center bg-teal-50 p-2 rounded-md border border-teal-200"
                        >
                            <span className="text-sm text-teal-900">Section {section.sectionName}</span>
                            <button
                                onClick={() => handleRemove(section.sectionId, index)}
                                className="p-1 hover:bg-teal-100 rounded"
                            >
                                <FiX className="w-4 h-4 text-teal-600" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-4">
                    {showInput &&
                        <input
                            type="text"
                            value={newSection}
                            onChange={(e) => setNewSection(e.target.value)}
                            placeholder="Enter section name"
                            className="flex-1 px-3 py-1.5 border w-full border-teal-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />}

                </div>

                <div className="mt-5 flex justify-end">
                    <button
                        onClick={handleRemoveBatch}
                        className="px-4 py-1.5 bg-red-600 mx-5 text-white text-sm rounded hover:bg-red-700"
                    >
                        Delete Batch
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 bg-teal-600 mx-5 text-white text-sm rounded hover:bg-teal-700"
                    >
                        Close
                    </button>
                    {!showInput ? (
                        <button
                            onClick={() => setShowInput(true)}
                            className="px-3 py-1.5 bg-teal-600 text-white text-sm rounded hover:bg-teal-700"
                        >
                            Create
                        </button>
                    ) : (

                        <button
                            onClick={handleAddSection}
                            className="px-3 py-1.5 bg-teal-600 text-white text-sm rounded hover:bg-teal-700"
                        >
                            Add
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default BatchSectionsModal;
