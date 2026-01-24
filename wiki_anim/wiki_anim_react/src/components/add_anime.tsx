

import ReactDom from 'react-dom';
import React from 'react';
import './add_anime.css';
import type { Anime } from '../models/anime';

const AddAnime = ({ setAnimes, closeModal }: { setAnimes: Function, closeModal: Function }) => {
    const [title, setTitle] = React.useState<string>('');
    const [studio, setStudio] = React.useState<string>('');
    const [release_year, setReleaseYear] = React.useState<number | null>(null);

    const performClose = () => {
        setTitle('');
        setStudio('');
        setReleaseYear(null);
        closeModal();
    }
    
    return ReactDom.createPortal(
        <div className='add_anime_card'>
            <span className='close_button' onClick={() => performClose()}>X</span>
            <h2>Add Anime</h2>
            <form>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <input type="text" placeholder="Studio" value={studio} onChange={(e) => setStudio(e.target.value)} />
                <input type="number" placeholder="Release Year" value={release_year || ''} onChange={(e) => setReleaseYear(parseInt(e.target.value))} />
                <button type="button" onClick={() => {
                    const apiUrl = import.meta.env.VITE_API_URL;
                    const baseUrl = apiUrl ? apiUrl : 'http://127.0.0.1:8000';
                    if (title.trim() === '' || studio.trim() === '' || !release_year) {
                        alert("All fields are required.");
                        return;
                    }

                    if (!release_year || release_year < 1900 || release_year > new Date().getFullYear()) {
                        alert("Please enter a valid release year.");
                        return;
                    }

                    fetch(`${baseUrl}/animes`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            title,
                            studio,
                            release_year
                        })
                    })
                        .then(response => response.json())
                        .then((data: Anime) => {
                            setTitle('');
                            setStudio('');
                            setReleaseYear(null);
                            closeModal();
                            setAnimes((prevAnimes: Anime[]) => [...prevAnimes, data]);
                        })
                        .catch(error => console.error('Error adding anime:', error));
                }}>Add Anime</button>
            </form>
        </div>,
        document.getElementById('modal-root') as HTMLElement
    )
}

export default AddAnime;