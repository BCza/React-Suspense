import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";

import "./styles.css";
import { fetchData } from "./fakeApi";

const resource = fetchData();

const DataItem = ({ index }) => {
  const item = resource.items.read()[index].read();
  // We know Math.random() generates in [0, 1]
  const xScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([0, 300]);
  const yScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([0, 300]);

  return (
    <circle
      cx={xScale(item.x)}
      cy={yScale(item.y)}
      r={4}
      fill="#f87"
      fillOpacity="0.3"
    />
  );
};

const DataList = () => {
  const count = resource.count.read();

  return (
    <svg width="300" height="300">
      {new Array(count).fill(null).map((d, i) => (
        <Suspense fallback={null} key={i}>
          <DataItem index={i} />
        </Suspense>
      ))}
    </svg>
  );
};

function App() {
  return (
    <div className="App">
      <h1>Streaming data into React with Suspense</h1>
      <p>
        10,000 datapoints, each with its own request rendered via
        &lt;Suspense&gt;. In reality you would batch these, like with paging.{" "}
        <a href="https://codesandbox.io/s/dark-waterfall-uzlzb">here</a>
      </p>
      <Suspense fallback={<h2>Loading ...</h2>}>
        <DataList />
      </Suspense>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
