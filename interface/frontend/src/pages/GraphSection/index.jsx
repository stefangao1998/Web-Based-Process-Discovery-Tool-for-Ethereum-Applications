import React, {useState} from 'react';

import { Graph } from "react-d3-graph";
import DagreGraph from 'dagre-d3-react'

const GraphSection = (props) => {
  const {graphData, isUseLayout, distance} = props;
  const onClickNode = function(nodeId) {
    console.log(`Clicked node ${nodeId}`);
  };
  
  const onClickLink = function(source, target) {
    console.log(`Clicked link between ${source} and ${target}`);
  };
  
  return (
    <div style={{flex: 9}}>
      {isUseLayout ?
        <DagreGraph
          name={'svg-container-graph-id'}
          nodes={graphData.nodes}
          links={graphData.links}
          config={{
              rankdir: 'LR',
              align: 'UL',
              ranker: 'network-simplex'
          }}
          width='100%'
          height= {window.innerHeight*(0.8-distance)-6}
          animate={1000}
          shape='rect'
          fitBoundaries
          zoomable
        />        
        :
        <Graph
          id="graph-id" // id is mandatory
          data={graphData}
          config={{
            width: '100%',
            height: window.innerHeight*(0.8-distance)-6,
            initialZoom: 1,
            nodeHighlightBehavior: true,
            directed: true,
            d3: {
              gravity: -500,
              disableLinkForce: true
            },
            node: {
              color: "#d3d3d3",
              fontColor: "#000",
              size: 500,
              highlightStrokeColor: "red",
              symbolType: 'square',
              labelPosition: 'center',
              opacity: 0.7,
              // strokeColor: 'black'
            },
            link: {
              highlightColor: "red",
              renderLabel: true,
              // type: 'CURVE_SMOOTH',
              labelProperty: "label",
              fontColor: '#fff'
            },
          }}
          onClickNode={onClickNode}
          onClickLink={onClickLink}
          height={1000}
        />
      }
  </div>
  )
}

const mockData = {
  nodes: [{ id: "A", label: 'A', x:400, y:200 }, { id: "B", label: 'BB', x:400, y:100 }, { id: "C", label: 'CCC', x:400, y:100 }, { id: "D", label: 'DDDD', x:300, y:200 }, { id: "E", label: 'EEEEE', x:300, y:150 }],
  links: [
    { source: "A", target: "E", label: 1 },
    { source: "E", target: "D", label: '1' },
    { source: "A", target: "C", label: '1' },
    { source: "C", target: "D", label: '1' },
    { source: "A", target: "B", label: '1' },
    { source: "B", target: "C", label: '1' },
    { source: "C", target: "B", label: '1' },
    { source: "B", target: "D", label: '1' },
  ],
};

const sample = {
  nodes: [{ id: "A", label: 'A'}, { id: "B", label: 'BB'}, { id: "C", label: 'CCC'}, { id: "D", label: 'DDDD'}, { id: "E", label: 'EEEEE'}],
  links: [
    { source: "A", target: "E", label: 2 },
    { source: "E", target: "D", label: '1' },
    { source: "A", target: "C", label: '1' },
    { source: "C", target: "D", label: '1' },
    { source: "A", target: "B", label: '1' },
    { source: "B", target: "C", label: '1' },
    { source: "C", target: "B", label: '1' },
    { source: "B", target: "D", label: '1' },
  ],
};


export default GraphSection;