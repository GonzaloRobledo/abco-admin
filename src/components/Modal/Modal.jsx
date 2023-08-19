import { RxCross2 } from 'react-icons/rx'
// eslint-disable-next-line react/prop-types
export const Modal = ({children, title, toggleModal, visibleModal}) => {
    return <div className={`modal ${visibleModal && 'visible'}`}>
        <div>
            <RxCross2 className="close-modal" onClick={() => toggleModal(null)}/>
            <h3>{title}</h3>
            {children}
        </div>
    </div>
}