import { useState } from "react"
import { Modal } from "../../../Modal/Modal"
import { ItemPending } from "./ItemPending"
import { TitlesListPendings } from "./TitlesListPendings"

export const MainPendings = () => {
    const [visibleModal, setVisibleModal] = useState(false);
    const [infoModal, setInfoModal] = useState(null)

    const toggleModal = (data) =>{
        setVisibleModal(!visibleModal);
        setInfoModal(data)
    }

    return <section className="main-pending">
        <h2>Public pendings</h2>
        <TitlesListPendings />
        
        <ItemPending toggleModal={toggleModal}/>
        <ItemPending toggleModal={toggleModal}/>
        <ItemPending toggleModal={toggleModal}/>
        <ItemPending toggleModal={toggleModal}/>
        <ItemPending toggleModal={toggleModal}/>
       
        <Modal title={infoModal?.titleModal} visibleModal={visibleModal} toggleModal={toggleModal}>
            <p>Info</p>
            <p>Info</p>
            <p>Info</p>
            <p>Info</p>
            <p>Info</p>
            <p>Info</p>
        </Modal>
    </section>
}