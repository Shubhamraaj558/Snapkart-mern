import React, { useEffect, useState, useRef } from 'react'

import image1 from '../assest/banner/im3.jpg'
import image2 from '../assest/banner/img2.webp'
import image3 from '../assest/banner/im4.jpg'
import image4 from '../assest/banner/im1.jpg'
import image5 from '../assest/banner/im5.jpg'
import image6 from '../assest/banner/im6.jpg'
import image7 from '../assest/banner/im7.jpg'
import image8 from '../assest/banner/im8.jpg'
import image9 from '../assest/banner/im9.jpg'
import image56 from '../assest/banner/img56.jpg'
import image20 from '../assest/banner/im20.jpg'
import image21 from '../assest/banner/im21.jpg'
import image22 from '../assest/banner/im22.jpg'
import image23 from '../assest/banner/im23.jpg'
import image24 from '../assest/banner/im24.jpg'
import image25 from '../assest/banner/im25.jpg'
import image26 from '../assest/banner/im26.jpg'
import image28 from '../assest/banner/im28.jpg'
import image29 from '../assest/banner/im29.jpg'
import image30 from '../assest/banner/im30.jpg'
import image31 from '../assest/banner/im31.jpg'
import image32 from '../assest/banner/im32.jpg'
import image33 from '../assest/banner/im33.jpg'
import image34 from '../assest/banner/im34.jpg'

import image1Mobile from '../assest/banner/img1_mobile.jpg'
import image2Mobile from '../assest/banner/img2_mobile.webp'
import image3Mobile from '../assest/banner/img3_mobile.jpg'
import image4Mobile from '../assest/banner/img4_mobile.jpg'
import image5Mobile from '../assest/banner/img5_mobile.jpg'
import image6Mobile from '../assest/banner/imb8.jpg'

import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

const BannerProduct = () => {
    const [currentImage, setCurrentImage] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const intervalRef = useRef(null)

    const desktopImages = [
        image6, image20, image7, image26, image8, image33,
        image21, image1, image24, image9, image22, image32,
        image23, image3, image25, image4, image28, image29,
        image34, image30, image31, image5, image56, image2,
    ]

    const mobileImages = [
        image1Mobile, image2Mobile, image6Mobile,
        image3Mobile, image4Mobile, image5Mobile
    ]

    // Check screen size to toggle between desktop/mobile arrays and lengths safely
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const currentImagesList = isMobile ? mobileImages : desktopImages
    const totalSlides = currentImagesList.length

    // Reset index if screen mode changes and index is out of bounds
    useEffect(() => {
        if (currentImage >= totalSlides) {
            setCurrentImage(0)
        }
    }, [isMobile, totalSlides, currentImage])

    const nextImage = () => {
        setCurrentImage(prev => (prev === totalSlides - 1 ? 0 : prev + 1))
    }

    const preveImage = () => {
        setCurrentImage(prev => (prev === 0 ? totalSlides - 1 : prev - 1))
    }

    const startAutoSlide = () => {
        stopAutoSlide()
        intervalRef.current = setInterval(() => {
            nextImage()
        }, 4000)
    }

    const stopAutoSlide = () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
    }

    useEffect(() => {
        startAutoSlide()
        return () => stopAutoSlide()
    }, [totalSlides])

    return (
        <div className='container mx-auto px-3 my-4'>
            <div
                className='h-44 sm:h-56 md:h-68 w-full bg-black relative overflow-hidden rounded-2xl border border-indigo-500/40 shadow-sm'
                onMouseDown={stopAutoSlide}
                onMouseUp={startAutoSlide}
                onMouseLeave={startAutoSlide}
                onTouchStart={stopAutoSlide}
                onTouchEnd={startAutoSlide}
            >
                {/* Navigation Arrows (Desktop) */}
                <div className='absolute z-10 h-full w-full md:flex items-center hidden pointer-events-none'>
                    <div className='flex justify-between w-full text-lg px-3'>
                        <button 
                            onClick={preveImage} 
                            aria-label="Previous Slide"
                            className='pointer-events-auto bg-white/90 hover:bg-white text-slate-800 shadow-md rounded-full p-2 transition-all hover:scale-105'
                        >
                            <FaAngleLeft size={16} />
                        </button>
                        <button 
                            onClick={nextImage} 
                            aria-label="Next Slide"
                            className='pointer-events-auto bg-white/90 hover:bg-white text-slate-800 shadow-md rounded-full p-2 transition-all hover:scale-105'
                        >
                            <FaAngleRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Slides Container */}
                <div className='flex h-full w-full overflow-hidden'>
                    {currentImagesList.map((imageURL, index) => (
                        <div
                            key={index}
                            className='w-full h-full min-w-full transition-transform duration-500 ease-out'
                            style={{ transform: `translateX(-${currentImage * 100}%)` }}
                        >
                            <img
                                src={imageURL}
                                alt={`Banner slide ${index + 1}`}
                                className='w-full h-full object-cover object-center'
                            />
                        </div>
                    ))}
                </div>

                {/* Dots Indicator */}
                <div className='absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10'>
                    {currentImagesList.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImage(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`transition-all duration-300 rounded-full ${
                                currentImage === index
                                    ? 'w-5 h-1.5 bg-indigo-600'
                                    : 'w-1.5 h-1.5 bg-white/70 hover:bg-white'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BannerProduct