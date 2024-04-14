import React, { useState } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';
import { dna } from '../assets';

function Home() {
    const [sequence, setSequence] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [family, setFamily] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Call the API
        try {
            const response = await axios.post('http://localhost:3000/api/getFamily', { sequence });
            setFamily(response.data.family);
            // setFamily("Ribovaria")
            setModalVisible(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 "

        >
         <img
        src={dna}
        alt="Main_Page"
        className="w-full h-full object-cover absolute top-0 left-0 -z-30"
      />
            <div className="p-4 py-12 border border-gray-300 rounded-lg shadow-lg bg-lightOverlay backdrop:blur-lg w-2/4 flex flex-col justify-center items-center">
                <h1 className="text-4xl font-bold mb-8 border-b-2 pb-4 border-gray-300 ">Genetic Sequence App</h1>
                <form onSubmit={handleSubmit} className="w-full max-w-md">
                    <input
                        type="text"
                        value={sequence}
                        onChange={(e) => setSequence(e.target.value)}
                        placeholder="Enter genetic sequence"
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                    />
                    <button type="submit" className="w-full py-2 bg-gradient-to-r from-blue-900 via-blue-600 to-blue-300 text-white rounded">
                        Submit
                    </button>
                </form>

                {modalVisible && (
                    <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
                        <div>
                            <h2 className="text-xl font-bold mb-4">Family Information</h2>
                            <p>{family}</p>
                            <button onClick={() => setModalVisible(false)} className="mt-4 px-4 py-2 bg-gray-300 rounded">
                                Close
                            </button>
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    );
}

export default Home;
