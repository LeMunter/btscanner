import React, { useState } from 'react'
import { FaBluetooth } from 'react-icons/fa'
import './firebase'
import { ToastContainer, toast, cssTransition, ToastOptions } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'animate.css/animate.min.css'
import logo from './ut_logo.svg'

const bounce = cssTransition({
  enter: 'animate__animated animate__bounceIn',
  exit: 'animate__animated animate__bounceOut',
})

interface IAppProps {}

const btSettings = {
  // filters: [{ services: ['battery_service'] }],
  acceptAllDevices: true,
  optionalServices: ['device_information'],
}

const App: React.FC<IAppProps> = (props) => {
  const [btDevice, setBtDevice] = useState<BluetoothDevice | null>(null)
  const [btGatt, setBtGatt] = useState<BluetoothRemoteGATTServer | null>(null)

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
        const gatt = await foundBtDevice.gatt?.connect()
        setBtDevice(foundBtDevice)
        if (gatt) {
          setBtGatt(gatt)
        }
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
    if (!btDevice || !btGatt) return
    if (!btDevice.gatt) return
    btGatt.disconnect()
    setBtDevice(null)
    setBtGatt(null)
  }

  return (
    <div className='relative cool-bg h-screen w-screen grid place-items-center overflow-hidden'>
      <div className='absolute top-5 text-white w-1/4'>
        <h1 className='font-black text-2xl '>Bluetooth Scanner</h1>
        <p className='text-neutral-100'>
          Scan for bluetooth devices near you! Currently no support for Firefox and Safari. The
          Bluetooth web API is still under development.
        </p>
      </div>
      {btDevice && <h2 className='font-bold text-xl text-neutral-50'>{btDevice.name}</h2>}
      <div className='grid place-items-center'>
        {btDevice ? (
          <button
            className='relative bg-gradient-to-tr from-red-600 via-pink-700 to-red-700 hover:opacity-80 text-white font-bold py-2 px-4 rounded inline-flex items-center gap-5'
            onClick={onDisconnectButtonClick}
          >
            <span>
              <FaBluetooth size={35} />
            </span>
            <span>Disconnect</span>
          </button>
        ) : (
          <div className='relative grid place-items-center'>
            <div className='w-32 h-32 border-8 rounded-full absolute opacity-40 motion-safe:animate-ping' />
            <div className='w-44 h-44 border-8 rounded-full absolute opacity-20 motion-safe:animate-ping' />
            <div className='w-56 h-56 border-8 rounded-full absolute opacity-20 motion-safe:animate-ping' />
            <button
              className='absolute bg-neutral-50 hover:opacity-80 text-slate-800 font-bold py-2 px-4 rounded-full items-center gap-5 w-32 h-32 grid place-items-center'
              onClick={onScanButtonClick}
            >
              <span className='items-center flex flex-col'>
                <span>
                  <FaBluetooth size={35} />
                </span>
                <span>SCAN</span>
              </span>
            </button>
          </div>
        )}
      </div>

      <span className='absolute'>
        <ToastContainer limit={3} />
      </span>
      <footer className='absolute bottom-0 text-neutral-50 w-56 py-5'>
        <a
          className='flex items-center justify-center gap-2'
          href='https://uptilt.se'
          target='_blank'
          rel='noreferrer'
        >
          <span className='flex flex-shrink font-semibold'>
            <span className='font-bold'>UPTILT</span>
          </span>
          <img className='w-1/5 flex' src={logo} />
        </a>
      </footer>
    </div>
  )
}

export default App
