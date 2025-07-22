import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

export default function VaultSideBar({ view, setView }) {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)

        return () => window.removeEventListener('resize', checkScreenSize)
    }, [])

    const handleChange = (nextView) => {
        setView(nextView)
    }

    const mediaTypes = [
        { value: 'movies', label: 'Movies', icon: '🎬' },
        { value: 'tv', label: 'TV Shows', icon: '📺' },
        { value: 'games', label: 'Games', icon: '🎮' },
        { value: 'music', label: 'Music', icon: '🎵' },
        { value: 'books', label: 'Books', icon: '📚' }
    ]

    return (
        <div className={`${isMobile ? 'w-full' : 'w-64'} bg-gray-800 p-4`}>
            <h2 className="text-white text-xl font-bold mb-6">Media Collections</h2>

            <div className={`${isMobile ? 'flex flex-wrap gap-2' : 'space-y-2'}`}>
                {mediaTypes.map((type) => (
                    <NavLink
                        key={type.value}
                        to={`/vault/${type.value}`}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            } ${isMobile ? 'flex-1 min-w-0' : 'w-full'}`
                        }
                        onClick={() => handleChange(type.value)}
                    >
                        <span className="text-xl">{type.icon}</span>
                        <span className={`font-medium ${isMobile ? 'text-sm' : ''}`}>
                            {type.label}
                        </span>
                    </NavLink>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-gray-400 text-sm font-medium mb-4">View Options</h3>
                <div className="space-y-2">
                    <button
                        onClick={() => setView('grid')}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${view === 'grid'
                                ? 'bg-gray-700 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`}
                    >
                        Grid View
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${view === 'list'
                                ? 'bg-gray-700 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`}
                    >
                        List View
                    </button>
                </div>
            </div>
        </div>
    )
}
