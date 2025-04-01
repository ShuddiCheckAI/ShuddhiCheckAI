// App.js
import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [userMessage, setUserMessage] = useState('');
    const [chatResponse, setChatResponse] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [complianceResult, setComplianceResult] = useState('');
    const [uploadError, setUploadError] = useState('');

    const handleChat = async () => {
        try {
            const response = await axios.post('YOUR_BACKEND_CHAT_ENDPOINT', { message: userMessage });
            setChatResponse(response.data.response);
            setUserMessage(''); // Clear input after sending
        } catch (error) {
            setChatResponse("Error: Unable to reach backend.");
            console.error("Chat error:", error);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        setComplianceResult(''); // Clear previous results
        setUploadError('');

        const formData = new FormData();
        formData.append('document', file);

        try {
            const response = await axios.post('YOUR_BACKEND_COMPLIANCE_ENDPOINT', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setComplianceResult(`Analysis Result: ${response.data.result}`);
        } catch (error) {
            setComplianceResult('');
            setUploadError("Error during file upload or analysis.");
            console.error("File upload error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">ShuddhiCheck AI</h1>

            {/* Chatbot Section */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8 w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-3 text-gray-700">Chat with AI</h2>
                <div className="overflow-y-auto h-40 mb-4 border p-2 rounded bg-gray-50">
                    {chatResponse && (
                        <div className="mb-2">
                            <strong>Bot:</strong> {chatResponse}
                        </div>
                    )}
                </div>
                <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Ask me anything..."
                    className="border w-full p-2 rounded-md mb-2"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleChat();
                        }
                    }}
                />
                <button
                    onClick={handleChat}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md w-full"
                >
                    Send Message
                </button>
            </div>

            {/* Compliance Checker Section */}
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-3 text-gray-700">Compliance Checker</h2>
                <input
                    type="file"
                    onChange={handleFileUpload}
                    className="mb-2"
                />
                {uploadError && <p className="text-red-500 mb-2">{uploadError}</p>}
                {complianceResult && <p className="text-lg font-semibold mt-2">{complianceResult}</p>}
                {selectedFile && <p className="text-sm text-gray-600">Selected file: {selectedFile.name}</p>}
            </div>
        </div>
    );
}

export default App; cdc+satisfies


