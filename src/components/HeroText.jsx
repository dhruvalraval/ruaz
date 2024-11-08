import { useProgress } from '@react-three/drei'
import { memo, useEffect, useState } from 'react'

function Component() {
  const [isLoaded, setIsLoaded] = useState(false)
  const { loaded, total } = useProgress()
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loaded === total) setIsLoaded(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [loaded, total])
  return (
    <div className='flex flex-col items-center justify-between h-screen w-screen z-10 absolute top-0 left-0 pointer-events-none'>
      <img
        src='/la vie en rose.png'
        className='w-full object-cover mix-blend-multiply'
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 2s ease-in-out 1s',
        }}
      />
      <div
        className='flex flex-col items-center justify-center w-[92%] md:max-w-2xl gap-4 md:gap-8 pb-32 md:pb-32'
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 2s ease-in-out 2s',
        }}
      >
        <h1 className='text-claret-800 text-xl text-center md:text-4xl capitalize'>
          a beautiful collection of naturally sourced ruby heart pendants,
          specially crafted for your lover
        </h1>
        <button className='p-2 px-4 rounded-full text-xl md:text-2xl border-claret-800 text-claret-800 border-2 backdrop-[linear-gradient(180deg,_#f4adb4_0%,_#ed7f8d_100%)] bg-gradient-to-r from-claret-300 to-[rgba(255, 255, 255, 0.1)] pointer-events-auto'>
          YES, I WANT IT
        </button>
      </div>
      <div
        className='absolute bottom-2 flex flex-row items-center justify-center md:justify-end w-screen gap-2 mb-2 pr-0 md:pr-12 pointer-events-auto'
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 2s ease-in-out 3s',
        }}
      >
        <a
          target='_blank'
          href='https://twitter.com/enravaled'
          className='text-claret-800 text-md text-center md:text-xl'
        >
          Designed & Developed By Dhruval Raval (@enravaled)
        </a>
      </div>
    </div>
  )
}
const HeroText = memo(Component)
export default HeroText
