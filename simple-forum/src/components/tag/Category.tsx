import { useState } from "react";
import { Link } from "react-router-dom";
import Search from "./Search";
import Typography from "@mui/material/Typography";
import { Link as MuiLink } from "@mui/material";
import Card from "@mui/material/Card";
import axiosInstance from "../../axiosConfig";
import ThreadCard from "../thread/ThreadCard";
import ThreadType from "../thread/types";
import "../thread/Thread.css";

const Category = () => {
  const [threads, setThreads] = useState<ThreadType[]>([]);
  const [searching, setSearching] = useState("");
  const [usesearch, setuseSearch] = useState(false);

  const handleSearch = async (query: string) => {
    setSearching(query);
    setThreads([]);

    if (query) {
      try {
        const response = await axiosInstance.get("/discussion_threads/search", {
          params: {
            tag_name: query,
          },
        });

        if (Array.isArray(response.data)) {
          setThreads(response.data);
        } else {
          console.error("Invalid response format:", response.data);
        }
      } catch (error: any) {
        console.error("Error searching threads:", error);
      }
    } else {
      setThreads([]);
    }
    setuseSearch(true);
  };

  return (
    <div className="bg">
      <Typography
        variant="h2"
        sx={{
          color: "white",
          fontWeight: "bold",
          marginBottom: 2,
          marginTop: 2,
        }}
      >
        Category
      </Typography>
      <Search onSearch={handleSearch} />

      {usesearch && threads.length === 0 ? (
        <Typography variant="body1" sx={{ color: "white" }}>
          Nothing found.
        </Typography>
      ) : (
        threads.map(
          (thread) =>
            thread.id && (
              <Card
                key={thread.id}
                sx={{
                  width: "60vw",
                  margin: "20px",
                  position: "relative",
                }}
              >
                <MuiLink
                  component={Link}
                  to={`/discussion_threads/${thread.id}`}
                  underline="none"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <ThreadCard thread={thread} />
                </MuiLink>
              </Card>
            )
        )
      )}
    </div>
  );
};

export default Category;
