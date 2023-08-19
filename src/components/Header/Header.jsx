import { useLocation } from "react-router"
import { HeaderHome } from "./HeaderHome";
import { HeaderApp } from "./HeaderApp";

export const Header = () => {
    const {pathname} = useLocation();
    return <>{pathname == '/' ? <HeaderHome /> : <HeaderApp />}</>
    }