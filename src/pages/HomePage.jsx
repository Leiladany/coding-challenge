import { Button, Card, Input, Stack, Typography } from "@mui/joy";
import { useState } from "react";
import axios from "axios";

export const HomePage = () => {
  const [search, setSearch] = useState("");
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState(null);

  const fetchPokemon = async (name) => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
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

  const handlePrevious = async () => {
    if (pokemon && pokemon.id > 1) {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${pokemon.id - 1}`
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
    }
  };

  const handleNext = async () => {
    if (pokemon && pokemon.id < 1010) {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${pokemon.id + 1}`
        );
        setPokemon({
          name: response.data.name,
          id: response.data.id,
          sprite: response.data.sprites.front_default,
        });
        setError(null);
      } catch (err) {
        setError("Not Found");
        setPokemon(null);
      }
    }
  };

  return (
    <Stack>
      <Stack sx={{ backgroundColor: "pink", p: 2 }}>
        <form onSubmit={handleSearch}>
          <Input
            placeholder="Type in here…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </Stack>
      {pokemon && (
        <Stack spacing={2} alignItems="center">
          <Card sx={{ backgroundColor: "blue", width: "15%" }}>
            <img src={pokemon.sprite} alt={pokemon.name} />
            <Typography variant="h6">{pokemon.name}</Typography>
            <Typography variant="body1">ID: {pokemon.id}</Typography>
          </Card>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={handlePrevious}
              disabled={pokemon.id === 1}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Next
            </Button>
          </Stack>
        </Stack>
      )}
      {error && (
        <Typography sx={{ color: "red", p: 2 }} variant="body1">
          {error}
        </Typography>
      )}
    </Stack>
  );
};
