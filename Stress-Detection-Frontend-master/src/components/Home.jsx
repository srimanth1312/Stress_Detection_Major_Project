import React from 'react'
import VideoRecorder from './VideoRecorder'
import AudioRecorder from './AudioRecorder'
import Audio from './Audio'
import "../styles/Home.css"
const Home = () => {

  return (
    <div className='home'>
        <VideoRecorder/>
        <AudioRecorder/>
    </div>
  )
}

export default Home