
import React from 'react';
import './add_character.css';
import type { Anime } from '../models/anime';
import type { Character } from '../models/character';
import ReactDOM from 'react-dom';

type props = { anime: Anime, ResetElements: Function, setShowAddCharacter: Function, character?: Character | null }

function AddCharacter({ anime, ResetElements, setShowAddCharacter, character }: props) {
  const [name, setName] = React.useState<string>(character?.name || '');
  const [role, setRole] = React.useState<string>(character?.role || '');
  const [imageUrl, setImageUrl] = React.useState<string>(character?.image_url || '');
  const [description, setDescription] = React.useState<string>(character?.description || '');

  const addCharacter = (newCharacter: Character) => {

    if (newCharacter.name.trim() === '' || newCharacter?.role?.trim() === '') {
      alert("Name and Role are required fields.");
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL;
    const baseUrl = apiUrl ? apiUrl : 'http://127.0.0.1:8000';

    let url = `${baseUrl}/characters`;
    let method = 'POST';
    if (newCharacter && newCharacter.id) {
      url = `${baseUrl}/characters/${newCharacter.id}`;
      method = 'PUT';
    }

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newCharacter)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Character added:', data);
        // Update the anime with the new character
        if (anime) {
          ResetElements(data, method === 'PUT');
          setShowAddCharacter(false);
        }
      })
      .catch(error => console.error('Error adding character:', error));
  }

  return ReactDOM.createPortal(
    <div className="add-character-card">
      <span className="close-button" onClick={() => setShowAddCharacter(false)}>X</span>
      <h2>{character ? "Edit Character" : "Add New Character"}</h2>
      <form>
        <input type="text" value={name} placeholder="Character Name" required name='name' onChange={(e) => setName(e.target.value)} />
        <input type="text" value={role} placeholder="Character Role" required name='role' onChange={(e) => setRole(e.target.value)} />
        <input type="text" value={imageUrl} placeholder="Character Image URL" name='image_url' onChange={(e) => setImageUrl(e.target.value)} />
        <input type="text" value={description} placeholder="Character Description" name='description' onChange={(e) => setDescription(e.target.value)} />
        <input type="hidden" value={anime.id} name='anime_id' />
        <button className="add-character-button" onClick={(e) => {
          e.preventDefault();
          const form = (e.target as HTMLButtonElement).form;
          addCharacter({
            id: character?.id || 0,
            name: (form?.elements.namedItem('name') as HTMLInputElement)?.value || '',
            role: (form?.elements.namedItem('role') as HTMLInputElement)?.value || '',
            image_url: (form?.elements.namedItem('image_url') as HTMLInputElement)?.value || '',
            description: (form?.elements.namedItem('description') as HTMLInputElement)?.value || '',
            anime_id: anime.id
          });
        }}>{character ? "Update Character" : "Add Character"}</button>
      </form>
    </div>,
    document.getElementById('modal-root') ?? document.body
  );
}

export default AddCharacter;