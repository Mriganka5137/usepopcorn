import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import StarRating from "./StarRating";
import App from "./App.jsx";
import "./index.css";

// function Test() {
//   const [movieRating, setMovieRating] = useState(0);

//   function handleMovieRating(rating) {
//     setMovieRating(rating);
//   }

//   return (
//     <div>
//       <StarRating
//         maxRating={5}
//         color="orange"
//         size={30}
//         onMovieRating={handleMovieRating}
//       />
//       <p>The movie was rated {movieRating} stars</p>
//     </div>
//   );
// }

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {
      <App />
      // <>
      //   <StarRating
      //     maxRating={5}
      //     color="#fcc419"
      //     size={30}
      //     message={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
      //     className={"test"}
      //     defaultRating={3}
      //   />
      //   <StarRating
      //     maxRating={10}
      //     color="green"
      //     size={30}
      //     message={["A", "B", "C", " D", "E", "F", "G", "H", "I", "J"]}
      //     defaultRating={5}
      //   />
      //   <Test />
      //   {/* <StarRating maxRating={10} /> */}
      // </>
    }
  </React.StrictMode>
);
