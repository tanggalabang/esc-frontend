// import ApplicationLogo from '@/components/ApplicationLogo'
// import Dropdown from '@/components/Dropdown'
import Link from 'next/link'
// import NavLink from '@/components/NavLink'
// import ResponsiveNavLink, {
//     ResponsiveNavButton,
// } from '@/components/ResponsiveNavLink'
// import { DropdownButton } from '@/components/DropdownLink'
import { useAuth } from '../../hooks/auth'
import { useRouter } from 'next/router'
import { useState } from 'react'

const Navigation = ({ user }) => {
    const router = useRouter()

    const { logout } = useAuth()

    const [open, setOpen] = useState(false)

    return (
        <nav className="bg-white border-b border-gray-100">
                            <button onClick={logout}>
                                Logout
                            </button>
        </nav>
    )
}

export default Navigation
