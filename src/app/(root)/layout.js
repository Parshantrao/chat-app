import SideBarWrapper from '@/components/sidebar/SideBarWrapper'
import React from 'react'

function Layout({ children }) {
    return (
        <SideBarWrapper>
            {children}
        </SideBarWrapper>
    )
}

export default Layout