import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";
var temp = "";

function Row(props) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(props.fetchUrl);
            setMovies(request.data.results);
            return request;
        }

        fetchData();
    }, [props.fetchUrl]);

    const handleClick = (movie) => {
        var nameToSearch = movie?.title || movie?.name || movie?.original_name;
        if (temp == nameToSearch) {
            setTrailerUrl("");
        } else {
            temp = nameToSearch;
            // if (trailerUrl) {
            //     setTrailerUrl("");
            // } else {

            console.log(movie.name);
            movieTrailer(nameToSearch || "")
                .then((url) => {
                    const urlParams = new URLSearchParams(new URL(url).search);

                    setTrailerUrl(urlParams.get("v"));
                })
                .catch((error) => console.log(error));
        }
    };

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1,
        },
    };

    return (
        <div className="row">
            <h2>{props.title}</h2>
            <div className="row_posters">
                {movies.map((movie) => (
                    <img
                        key={movie.id}
                        onClick={() => handleClick(movie)}
                        className={`row_poster ${
                            props.isLargeRow && "row_posterLarge"
                        }`}
                        //className="row_poster"
                        src={`${base_url}${
                            props.isLargeRow
                                ? movie.poster_path
                                : movie.backdrop_path
                        }`}
                        alt={movie.name}
                    ></img>
                ))}
            </div>

            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts}></YouTube>}
        </div>
    );
}
export default Row;
