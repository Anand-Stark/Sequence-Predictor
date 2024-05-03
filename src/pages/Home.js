// import React, { useState } from 'react';
// import axios from 'axios';
// import Modal from '../components/Modal';
// import { dna } from '../assets';

// function Home() {
//     const [sequence, setSequence] = useState('');
//     const [modalVisible, setModalVisible] = useState(false);
//     const [family, setFamily] = useState('');

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         // Call the API
//         try {
//             const response = await axios.post('http://localhost:3000/api/getFamily', { sequence });
//             setFamily(response.data.family);
//             // setFamily("Ribovaria")
//             setModalVisible(true);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         }
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen py-2 "

//         >
//          <img
//         src={dna}
//         alt="Main_Page"
//         className="w-full h-full object-cover absolute top-0 left-0 -z-30"
//       />
//             <div className="p-4 py-12 border border-gray-300 rounded-lg shadow-lg bg-lightOverlay backdrop:blur-lg w-2/4 flex flex-col justify-center items-center">
//                 <h1 className="text-4xl font-bold mb-8 border-b-2 pb-4 border-gray-300 ">Genetic Sequence App</h1>
//                 <form onSubmit={handleSubmit} className="w-full max-w-md">
//                     <input
//                         type="text"
//                         value={sequence}
//                         onChange={(e) => setSequence(e.target.value)}
//                         placeholder="Enter genetic sequence"
//                         className="w-full p-2 border border-gray-300 rounded mb-4"
//                     />
//                     <button type="submit" className="w-full py-2 bg-gradient-to-r from-blue-900 via-blue-600 to-blue-300 text-white rounded">
//                         Submit
//                     </button>
//                 </form>

//                 {modalVisible && (
//                     <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
//                         <div>
//                             <h2 className="text-xl font-bold mb-4">Family Information</h2>
//                             <p>{family}</p>
//                             <button onClick={() => setModalVisible(false)} className="mt-4 px-4 py-2 bg-gray-300 rounded">
//                                 Close
//                             </button>
//                         </div>
//                     </Modal>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Home;
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';
import { dna } from '../assets';

function Home() {
    const [sequence1, setSequence1] = useState('');
    const [sequence2, setSequence2] = useState('');
    const [sequence3, setSequence3] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [family, setFamily] = useState('');
    const [formNumber, setFormNumber] = useState(0); // To identify which form was submitted
    const contentRef = useRef(null);

    useEffect(() => {
        // Adjust background image height based on content div height
        const adjustBackgroundHeight = () => {
            const contentHeight = contentRef.current.clientHeight;
            const backgroundHeight = contentHeight + 70; // Add extra height for padding/margin
            document.documentElement.style.setProperty('--background-height', `${backgroundHeight}px`);
        };

        adjustBackgroundHeight();
        window.addEventListener('resize', adjustBackgroundHeight);
        return () => window.removeEventListener('resize', adjustBackgroundHeight);
    }, []);

    const handleSubmit = async (event, formNumber) => {
        event.preventDefault();

        let sequence = '';
        let apiEndpoint = 'http://localhost:5000/predict';
        switch (formNumber) {
            case 1:
                sequence = sequence1;

                console.log(sequence);

                try {
                    const response = await axios.post(apiEndpoint, { sequence });
                    setFamily(response.data.prediction);
                    setModalVisible(true);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
                
                break;
            case 2:
                sequence = sequence2;

                console.log(sequence);

                try {
                    const response = await axios.post(apiEndpoint, { sequence });
                    setFamily(response.data.sars_cov_2_prediction);
                    setModalVisible(true);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
                
                break;
            case 3:
                sequence = sequence3;

                console.log(sequence);
                
                try {
                    const response = await axios.post(apiEndpoint, { sequence });
                    setFamily(response.data.coronavirus_prediction);
                    setModalVisible(true);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }

                break;
            default:
                break;
        }

        // Call the API
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <img src={dna} alt="Main_Page" className="w-full h-full object-cover absolute top-0 left-0 z-0" style={{ height: 'var(--background-height, 100vh)' }} />
            <div ref={contentRef} className="flex flex-col items-center justify-center p-4 py-12 space-y-8 border border-gray-300 rounded-lg shadow-lg bg-lightOverlay backdrop-filter backdrop-blur-lg w-2/4 z-10">
                <h1 className="text-4xl font-bold mb-8 border-b-2 pb-4 border-gray-300 text-center">Genetic Sequence App</h1>

                {/* First Form */}
                <div className="bg-blue-200 rounded-lg p-4 w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-4">Realm</h2>
                    <form onSubmit={(e) => handleSubmit(e, 1)} className="w-full">
                        <input
                            type="text"
                            value={sequence1}
                            onChange={(e) => setSequence1(e.target.value)}
                            placeholder="Enter genetic sequence"
                            className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring focus:border-blue-300"
                        />
                        <button type="submit" className="w-full py-2 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 text-white rounded hover:bg-blue-400 focus:outline-none focus:ring focus:border-blue-300">
                            Realm Classification
                        </button>
                    </form>
                </div>

                {/* Second Form */}
                <div className="bg-blue-300 rounded-lg p-4 w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-4">Binary</h2>
                    <form onSubmit={(e) => handleSubmit(e, 2)} className="w-full">
                        <input
                            type="text"
                            value={sequence2}
                            onChange={(e) => setSequence2(e.target.value)}
                            placeholder="Enter genetic sequence"
                            className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring focus:border-blue-300"
                        />
                        <button type="submit" className="w-full py-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white rounded hover:bg-blue-500 focus:outline-none focus:ring focus:border-blue-300">
                            Binary Classification
                        </button>
                    </form>
                </div>

                {/* Third Form */}
                <div className="bg-blue-400 rounded-lg p-4 w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-4">Corona</h2>
                    <form onSubmit={(e) => handleSubmit(e, 3)} className="w-full">
                        <input
                            type="text"
                            value={sequence3}
                            onChange={(e) => setSequence3(e.target.value)}
                            placeholder="Enter genetic sequence"
                            className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring focus:border-blue-300"
                        />
                        <button type="submit" className="w-full py-2 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300">
                            Corona Virus Classification
                        </button>
                    </form>
                </div>

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
