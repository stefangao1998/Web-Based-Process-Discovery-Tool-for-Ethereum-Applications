import React, {useState, useEffect} from 'react';

import Papa from 'papaparse';
import { useTable } from 'react-table';
import Web3 from 'web3';
import {
  VerticalAlignBottomOutlined,
  FolderOpenOutlined,
  SyncOutlined
} from '@ant-design/icons';
import GraphSection from '../GraphSection';
import defaultFile from '../../assets/log_pid0_all.xes';
import Spin from 'antd/es/spin';
import 'antd/es/spin/style/css';

const saveSvgAsPng = require('save-svg-as-png')
const fileDownload = require('js-file-download');

const DFGSection = (props) => {
  const {
    isAbleToShow, 
    fileContent, 
    distance, 
    setDistance,
    graphData,
    isUseLayout,
    setIsUseLayout,
    extractEvent
  } = props

  useEffect(()=>{
    setIsUseLayout(false)
    fileContent&&console.log(fileContent)
    fileContent&&testExecTrace(fileContent)
  }, [fileContent])
  const testExecTrace = (fileContent) => {
    var traces = fileContent.match(/<trace>([\s\S]*?)<\/trace>/g)
    for (var i=0; i<traces.length; i++) {
      extractEvent(traces[i]);
    }
    // extractEvent(traces[0]);
  }

  return (
    <>
      <div style={{backgroundColor: 'transparent', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', height: window.innerHeight*(0.8-distance)}}>
        <div style={{backgroundColor: '#2A2C40', width: '95%', alignSelf: 'center', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          {graphData ? <GraphSection graphData={graphData} isUseLayout={isUseLayout} distance={distance}/> : <div style={{display: 'flex', color: '#767676', width: '100%', height: window.innerHeight*(0.8-distance), justifyContent: 'center'}}>No graph data</div>}
        </div>
      </div>
    </>
  )
}

const ratio = 3.5
const imageOptions = {
  scale: 5,
  encoderOptions: 1,
  backgroundColor: 'transparent',
  width: 0
}
const oldPositionConfig = {
  0: {
    x: 5,
    y: 50,
  },
  1: {
    x: 10,
    y: 30,
  },
  2: {
    x: 20,
    y: 50,
  },
  3: {
    x: 30,
    y: 20,
  },
  4: {
    x: 30,
    y: 80,
  },
  5: {
    x: 50,
    y: 10,
  },
  6: {
    x: 40,
    y: 60,
  },
  7: {
    x: 70,
    y: 35,
  },
  8: {
    x: 50,
    y: 90,
  },
  9: {
    x: 75,
    y: 60,
  },
  10: {
    x: 90,
    y: 30,
  },
  11: {
    x: 92,
    y: 100,
  },
  12: {
    x: 117,
    y: 70,
  },
  13: {
    x: 130,
    y: 50,
  },
  999: {
    x: 92,
    y: 92,
  }
}
const positionConfig = {
  0: {
    x: 80,
    y: 80,
  },
  1: {
    x: 100,
    y: 80,
  },
  2: {
    x: 120,
    y: 55,
  },
  3: {
    x: 120,
    y: 105,
  },
  4: {
    x: 130,
    y: 86,
  },
  5: {
    x: 140,
    y: 113,
  },
  6: {
    x: 140,
    y: 47,
  },
  7: {
    x: 160,
    y: 90,
  },
  8: {
    x: 160,
    y: 61,
  },
  9: {
    x: 180,
    y: 77,
  },
  10: {
    x: 180,
    y: 43,
  },
  11: {
    x: 180,
    y: 119,
  },
  12: {
    x: 200,
    y: 70,
  },
  13: {
    x: 200,
    y: 50,
  },
  14: {
    x: 220,
    y: 70,
  },
  15: {
    x: 220,
    y: 90,
  },
  16: {
    x: 220,
    y: 40,
  },
  17: {
    x: 220,
    y: 110,
  },
  18: {
    x: 240,
    y: 60,
  },
  19: {
    x: 240,
    y: 40,
  },
  20: {
    x: 240,
    y: 80,
  },
  21: {
    x: 240,
    y: 100,
  },
  999: {
    x: 250,
    y: 80,
  }
}

export default DFGSection
