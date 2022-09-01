import React, { useState } from 'react'
import { FaBluetooth } from 'react-icons/fa'

interface IAppProps {}


const btSettings = {
     acceptAllDevices: true,
     optionalServices: ['device_information']
  }

const App: React.FC<IAppProps> = (props) => {
  const [btDevice, setBtDevice] = useState<BluetoothDevice | null>(null);

  const scanDevices = async () => {
    const foundBtDevice = await navigator.bluetooth.requestDevice(btSettings)
    .catch((error:Error) => { console.log(error.message) })

    if (foundBtDevice) {
      setBtDevice(foundBtDevice);
    }
  }

  return (
    <div className='cool-bg h-screen w-screen grid place-items-center'>
      <div className='w-32 h-32 border-8 rounded-full animate-pulse opacity-40 absolute animate-ping' />
      <div className='w-44 h-44 border-8 rounded-full animate-pulse opacity-20 absolute animate-ping' />
      <div className='w-56 h-56 border-8 rounded-full animate-pulse opacity-20 absolute animate-ping' />

      <button className='relative bg-neutral-50 hover:opacity-80 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center gap-5' onClick={scanDevices}>
        <span>
          <FaBluetooth size={35}/>
        </span>
        <span>SCAN</span>
      </button>
    </div>
  )
}

export default App
