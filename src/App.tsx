import React, { useEffect, useState } from 'react'
import { FaBluetooth } from 'react-icons/fa'
import './firebase'
import useAnalyticsEventTracker from 'hooks/useAnalyticsEventTracker'
import { ToastContainer, toast, cssTransition, ToastOptions } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'animate.css/animate.min.css'

const bounce = cssTransition({
  enter: 'animate__animated animate__bounceIn',
  exit: 'animate__animated animate__bounceOut',
})

interface IAppProps {}

const btSettings = {
  acceptAllDevices: true,
  optionalServices: ['device_information'],
}

const App: React.FC<IAppProps> = (props) => {
  const [btDevice, setBtDevice] = useState<BluetoothDevice | null>(null)
  const gaEventTracker = useAnalyticsEventTracker('Home')

  const notify = (msg: string, { error = false }) => {
    const options: ToastOptions = {
      pauseOnFocusLoss: false,
      autoClose: 1000,
      theme: 'colored',
      transition: bounce,
    }

    if (error) {
      toast.error(msg, options)
    } else {
      toast.success(msg, options)
    }
  }

  const onScanButtonClick = async () => {
    if (!isBluetoothEnabled()) {
      gaEventTracker('No bluetooth')
      notify("Browser doesn't support bluetooth", { error: true })
      return
    }

    try {
      const foundBtDevice = await navigator.bluetooth
        .requestDevice(btSettings)
        .catch((error: Error) => {
          // console.log(error.message)
        })

      if (foundBtDevice) {
        setBtDevice(foundBtDevice)
      }
    } catch (error) {
      notify('Something went wrong :(', { error: true })
    }
  }

  const isBluetoothEnabled = () => {
    if (!navigator.bluetooth) {
      return false
    } else {
      return true
    }
  }

  const onDisconnectButtonClick = () => {
    if (!btDevice) return
    if (!btDevice.gatt) return
    setBtDevice(null)
  }

  return (
    <div className='cool-bg h-screen w-screen grid place-items-center'>
      <div className='grid place-items-center'>
        {btDevice ? (
          <>
            <div>{btDevice.name}</div>
            <button
              className='relative bg-gradient-to-tr from-red-600 via-pink-700 to-red-700 hover:opacity-80 text-white font-bold py-2 px-4 rounded inline-flex items-center gap-5'
              onClick={onDisconnectButtonClick}
            >
              <span>
                <FaBluetooth size={35} />
              </span>
              <span>Disconnect</span>
            </button>
          </>
        ) : (
          <>
            <div className='w-32 h-32 border-8 rounded-full absolute animate-pulse opacity-40 animate-ping' />
            <div className='w-44 h-44 border-8 rounded-full absolute animate-pulse opacity-20 animate-ping' />
            <div className='w-56 h-56 border-8 rounded-full absolute animate-pulse opacity-20 animate-ping' />
            <button
              className='relative bg-neutral-50 hover:opacity-80 text-slate-800 font-bold py-2 px-4 rounded inline-flex items-center gap-5'
              onClick={onScanButtonClick}
            >
              <span>
                <FaBluetooth size={35} />
              </span>
              <span>SCAN</span>
            </button>
          </>
        )}
      </div>

      <span className='absolute'>
        <ToastContainer limit={3} />
      </span>
    </div>
  )
}

export default App
