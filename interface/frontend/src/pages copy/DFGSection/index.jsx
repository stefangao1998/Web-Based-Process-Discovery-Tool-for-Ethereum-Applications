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
  const {isAbleToShow, fileContent, distance, setDistance} = props
  const [uploadFile, setUploadFile] = useState(undefined);
  const [uploadFileExt, setUploadFileExt] = useState('');
  const [fileText, setFileText] = useState('');
  var node = [];
  var link = [];
  const [graphData, setGraphData] = useState(null)
  const [loading, setLoading] = useState(false)
	const [apiResponse, setApiResponse] = useState('')
	const [isUseLayout, setIsUseLayout] = useState(false)

  // useEffect(()=>{
  //   isAbleToShow&&autoDFGs()
  //   console.log(isAbleToShow, fileText)
  // }, [isAbleToShow])
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
  // upload file
  const handleChange = (event) => {
    console.log(defaultFile)
    const file = event.target.files[0]
    file&&setUploadFile(file)
    const ext = file&&file.name.split('.').pop();
    console.log(event)

    file&&setUploadFileExt(ext);
    file&&showFile(event)
    file&&setLoading(true)
  };

  const showFile = async (e) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => { 
      const text = (e.target.result)
      console.log(text)
      // alert(text)
      setIsUseLayout(false)
      setFileText(text)
      extractUploadTrace(text)
      setLoading(false)
    };
    reader.readAsText(e.target.files[0])
  }

  const handleText = (event) => {
    console.log(event.target.value)
  }

  const extractUploadTrace = (text) => {
    var traces = text.match(/<trace>([\s\S]*?)<\/trace>/g)
    for (var i=0; i<traces.length; i++) {
      extractEvent(traces[i]);
    }
    // extractEvent(traces[0]);
    console.log(node)
    console.log(link)
  }

  const extractTrace = () => {
    var traces = fileText.match(/<trace>([\s\S]*?)<\/trace>/g)
    for (var i=0; i<traces.length; i++) {
      extractEvent(traces[i]);
    }
    // extractEvent(traces[0]);

  }

  const extractEvent = (trace) => {
    // console.log(trace)
    console.log('extract trace')
    var events = trace.match(/<event>([\s\S]*?)<\/event>/g)
    for (var i=0; i<events.length; i++) {
      const name = extractEventName(events[i])
      if (i===0) {
        createNode('START')
        createLink('START', name)
      }
      if (i===events.length-1){
        createNode('END')
        createLink(name, 'END')
      }
      createNode(name)
      const nextName = extractEventName(events[i+1])
      createLink(name, nextName)
    }
    // createLink(extractEventName(events[0]), extractEventName(events[0]))
    setGraphData({nodes: node, links: link})
  }

  const extractEventName = (event) => {
    if (!event) return 'NOTEXIST'
    // console.log(event)
    var strArr = event.match(/.*concept:name.*\n/g)
    var str = JSON.stringify(strArr)
    // console.log(str)
    var matchStr = str.split('value=')[1]
    var name = matchStr.substring(
      2, 
      matchStr.indexOf('"', 2)-1
    );
    // console.log(name);
    return name
  }

  const createNode = (name) => {
    if (name==='NOTEXIST') return;
    if (checkExistNode(name)) {
      // console.log('exist')
    } else {
      // if (positionConfig[14]) console.log(positionConfig[999])
      if (name==='START') {
        node.push({id: `${name}`, label: `${name}`, x: positionConfig[0].x*ratio, y:positionConfig[0].y*ratio})
      } else if (name==='END') {
        node.push({id: `${name}`, label: `${name}`, x: positionConfig[999].x*ratio, y:positionConfig[999].y*ratio})
      } else {
        if (positionConfig[node.length]) {
          node.push({id: `${name}`, label: `${name}`, x: positionConfig[node.length].x*ratio, y:positionConfig[node.length].y*ratio})
        } else {
          node.push({id: `${name}`, label: `${name}`})
        }
      }
    }
    // console.log(checkExistNode(name))
    // node.push({id: `${name}`})
  }

  const createLink = (s, t) => {
    if (t==='NOTEXIST') return;
    // console.log(s, t)
    const label = checkExistLink(s, t)
    const newLabel = Number(label)+1; 
    if (label) {
      linkLabelPlusOne(s, t)
    } else {
      link.push({ source: `${s}`, target: `${t}`, label: `${newLabel}` })
     
    }
   
  }

  const checkExistNode = (name) => {
    // console.log(node)
    for (var i=0; i<node.length; i++) {
      if (node[i].id===name) return true
    }
    return false
  }

  const checkExistLink = (s, t) => {
    // console.log(link)
    // console.log(s, t)
    for (var i=0; i<link.length; i++) {
      if (link[i].source===s && link[i].target===t) return link[i].label
    }
    return 0
  }

  const linkLabelPlusOne = (s, t) => {
    for (var i=0; i<link.length; i++) {
      if (link[i].source===s && link[i].target===t) link[i].label=Number(link[i].label)+1
    }
  }


  const downloadXES = () => {
    setLoading(true)
		fetch(`http://localhost:9000/downloadLog`)
      .then(res => res.text())
      .then(res => {
				setApiResponse(res)
				console.log(res)
        fileDownload(res, 'logs.xes');
        setLoading(false)
			})
      .catch(err => {
				setLoading(false)
			});
  }

  const autoDFGs = () => {
    setLoading(true)
    // fetch("http://localhost:9000/execGeth")
		// `http://buildingsAPI:111/api/buildings/?myparam1=${abc_energyprogramid}`
		fetch(`http://localhost:9000/autoDFG`)
      .then(res => res.text())
      .then(res => {
				setApiResponse(res)
				console.log(res)
        setFileText(res)
				setLoading(false)
			})
      .catch(err => {
				setLoading(false)
			});
  }

  const savePNG = () => {
    // saveSvgAsPng.saveSvgAsPng(document.getElementsByName("svg-container-graph-id")[0], 'dfg.png', imageOptions);
    saveSvgAsPng.saveSvgAsPng(document.getElementsByClassName("dagre-d3-react")[0], 'dfg.png', imageOptions);
  };

  const hiddenFileInput = React.useRef(null);
  
  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = event => {
    hiddenFileInput.current.click();
  };


  return (
    <>
      <div style={{backgroundColor: 'red', width: '100%', display: 'flex', flexDirection: 'row', height: window.innerHeight*distance}}>
       
       
       
        {/* <input
          className="csv-input"
          type="file"
          name={"file"}
          placeholder={''}
          onChange={handleChange}
        />
        <p>{uploadFileExt}</p>
        <button onClick={extractTrace}>show DFGs</button> 
        {isAbleToShow&&<button onClick={autoDFGs}>auto</button> }
        {apiResponse&&<p>{apiResponse}</p>} */}

        <input
          type="file"
          ref={hiddenFileInput}
          onChange={handleChange}
          style={{display: 'none'}}
        />
        <div style={{backgroundColor: 'transparent', width: '100%', display: 'flex', flexDirection: 'column'}}>
          {/* {graphData&& */}
            {/* <div style={{display: 'flex', alignItems: 'flex-start', marginTop: '20px', marginLeft: '5%'}}>
              <h2 style={{color: '#fff'}}>Directed-Follow-</h2><h2 style={{color: '#fff'}}>Graph</h2>
            </div> */}
          {/* } */}
          <div style={{backgroundColor: '#2A2C40', width: '90%', alignSelf: 'center', display: 'flex', flexDirection: 'row', alignItems: 'flex-start'}}> {/** height: window.innerHeight/2-distance*10*/}
            {graphData ? <GraphSection graphData={graphData} isUseLayout={isUseLayout} distance={distance}/> : <p style={{color: '#fff', flex: 9}}>N/A</p>}
          </div>
        </div>

        {graphData &&
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <button
              style={{height: 60}}
              className={'btn-remix'}
              onClick={()=>setIsUseLayout(!isUseLayout)}
            >
              <SyncOutlined />
              Use Layout
            </button>
            <button
              style={{height: 60}}
              className={'btn-remix'}
              onClick={savePNG}
            >
              <VerticalAlignBottomOutlined />
              Download PNG
            </button>
            <button
              style={{height: 60}}
              className={'btn-remix'}
              onClick={downloadXES}
            >
              <VerticalAlignBottomOutlined />
              Download XES Log
            </button>
            <button
              style={{height: 60}}
              className={'btn-remix'}
              onClick={handleClick}
            >
              <FolderOpenOutlined />
              Upload XES
            </button>
          </div>
          }
          {!graphData &&<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <button
              style={{height: 60}}
              className={'btn-remix'}
              onClick={handleClick}
            >
              <FolderOpenOutlined />
              Upload XES
            </button>
          </div>}
        {loading && 
        <Spin 
          className="ant-spin-text" 
          tip={`Loading...`}
          style={{
            position: 'fixed', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />}
        <br />
      </ div>
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
