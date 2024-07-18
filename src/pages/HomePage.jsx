import {
  Button,
  Card,
  Stack,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

export const HomePage = () => {
  const [search, setSearch] = useState("");
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState(null);
  const [allNames, setAllNames] = useState([]);

  useEffect(() => {
    const fetchAllPokemonNames = async () => {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon?limit=898`
        );
        const names = response.data.results.map((pokemon) => pokemon.name);
        setAllNames(names);
      } catch (err) {
        console.error("Error fetching Pokémon", err);
      }
    };

    fetchAllPokemonNames();
  }, []);

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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      const foundPokemon = allNames.find((pokemonName) =>
        pokemonName.toLowerCase().startsWith(search.toLowerCase())
      );

      if (foundPokemon) {
        await fetchPokemon(foundPokemon);
      } else {
        setError(`No Pokémon found "${search}".`);
        setPokemon(null);
      }
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
    if (pokemon && pokemon.id < 898) {
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

  const filterOptions = (options, { inputValue }) => {
    return options.filter((option) =>
      option.toLowerCase().startsWith(inputValue.toLowerCase())
    );
  };

  return (
    <Stack>
      <Stack
        component="form"
        onSubmit={handleSearch}
        sx={{
          flexDirection: "row",
          justifyContent: "center",
          backgroundColor: "pink",
          p: 2,
        }}
      >
        <Autocomplete
          sx={{ width: "100%" }}
          freeSolo
          options={allNames}
          value={search}
          onChange={(event, newValue) => setSearch(newValue)}
          inputValue={search}
          onInputChange={(event, newInputValue) => setSearch(newInputValue)}
          filterOptions={filterOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Type Pokémon name..."
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: null,
              }}
            />
          )}
        />
        <Button type="submit" variant="contained" sx={{ ml: 1 }}>
          Search
        </Button>
      </Stack>
      {pokemon && (
        <Stack spacing={2} alignItems="center">
          <Card
            sx={{ textAlign: "center", backgroundColor: "blue", width: "15%" }}
          >
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
              disabled={pokemon.id === 898}
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
