import { Logo } from "../Logo/Logo"
import {RxHamburgerMenu} from 'react-icons/rx'
import { Drawer } from "./Drawer"
import { useState } from "react"

export const HeaderApp = () => {
    const [viewDrawer, setViewDrawer] = useState(false);

    const toggleDrawer = () => setViewDrawer(!viewDrawer)

    return <header className="site-header-app">
        <Logo />
        <RxHamburgerMenu className="icon-burger" onClick={toggleDrawer}/>
        <Drawer viewDrawer={viewDrawer} toggleDrawer={toggleDrawer}/>
    </header>
}