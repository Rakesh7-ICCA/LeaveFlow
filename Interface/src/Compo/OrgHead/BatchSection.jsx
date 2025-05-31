import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import BatchSectionsModal from './BatchSectionModal';

const BatchSectionManager = () => {
    // State for batches and sections
    const [batches, setBatches] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get('https://leaveflow.runasp.net/api/BatchSection/getBatch?orgId=' + localStorage.getItem('id'))
                if (res.data.batches)
                    setBatches(res.data.batches)
            }
            catch (err) {
                console.log(err)
                alert('Error fetching batches. Please try again later.')
            }

        })()
    }, [])

    const [newBatchYear, setNewBatchYear] = useState('');
    const [newSectionName, setNewSectionName] = useState('');
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [isAddingBatch, setIsAddingBatch] = useState(false);
    const [isAddingSection, setIsAddingSection] = useState(false);
    const [tempId, setTempId] = useState('')

    // Add new batch
    const addBatch = () => {
        if (newBatchYear.trim() === '') return;


        (async () => {
            try {
                const res = await axios.post('https://leaveflow.runasp.net/api/BatchSection/CreateBatch', { orgId: localStorage.getItem('id'), batchName: newBatchYear })
                alert(res.data.message)
                

                const newBatch = {
                    batchId: res.data.batchId,
                    batchName: newBatchYear,
                    section: []
                };
                
                setBatches([...batches, newBatch]);
                setNewBatchYear('');
                setIsAddingBatch(false);
            }
            catch (err) {
                console.log(err)
                alert('Error adding batch. Please try again later.')
            }
        })()


    };

    // Add section to batch
    const addSection = () => {
        if (!selectedBatch || newSectionName.trim() === '') return;

        setBatches(batches.map(batch =>
            batch.id === selectedBatch.id
                ? { ...batch, sections: [...batch.sections, newSectionName.toUpperCase()] }
                : batch
        ));

        setNewSectionName('');
        setIsAddingSection(false);
    };

    // Delete batch
    const deleteBatch = (id) => {
        setBatches(batches.filter(batch => batch.id !== id));

    };

    // Delete section
    const deleteSection = (batchId, section) => {
        setBatches(batches.map(batch =>
            batch.id === batchId
                ? { ...batch, sections: batch.sections.filter(s => s !== section) }
                : batch
        ));
    };

    function onModalClose() {
        setSelectedBatch(null);
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Batch & Section Management</h1>

            {/* Batch List */}
            <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Batches</h2>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsAddingBatch(true)}
                        className="px-4 py-2 bg-teal-600 text-white rounded-md"
                    >
                        + Add Batch
                    </motion.button>
                </div>

                {/* Add Batch Form */}
                <AnimatePresence>
                    {isAddingBatch && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-gray-50 p-4 rounded-md mb-4"
                        >
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={newBatchYear}
                                    onChange={(e) => setNewBatchYear(e.target.value)}
                                    placeholder="Enter batch year (e.g. 2023)"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={addBatch}
                                    className="px-4 py-2 bg-teal-600 text-white rounded-md"
                                >
                                    Save
                                </motion.button>
                                <button
                                    onClick={() => setIsAddingBatch(false)}
                                    className="px-4 py-2 text-gray-500 hover:text-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {selectedBatch && <BatchSectionsModal id={selectedBatch} onClose={onModalClose} batchSetFunc={setBatches} name={selectedBatch.batchName} />}



                {/* Batch Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {batches.length <= 0 ?
                        <div className="text-center text-gray-500">No batches available</div>
                        :
                        batches.map((batch) => (
                            <motion.div
                                key={batch.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedBatch(batch.batchId)}
                                whileHover={{ scale: 1.02 }}
                                className={`border rounded-lg p-4 ${selectedBatch?.id === batch.id ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg">Batch {batch.batchName}</h3>
                                        <p className="text-sm text-gray-500">
                                            {batch.section.length} section(s)
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setSelectedBatch(batch)}
                                            className="text-xs px-2 py-1 bg-teal-100 text-teal-800 rounded hover:bg-teal-200"
                                        >
                                            Manage

                                        </button>
                                        <button
                                            onClick={() => deleteBatch(batch.id)}
                                            className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                                        >
                                            Delete
                                        </button>


                                    </div>
                                </div>
                            </motion.div>
                        ))}
                </div>
            </div>

        </div >
    );
};

export default BatchSectionManager;