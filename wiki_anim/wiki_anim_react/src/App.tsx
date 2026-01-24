import { useState, useEffect } from 'react'
import './App.css';
import type { Anime } from './models/anime';
import AddCharacter from './components/add_character'
import type { Character } from './models/character';
import ShowDetails from './components/show_details';
import AddAnime from './components/add_anime';

function App() {
  const [animes, setAnimes] = useState<Anime[]>([])
  const [anime, setAnime] = useState<Anime | null>(null)
  const [showAddCharacter, setShowAddCharacter] = useState<boolean>(false);
  const [character, setSelectedCharacter] = useState<Character | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showAddAnime, setShowAddAnime] = useState<boolean>(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/animes')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setAnimes(data)
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [])


  const setCharacter = (character: Character | null) => {
    setSelectedCharacter(character);
    setShowAddCharacter(true);
  }

  const ResetElements = (data: Character, update: boolean) => {
    setSelectedCharacter(null);
    setShowAddCharacter(false);
    if (anime) {
      if (update) {
        const updatedCharacters = anime.characters?.map(char => char.id === data.id ? data : char) || [];
        setAnime({ ...anime, characters: updatedCharacters });
      } else {
        const updatedCharacters = [...(anime.characters || []), data];
        setAnime({ ...anime, characters: updatedCharacters });
      }
      setShowAddCharacter(false);
    }
  }

  const clearSelectedCharacter = (_: boolean) => {
    setSelectedCharacter(null);
    setShowAddCharacter(false);
  }

  const deleteCharacter = (characterId: number) => {
    if (!anime) return;
    const del = confirm("Are you sure you want to delete this character?");
    if (!del) return;

    const apiUrl = import.meta.env.VITE_API_URL;
    const baseUrl = apiUrl ? apiUrl : 'http://127.0.0.1:8000';
    fetch(`${baseUrl}/characters/${characterId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setAnime({
            ...anime,
            characters: anime.characters?.filter(char => char.id !== characterId)
          });
        }
      })
      .catch(error => console.error('Error deleting character:', error));
  }

  const deleteAnime = (animeId: number) => {
    const del = confirm("Are you sure you want to delete this anime?");
    if (!del) return;

    const apiUrl = import.meta.env.VITE_API_URL;
    const baseUrl = apiUrl ? apiUrl : 'http://127.0.0.1:8000';
    fetch(`${baseUrl}/animes/${animeId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setAnimes(animes.filter(anime => anime.id !== animeId));
        }
      })
      .catch(error => console.error('Error deleting anime:', error));
  }

  return (
    <>
      <div>
        <h1>Wiki Anime</h1>
        <p className='subtitle'>Find information about your favorite anime!</p>
      </div>
      {
        !anime ? (<button onClick={() => setShowAddAnime(true)} disabled={showAddCharacter}>Add Anime</button>) : null
      }
      {
        !anime ? (<div className="container">

          {showAddAnime && <AddAnime setAnimes={setAnimes} closeModal={() => setShowAddAnime(false)} />}
          {animes?.length === 0 ? (
            <p>No results found.</p>
          ) : (
            animes.map((anime: Anime) => (
              <div key={anime.id} className="card"  >
                <div onClick={() => setAnime(anime)} style={{ cursor: 'pointer' }}>
                  <h2>{anime.title}</h2>
                  <p>{anime.studio}</p>
                  <p>{anime.release_year}</p>
                </div>
                <button className='button_delete' onClick={() => deleteAnime(anime.id)}>Remove</button>
              </div>
            ))
          )}
        </div>) :
          (
            <div>
              <div style={{ display: 'flex', marginLeft: 5, padding: 5 }}>
                <button onClick={() => setAnime(null)} disabled={showAddCharacter}>&lt;</button>
                <h2 style={{ textAlign: 'center', marginLeft: 150 }}>{anime.title}</h2>
                <button onClick={() => setShowAddCharacter(!showAddCharacter)} style={{ marginLeft: 10 }} disabled={showAddCharacter}>Add Character</button>
              </div>
              <div className="container">
                {showDetails && character && <ShowDetails character={character} closeDetails={() => setShowDetails(false)} />}
                {showAddCharacter && <AddCharacter anime={anime} ResetElements={ResetElements} setShowAddCharacter={clearSelectedCharacter} character={character} />}

                {anime.characters?.map((character, index) => (
                  <div className="card_image" onClick={() => setShowDetails(true)} key={character.id}>
                    <div key={index}>
                      <p>{character.name}</p>
                      {character.image_url && <img style={{ width: 200, height: 100 }} src={character.image_url} alt={character.name} />}
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button className="button_delete" onClick={() => deleteCharacter(character.id)} disabled={showAddCharacter}>delete</button>
                        <button className="button_update" onClick={() => setCharacter(character)} disabled={showAddCharacter}>update</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
    </>
  )
}

export default App
