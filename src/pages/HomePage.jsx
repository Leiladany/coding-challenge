import { Input, Stack, Typography } from "@mui/joy";
import { useState } from "react";
import axios from "axios";

export const HomePage = () => {
  const [search, setSearch] = useState("");
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState(null);

  const fetchPokemon = async (nameOrId) => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${nameOrId.toLowerCase()}`
      );
      setPokemon({
        name: response.data.name,
        id: response.data.id,
        sprite: response.data.sprites.front_default,
      });
      setError(null);
    } catch (err) {
      setError("Not found");
      setPokemon(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search) {
      fetchPokemon(search);
    }
  };

  return (
    <Stack>
      <form onSubmit={handleSearch}>
        <Input
          placeholder="Type in here…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
      {pokemon && (
        <>
          <img src={pokemon.sprite} alt={pokemon.name} />
          <Typography>{pokemon.name}</Typography>
          <Typography>{pokemon.id}</Typography>
        </>
      )}
      {error && <Typography>{error}</Typography>}
    </Stack>
  );
};
