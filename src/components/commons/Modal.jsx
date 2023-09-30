import { RxCross2 } from 'react-icons/rx'

export const Modal = ({ children, handleToggleModal, viewModal }) => {
  return (
    <div className="modal_commons" style={{opacity: viewModal ? 1 : 0, visibility: viewModal ? 'visible' : 'hidden', transition: 'all 0.3s ease'}}>
      <div>
        <RxCross2 onClick={handleToggleModal} className="modal_commons_close"/>
        {children}
      </div>
    </div>
  )
}
