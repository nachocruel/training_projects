import type { Character } from "../models/character";
import './show_details.css';
import ReactDom from 'react-dom';

const ShowDetails = ({ character, closeDetails }: { character: Character, closeDetails: Function }) => {
    return ReactDom.createPortal(
        <div className="show-details-card">
            <span className="close-button" onClick={() => closeDetails()}>X</span>
            <h2>{character.name}</h2>
            <p><strong>Role:</strong> {character.role}</p>
            {character.image_url && <img src={character.image_url} alt={character.name} />}
            <p><strong>Description:</strong> {character.description}</p>
        </div>,
        document.getElementById('modal-root') as HTMLElement
    );
}

export default ShowDetails;