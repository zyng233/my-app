import React, { useState, ChangeEvent, FormEvent } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface SearchProps {
  onSearch: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        id="query"
        name="query"
        label="Search tag..."
        variant="filled"
        value={query}
        onChange={handleChange}
        sx={{ marginBottom: 2, width: "50vw" }}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{ marginLeft: 2, marginTop: 1 }}
      >
        Search
      </Button>
    </form>
  );
};

export default Search;
