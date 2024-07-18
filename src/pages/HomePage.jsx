import { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Stack,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";

export const HomePage = () => {
  const [search, setSearch] = useState(null);
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
        setError("Error fetching Pokémon");
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
      setError("Pokémon not found");
      setPokemon(null);
    }
  };

  const handleInputChange = (event, newInputValue) => {
    setSearch(newInputValue);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (search) {
      const foundPokemon = allNames.find((pokemonName) =>
        pokemonName.toLowerCase().startsWith(search.toLowerCase())
      );

      if (foundPokemon) {
        await fetchPokemon(foundPokemon);
      } else {
        setError(`No Pokémon found "${search}".`);
        setPokemon(null);
      }
    } else {
      setSearch(null);
      setPokemon(null);
      setError(null);
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
        setError("Pokémon not found");
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
        setError("Pokémon not found");
        setPokemon(null);
      }
    }
  };

  const filterOptions = (options, { inputValue }) => {
    if (!inputValue) return options;

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
            p: 2,
          }}
        >
          <Autocomplete
            sx={{ width: 300, backgroundColor: "white", color: "#FFCB05" }}
            options={allNames}
            value={search}
            onChange={(_event, newValue) => setSearch(newValue)}
            inputValue={search || ""}
            onInputChange={handleInputChange}
            filterOptions={filterOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Type Pokémon name..."
                variant="outlined"
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              ml: 1,
              backgroundColor: "white",
              color: "#FFCB05",
              border: "1px solid #1D2C5E",
            }}
          >
            Search
          </Button>
        </Stack>
        {pokemon && (
          <Stack sx={{ my: 4, alignItems: "center" }}>
            <Card
              sx={{
                textAlign: "center",
                border: "3px solid black",
                width: "15%",
              }}
            >
              <img src={pokemon.sprite} alt={pokemon.name} />
              <Stack sx={{ borderTop: "1px solid black" }}>
                <Typography>{pokemon.name}</Typography>
                <Typography>#{pokemon.id}</Typography>
              </Stack>
            </Card>
            <Stack
              sx={{
                my: 2,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Button
                sx={{
                  width: "50%",
                  backgroundColor: "white",
                  color: "#FFCB05",
                }}
                variant="contained"
                onClick={handlePrevious}
                disabled={pokemon.id === 1}
              >
                Previous
              </Button>
              <Button
                sx={{ backgroundColor: "white", color: "#FFCB05" }}
                variant="contained"
                onClick={handleNext}
                disabled={pokemon.id === 898}
              >
                Next
              </Button>
            </Stack>
          </Stack>
        )}
        {error && <Typography sx={{ color: "red", p: 2, alignSelf: "center" }}>{error}</Typography>}
      </Stack>
  );
};
