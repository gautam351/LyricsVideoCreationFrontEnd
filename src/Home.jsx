
import { Backdrop, Button, CircularProgress, colors, FormControl, FormHelperText, FormLabel, Input, MenuItem, Select, styled } from '@mui/material';
import axios from "axios"
import clsx from 'clsx';
import { useState } from 'react';

const Home = () => {
    const [lyricsFile, setlyricsFile] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [message, setMessage] = useState(null);
    const [backgroundImageFile, setBackgroundImageFile] = useState(null);
    const [selectedResolution, setSelectedResolution] = useState('1920x1080');
    const[loading, setLoading] = useState(false);
    // Handle the change event when a new resolution is selected


     
    const HandleSubmit = async (e) => {
        debugger;
        setLoading(true);
        e.preventDefault();
        

       
        if (!lyricsFile || !audioFile) {
            setMessage('Please upload both .srt and .mp3 files.');
            setLoading(false);
            return ;
            
        }

        let formData = new FormData();
        formData.append('lyrics', lyricsFile);
        formData.append('audio', audioFile);
        formData.append('background', backgroundImageFile);
        let resolution = selectedResolution.split('x');
        formData.append('resolutionwidth', resolution[0]);
        formData.append('resolutionheight', resolution[1]);
        console.log(formData);


        try {
            // Make the POST request to the Flask API
            debugger;
            const response = await axios.post('http://127.0.0.1:5000/generate-video', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',  // Important to set the correct content type for file upload
                },
                responseType: 'blob', // This tells Axios that we are expecting a binary response (video)
            });

            // Create a URL for the received video blob
            const videoBlob = response.data;
            const videoUrl = URL.createObjectURL(videoBlob);

            // Create a temporary anchor element to download the video
            const a = document.createElement('a');
            a.href = videoUrl;
            a.download = 'generated_video.mp4';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            setMessage("Video generated successfully! Downloading...");
            // Optionally, you can log the response or handle it further
            console.log('Video generated successfully!');
        } catch (error) {
            setMessage('Error uploading files:' + error);
        }

        setLoading(false);

    }

    const HandlesetBackgroundImageFile = (e) => {
     
        setMessage('');
        setBackgroundImageFile(null);
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            const fileType = selectedFile.name.split('.').pop().toLowerCase(); // Get file extension

            if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png') {
                setBackgroundImageFile(selectedFile);
                setMessage('');
            } else {
                setBackgroundImageFile(null);
                setMessage('Please upload a .jpg, .jpeg, or .png file.');
            }
        }


    }

    const HandlesetlyricsFile = (e) => {
        setMessage('');
        setlyricsFile(null);
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            const fileType = selectedFile.name.split('.').pop().toLowerCase(); // Get file extension

            if (fileType === 'srt' || fileType === 'txt') {
                setlyricsFile(selectedFile);
                setMessage('');
            } else {
                setlyricsFile(null);
                setMessage('Please upload a .srt or .txt file.');
            }
        }
    }

    const HandlesetAudioFile = (e) => {
        debugger;
        setMessage('');
        setAudioFile(null);
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            const fileType = selectedFile.name.split('.').pop().toLowerCase(); // Get file extension

            if (fileType === 'mp3') {
                setAudioFile(selectedFile);
                setMessage('');
            } else {
                setAudioFile(null);
                setMessage('Please upload a .mp3 file.');
            }
        }
    }


    return (
        <>
           
         
                <div>
                   
                    <Backdrop
                        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1,opacity:"0.3",backgroundColor: 'rgba(0, 0, 0, 0.3)', })}
                        open={loading}
                        
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </div>
                
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <h1>Audio to Video Creation</h1>
                    <form style={{ display: 'inline-block', textAlign: 'left', marginTop: '20px', fontSize: "16px" }} onSubmit={(e) => HandleSubmit(e)}>
                        <FormControl fullWidth margin="normal" >
                            <FormLabel style={{ color: "white" }} htmlFor="srt-file"  >Upload .srt File</FormLabel>
                            <input type="file" id="srt-file" style={{ marginTop: '10px' }} onChange={(e) => HandlesetlyricsFile(e)} />
                            {/* <FormHelperText style={{ color: "white" }} >Choose a subtitle file in .srt format</FormHelperText> */}
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <FormLabel style={{ color: "white" }} htmlFor="audio-file" >Upload Audio File</FormLabel>
                            <input type="file" id="audio-file" accept="audio/*" style={{ marginTop: '10px' }} onChange={(e) => HandlesetAudioFile(e)} />
                            {/* <FormHelperText style={{ color: "white" }}>Choose an audio file</FormHelperText> */}
                        </FormControl>

                    <FormControl fullWidth margin="normal">
                        <FormLabel style={{ color: "white" }} htmlFor="image-file">Upload Image File</FormLabel>
                        <input 
                            type="file" 
                            id="image-file" 
                            accept="image/*" 
                            style={{ marginTop: '10px' }} 
                            onChange={(e) => HandlesetBackgroundImageFile(e)}
                        />
                    </FormControl>
                         
                        <FormControl sx={{ minWidth: 120 }} size="small" fullWidth margin="normal">
                            <label htmlFor="resolution"></label>
                            <Select
                                id="resolution"
                                value={selectedResolution}  // Set the selected value based on the state
                                onChange={(e) => setSelectedResolution(e.target.value)} // Handle change event
                                style={{ color: "white", borderColor: "white", backgroundColor: "grey" }}
                            >
                                <MenuItem value="1920x1080">1920 x 1080 (Full HD)</MenuItem>
                                <MenuItem value="1280x720">1280 x 720 (HD)</MenuItem>
                                <MenuItem value="854x480">854 x 480 (SD)</MenuItem>
                                <MenuItem value="640x360">640 x 360 (nHD)</MenuItem>
                                <MenuItem value="2560x1440">2560 x 1440 (Quad HD)</MenuItem>
                                <MenuItem value="3840x2160">3840 x 2160 (4K Ultra HD)</MenuItem>
                                <MenuItem value="7680x4320">7680 x 4320 (8K Ultra HD)</MenuItem>
                            </Select>

                            <p>Selected Resolution: {selectedResolution}</p>
                            {/* <FormHelperText style={{ color: "white" }}>Choose a resolution</FormHelperText> */}
                        </FormControl>
                        <br />
                        <button
                            type="submit"
                            style={{
                                marginTop: '20px',
                                padding: '10px 20px',
                                backgroundColor: '#1976d2',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}

                        >
                            Submit
                        </button>

                        {message && <p style={{ color: "red" }}>{message}</p>}
                    </form>
                </div>
            


        </>



    )
}


export default Home;